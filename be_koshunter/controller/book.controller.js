const fs = require('fs')
const path = require('path')
const PDFDocument = require(`pdfkit`)
const { sequelize } = require('../models/index')
const kos_image = require('../models/kos_image')
const bookModel = require(`../models/index`).book
const kosModel = require(`../models/index`).kos
const userModel = require(`../models/index`).user
const kosImageModel = require(`../models/index`).kos_image
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
                { model: kosModel, as: 'kos' }, // nama di response berubah menjadi "ko" !Perhatian
                { model: userModel, as: 'user' }
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

exports.getMyBook = async (request, response) => {
    try {
        const ownerId = request.user.id

        // ambil semua booking dari kos milik owner
        const books = await bookModel.findAll({
            include: [
                {
                    model: kosModel,
                    as: 'kos',
                    where: {
                        user_id: ownerId
                    }
                },
                {
                    model: userModel,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        if (books.length === 0) {
            return response.status(200).json({
                status: true,
                data: [],
                message: 'No booking found for your kos'
            })
        }

        const result = books.map(b => {
            const totalMonth = calculateMonths(b.start_date, b.end_date)
            const totalPrice = b.kos.price_per_month * totalMonth

            return {
                ...b.toJSON(),
                total_month: totalMonth,
                total_price: totalPrice
            }
        })

        return response.status(200).json({
            status: true,
            data: result,
            message: 'Bookings for owner kos loaded'
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.getMyBookingHistory = async (request, response) => {
    try {
        const userId = request.user.id

        const books = await bookModel.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: kosModel,
                    as: 'kos',
                    include: [
                        {
                            model: kosImageModel
                        }
                    ]
                },
                {
                    model: userModel,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        if (books.length === 0) {
            return response.status(200).json({
                status: true,
                data: [],
                message: 'No booking history found'
            })
        }

        const result = books.map(b => {
            const totalMonth = calculateMonths(b.start_date, b.end_date)
            const totalPrice = b.kos.price_per_month * totalMonth

            return {
                ...b.toJSON(),
                total_month: totalMonth,
                total_price: totalPrice
            }
        })

        return response.status(200).json({
            status: true,
            data: result,
            message: 'Booking history loaded'
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
        if (request.user.role === 'owner') {
            return response.status(403).json({
                status: false,
                message: "Owner cannot book their own kos"
            })
        }

        const { kos_id, start_date, end_date } = request.body
        const idUser = request.user.id

        const kos = await kosModel.findByPk(kos_id)

        if (!kos) {
            return response.status(404).json({
                status: false,
                message: "Kos not found"
            })
        }

        if (kos.available_room <= 0) {
            return response.status(400).json({
                status: false,
                message: "Room is already full"
            })
        }

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
                { model: kosModel},
                { model: userModel}
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
    const t = await sequelize.transaction()
    try {
        let idBook = request.params.id
        const { status } = request.body

        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            await t.rollback()
            return response.status(400).json({
                status: false,
                message: 'Invalid status value'
            })
        }

        const existingBook = await bookModel.findOne({where : { id: idBook }, transaction: t})

        if (!existingBook) {
            await t.rollback()
            return response.status(404).json({
                status: false,
                message: `Booking with this id ${idBook} not found`
            })
        }

        if (existingBook.status === 'accepted') {
            await t.rollback()
            return response.status(400).json({
                status: false,
                message: 'Booking already accepted'
            })
        }

        const kos = await kosModel.findOne({where: { id: existingBook.kos_id }, transaction: t})
        if (!kos) {
            await t.rollback()
            return response.status(404).json({
                status: false,
                message: `Kos with this id ${existingBook.kos_id} not found`
            })
        }

        const isAdmin = request.user.role === 'admin'
        const isOwner = kos.user_id === request.user.id

        if (!isAdmin && !isOwner) {
            await t.rollback()
            return response.status(403).json({
                status: false,
                message: 'You are not the owner of this kos'
            })
        }

        await bookModel.update({status}, {where: {id: idBook}})

        let invoice = null

        if (status === 'accepted') {

            if (kos.available_room <= 0) {
                await t.rollback()
                return response.status(400).json({
                    status: false,
                    message: 'Kos is already full'
                })
            }

            await kos.update({
                available_room: kos.available_room - 1
            }, { transaction: t })

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

        await bookModel.update(
            { status },
            { where: { id: idBook }, transaction: t }
        )

        await t.commit()

        return response.json({
            status: true,
            data: { status },
            invoice: invoice,
            message: `Booking status has been updated`
        })
    } catch (error) {
        await t.rollback()
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.deleteBook = async (request, response) => {
    const t = await sequelize.transaction()
    try {
        const idBook = request.params.id

        const booking = await bookModel.findOne({
            where: { id: idBook },
            transaction: t
        })

        if (!booking) {
            await t.rollback()
            return response.status(404).json({
                status: false,
                message: `Booking with this id ${idBook} not found`
            })
        }

        const kos = await kosModel.findOne({
            where: { id: booking.kos_id },
            transaction: t
        })

        if (!kos) {
            await t.rollback()
            return response.status(404).json({
                status: false,
                message: `Kos with this id ${booking.kos_id} not found`
            })
        }

        if (booking.status === 'accepted') {
            await kos.update(
                { available_room: kos.available_room + 1 },
                { transaction: t }
            )
        }

        await bookModel.destroy({
            where: { id: idBook },
            transaction: t
        })

        await t.commit()

        return response.status(200).json({
            status: true,
            message: `Booking has been deleted and room restored`
        })
    } catch (error) {
        await t.rollback()
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}


exports.getOwnerTransactionHistory = async (request, response) => {
    try {
        const userId = request.user.id
        const role = request.user.role
        const { date, month, year } = request.query

        let whereClause = {
            status: 'accepted'
        }

        if (date) {
            whereClause.createdAt = {
                [Op.between]: [
                    new Date(`${date} 00:00:00`),
                    new Date(`${date} 23:59:59`)
                ]
            }
        }

        if (month && year) {
            whereClause.createdAt = {
                [Op.between]: [
                    new Date(year, month - 1, 1),
                    new Date(year, month, 0, 23, 59, 59)
                ]
            }
        }

        if (role === 'owner') {
            const kosList = await kosModel.findAll({
                where: { user_id: userId },
                attributes: ['id']
            })

            if (kosList.length === 0) {
                return response.status(404).json({
                    status: false,
                    message: 'You do not have any kos'
                })
            }

            const kosIds = kosList.map(k => k.id)
            whereClause.kos_id = { [Op.in]: kosIds }
        }

        const transactions = await bookModel.findAll({
            where: whereClause,
            include: [
                {
                    model: kosModel,
                    as: 'kos',
                    attributes: ['name', 'address', 'price_per_month']
                },
                {
                    model: userModel,
                    as: 'user',
                    attributes: ['name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        if (transactions.length === 0) {
            return response.status(404).json({
                status: false,
                message: 'No transaction history found'
            })
        }

        return response.json({
            status: true,
            total_transaction: transactions.length,
            data: transactions
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}