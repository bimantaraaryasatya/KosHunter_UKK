const kosModel = require('../models/index').kos
const bookModel = require('../models/index').book
const Op = require('sequelize').Op

exports.getAllKos = async(request, response) => {
    try {
        const { search } = request.query
        const kos = await kosModel.findAll({
            where: search
                ?{
                    [Op.or] : [
                        {
                            name: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            address: {
                                [Op.like]: `%${search}%`
                            }
                        }
                    ]
                }
                : undefined
        })

        const result = kos.map(k => ({
            ...k.toJSON(),
            status: k.available_room === 0 ? 'FULL' : 'AVAILABLE'
        }))

        if (result.length === 0) {
            return response.status(200).json({
                status: false,
                message: `No data to load`
            })
        }

        return response.status(200).json({
            status: true,
            data: result,
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
        const {name, address, price_per_month, gender, total_room} = request.body
        const idUser = request.user.id
        const newKos = await kosModel.create({name, user_id: idUser, address, price_per_month, gender, total_room, available_room: total_room})
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

exports.findKos = async (request, response) => {
    const { name, gender } = request.body

    let whereClause = {}

    if (name) {
        whereClause.name = { [Op.substring]: name }
    }

    if (gender) {
        whereClause.gender = gender
    }

    try {
        const kos = await kosModel.findAll({ where: whereClause })

        if (kos.length === 0) {
            return response.status(404).json({
                status: false,
                message: "No data found"
            })
        }

        return response.json({
            status: true,
            data: kos
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
            gender: request.body.gender,
            total_room: request.body.total_room,
            available_room: request.body.total_room
        }
    
        let idKos = request.params.id
        const existingKos = await kosModel.findOne({where: {id: idKos}})
        if (!existingKos) {
            return response.status(404).json({
                status: false,
                message: `Kos with id ${idKos} not found`
            })
        }

        const isAdmin = request.user.role === 'admin'
        const isOwner = existingKos.user_id === request.user.id

        if (!isAdmin && !isOwner) {
            return response.status(403).json({
                status: false,
                message: 'You are not the owner of this kos'
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
        const existingKos = await kosModel.findOne({where: {id: idKos}})
        if (!existingKos) {
            return response.status(404).json({
                status: false,
                message: `Kos with id ${idKos} not found`
            })
        }
        if (request.user.role !== 'admin' &&  request.user.id !== existingKos.user_id) {
            return response.status(403).json({
                status: false,
                message: 'You do not have access for this action'
            })
        }

        const totalBooking = await bookModel.count({ where: { kos_id: idKos } })

        if (totalBooking > 0) {
        return response.status(400).json({
            status: false,
            message: "Cannot delete kos because it still has active bookings"
        })
        }

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