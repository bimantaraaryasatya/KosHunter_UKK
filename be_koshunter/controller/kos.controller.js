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
        const idUser = request.user.id
        const newKos = await kosModel.create({name, user_id: idUser, address, price_per_month, gender})
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
            return response.status(404).json({
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
    try {
        let dataKos = {
            name: request.body.name,
            address: request.body.address,
            price_per_month: Number(request.body.price_per_month),
            gender: request.body.gender
        }
    
        let idKos = request.params.id
        const existingKos = await kosModel.findOne({where: {id: idKos}})
        if (!existingKos) {
            return response.status(404).json({
                status: false,
                message: `Kos with id ${idKos} not found`
            })
        }
        const oldData = existingKos.get({plain: true})
    
        const isSame = JSON.stringify({
            name: oldData.name,
            address: oldData.address,
            price_per_month: oldData.price_per_month,
            gender: oldData.gender
        }) === JSON.stringify(dataKos);
        
        console.log("OLD DATA:", oldData);
        console.log("NEW DATA:", dataKos);

        if (isSame) {
            return response.status(400).json({
                status: false,
                message: "No changes detected. Data is the same as before."
            });
        }
    
        await kosModel.update(dataKos, { where: { id: idKos } })
        
        return response.json({
            status: true,
            data: dataKos,
            message: `Data kos has been updated`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
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