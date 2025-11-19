const kosImageModel = require(`../models/index`).kos_image
const path = require('path')
const fs = require('fs')
const { where } = require('sequelize')


exports.createKosImage = async(request, response) => {
    try {
        const { kos_id } = request.body
        const file = request.file ? request.file.filename : null

        if (!kos_id || !file) {
            return response.status(400).json({
                status: false,
                message: `Kos id and image file are required`
            })
        }

        const newImage = await kosImageModel.create({ kos_id, file })

        return response.status(200).json({
            status: true,
            data: newImage,
            message: `Image has been uploaded`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.getAllKosImage = async(request, response) => {
    try {
        const images = await kosImageModel.findAll()
        return response.status(200).json({
            status: true,
            data: images,
            message: `All images have been retrieved`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.getKosImageByKosId = async(request, response) => {
    try {
        const kos_id = parseInt(request.params.kos_id)
        const images = await kosImageModel.findAll({ where: {kos_id} })

        if (images.length === 0) {
            return response.status(404).json({
                status: false,
                message: `No images found for Kos with ID ${kos_id}`
            })
        }

        if (!kos_id) {
            return response.status(400).json({
                status: false,
                message: `Kos id is required`
            }) 
        }

        return response.status(200).json({
            status: true,
            data: images,
            message: `Images for Kos with ID ${kos_id} have been retrieved`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.deleteKosImage = async(request, response) => {
    try {
        const { id } = request.params

        const image = await kosImageModel.findByPk(id)
        if (!image) {
            return response.status(404).json({
                status: false,
                message: `Image with ID ${id} not found`
            })
        }

        const imagePath = path.join(__dirname, '..', 'public', 'kos_image', image.file);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }

        await image.destroy()

        return response.json({
            status: true,
            message: `Image with ID ${id} has been deleted`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}