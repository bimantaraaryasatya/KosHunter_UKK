const fs = require('fs')
const path = require('path')
const PDFDocument = require(`pdfkit`)
const bookModel = require(`../models/index`).book
const kosModel = require(`../models/index`).kos
const userModel = require(`../models/index`).user
const Op = require('sequelize').Op

const formatRupiah = (number) => {
    return 'Rp ' + Number(number).toLocaleString('id-ID')
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID')
}

const calculateMonths = (start, end) => {
    const s = new Date(start)
    const e = new Date(end)
    return (
        (e.getFullYear() - s.getFullYear()) * 12 +
        (e.getMonth() - s.getMonth()) + 1
    )
}


exports.getAllBook = async (request, response) => {
    try {
        const books = await bookModel.findAll({
            include: [
                { model: kosModel }, // nama di response berubah menjadi "ko" !Perhatian
                { model: userModel }
            ],
            order: [['createdAt', 'DESC']]
        })

        if (books.length === 0) {
            return response.status(404).json({
                status: false,
                message: `No data to load`
            })
        }

        return response.status(200).json({
            status: true,
            data: books,
            message: `Bookings have been loaded`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.createBook = async (request, response) => {
    try {
        const { kos_id, start_date, end_date } = request.body
        const idUser = request.user.id

        const newBook = await bookModel.create({
            kos_id,
            user_id: idUser,
            start_date,
            end_date,
            status: 'pending'
        })

        return response.status(200).json({
            status: true,
            data: newBook,
            message: "Booking has been created"
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.findBook = async (request, response) => {
    let keyword = request.body.keyword

    try {
        let books = await bookModel.findAll({
            where: {
                [Op.or]: [
                    { status: { [Op.substring]: keyword }},
                    { start_date: { [Op.substring]: keyword }},
                    { end_date: { [Op.substring]: keyword }}
                ]
            },
            include: [
                { model: kosModel },
                { model: userModel }
            ]
        })

        if (books.length === 0) {
            return response.status(404).json({
                status: false,
                message: 'No data to load'
            })
        }

        return response.status(200).json({
            status: true,
            data: books,
            message: 'Bookings have been loaded'
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.updateBook = async (request, response) => {
    try {
        let idBook = request.params.id
        const existingBook = await bookModel.findOne({where: {id: idBook}})

        if (!existingBook) {
            return response.status(404).json({
                status: false,
                message: `Booking with id ${idBook} not found`
            })
        }

        if (existingBook.user_id !== request.user.id) {
            return response.status(403).json({
                status: false,
                message: 'You can only update your own booking'
            })
        }

        const dataBook = {
            start_date: request.body.start_date,
            end_date: request.body.end_date,
        }

        if (!dataBook.start_date || !dataBook.end_date) {
            return response.status(400).json({
                status: false,
                message: 'start_date and end_date are required'
            })
        }

        if (new Date(dataBook.start_date) >= new Date(dataBook.end_date)) {
            return response.status(400).json({
                status: false,
                message: 'start_date must be before end_date'
            })
        }

        const oldData = existingBook.get({plain:true})
        const isSame = JSON.stringify({
            start_data: oldData.start_date,
            end_date: oldData.end_date
        }) === JSON.stringify(dataBook)

        if (isSame) {
            return response.status(400).json({
                status: false,
                message: "No changes detected. Dates are the same as before"
            })
        }

        await bookModel.update(dataBook, {where: {id: idBook}})

        return response.status(200).json({
            status: true,
            data: dataBook,
            message: 'Booking has been updated'
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.updateStatusBook = async (request, response) => {
    try {
        let idBook = request.params.id
        const { status } = request.body

        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return response.status(400).json({
                status: false,
                message: 'Invalid status value'
            })
        }

        const existingBook = await bookModel.findOne({where : { id: idBook }})

        if (!existingBook) {
            return response.status(404).json({
                status: false,
                message: `Booking with this id ${idBook} not found`
            })
        }

        const kos = await kosModel.findOne({where: { id: existingBook.kos_id }})
        if (!kos) {
            return response.status(404).json({
                status: false,
                message: `Kos with this id ${existingBook.kos_id} not found`
            })
        }

        const isAdmin = request.user.role === 'admin'
        const isOwner = kos.user_id === request.user.id

        if (!isAdmin && !isOwner) {
            return response.status(403).json({
                status: false,
                message: 'You are not the owner of this kos'
            })
        }

        await bookModel.update({status}, {where: {id: idBook}})

        let invoice = null

        if (status === 'accepted') {

            // ambil booking lengkap
            const booking = await bookModel.findOne({
                where: { id: idBook },
                include: [
                    { model: kosModel, as: 'kos' },
                    { model: userModel, as: 'user' }
                ]
            })

            const today = new Date()
            const invoiceNumber = `INV-${today.getTime()}`

        
            const invoicesDir = path.join(__dirname, '../invoices')
            if (!fs.existsSync(invoicesDir)) {
                fs.mkdirSync(invoicesDir, { recursive: true })
            }

         
            const fileName = `invoice-${booking.id}.pdf`
            const filePath = path.join(invoicesDir, fileName)

            const totalMonth = calculateMonths(booking.start_date, booking.end_date)
            const totalPrice = booking.kos.price_per_month * totalMonth

            const doc = new PDFDocument({ size: 'A4', margin: 40 })
            doc.pipe(fs.createWriteStream(filePath))

            doc
                .fontSize(20)
                .font('Helvetica-Bold')
                .text('INVOICE BOOKING KOS', { align: 'center' })

            doc.moveDown(0.5)
            doc
                .strokeColor('#000')
                .lineWidth(1)
                .moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke()

            doc.moveDown()

            doc
                .fontSize(10)
                .font('Helvetica')
                .text(`Invoice Number : ${invoiceNumber}`)
                .text(`Tanggal        : ${formatDate(today)}`)

            doc.moveDown()

            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .text('Detail Kos')

            doc
                .fontSize(10)
                .font('Helvetica')
                .text(`Nama Kos   : ${booking.kos.name}`)
                .text(`Alamat     : ${booking.kos.address}`)
                .text(`Harga/Bln  : ${formatRupiah(booking.kos.price_per_month)}`)

            doc.moveDown()


            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .text('Data Penyewa')

            doc
                .fontSize(10)
                .font('Helvetica')
                .text(`Nama  : ${booking.user.name}`)
                .text(`Email : ${booking.user.email}`)

            doc.moveDown()

            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .text('Detail Booking')

            doc
                .fontSize(10)
                .font('Helvetica')
                .text(`Periode    : ${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}`)
                .text(`Durasi     : ${totalMonth} bulan`)
                .text(`Total Bayar: ${formatRupiah(totalPrice)}`)

            doc.moveDown(2)

            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .text(`Status: ACCEPTED`, { align: 'right' })

            doc.moveDown(3)

            doc
                .fontSize(9)
                .font('Helvetica-Oblique')
                .text(
                    'Invoice ini sah dan digunakan sebagai bukti transaksi. Tidak memerlukan tanda tangan.',
                    { align: 'center' }
                )

            invoice = {
                invoice_number: invoiceNumber,
                total_month: totalMonth,
                total_price: totalPrice,
                file_name: fileName,
                file_path: `/invoices/${fileName}`
            }
            doc.end()
        }

        return response.json({
            status: true,
            data: { status },
            invoice: invoice,
            message: `Booking status has been updated`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.deleteBook = async (request, response) => {
    try {
        let idBook = request.params.id

        const deletedBook = await bookModel.destroy({where: {id: idBook}})
        if (deletedBook === 0) {
            return response.status(404).json({
                status: false,
                message: `Booking with this id ${idBook} not found`
            })
        }

        return response.status(200).json({
            status: true,
            message: `Booking has been deleted`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}