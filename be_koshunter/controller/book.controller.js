const { json } = require('sequelize')

const bookModel = require(`../models/index`).book
const kosModel = require(`../models/index`).kos
const userModel = require(`../models/index`).user
const Op = require('sequelize').Op

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

        if (kos.user_id !== request.user.id) {
            return response.status(403).json({
                status: false,
                message: 'You are not the owner of this kos'
            })
        }

        await bookModel.update({status}, {where: {id: idBook}})

        return response.json({
            status: true,
            data: { status },
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