const kosModel = require('../models/index').kos
const Op = require('sequelize').Op

exports.getAllKos = async(request, response) => {
    try {
        const kos = await kosModel.findAll()

        if (kos.length === 0) {
            return response.status(200).json({
                status: false,
                message: `No data to load`
            })
        }

        return response.status(200).json({
            status: true,
            data: kos,
            message: 'Kos haven been loaded'
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.createKos = async (request, response) => {
    try {
        const {name, address, price_per_month, gender} = request.body
        const newKos = await kosModel.create({name, address, price_per_month, gender})
        return response.status(200).json({
            status: true,
            data: newKos,
            message: "Kos has been created"
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.findKos = async(request, response) => {
    let keyword = request.body.keyword
    try {
        let kos = await kosModel.findAll({
            where: {
                [Op.or] : [
                    {name: { [Op.substring]: keyword }}
                ]
            }
        })

        if (kos.length === 0) {
            return response.status(200).json({
                status: false,
                message: `No data to load`
            })
        }

        return response.json({
            status: true,
            data: kos,
            message: `Kos has been loaded`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.updateKos = async(request, response) => {
    
}

exports.deleteKos = async(request, response) => {
    try {
        let idKos = request.params.id
        
        const deletedKos = await kosModel.destroy({where: {id: idKos}})
    
        if (deletedKos === 0) {
            return response.status(404).json({
                status: false,
                message: `Kos with this id ${idKos} is not found`
            })
        }
    
        return response.json({
            status: true,
            message: `Data kos has been deleted`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}