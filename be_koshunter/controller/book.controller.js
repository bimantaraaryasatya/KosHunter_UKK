const bookModel = require(`../models/index`).book
const kosModel = require(`../models/index`).kos
const userModel = require(`../models/index`).user
const Op = require('sequelize').Op

exports.getAllBook = async (request, response) => {
    try {
        const books = await bookModel.findAll({
            include: [
                { model: kosModel },
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

}

exports.findBook = async (request, response) => {

}

exports.updateBook = async (request, response) => {

}

exports.deleteBook = async (request, response) => {

}