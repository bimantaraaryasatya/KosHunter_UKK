const kosModel = require('../models/index').kos
const bookModel = require('../models/index').book
const kosImageModel = require('../models/index').kos_image
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
                        },
                        {
                            gender: {
                                [Op.like]: `%${search}%`
                            }
                        }
                    ]
                }
                : undefined,
                include: [
                    {
                        model: kosImageModel
                    }
                ]
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

exports.getMyKos = async (request, response) => {
    try {
        const userId = request.user.id

        const kos = await kosModel.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: kosImageModel
                }
            ]
        })

        const result = kos.map(k => ({
            ...k.toJSON(),
            status: k.available_room === 0 ? 'FULL' : 'AVAILABLE'
        }))

        return response.status(200).json({
            status: true,
            data: result,
            message: result.length === 0
                ? 'User has no kos yet'
                : 'User kos loaded'
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

exports.updateKos = async (request, response) => {
    try {
        const kosId = request.params.id;
        const { name, address, price_per_month, total_room, gender } = request.body;

        const kos = await kosModel.findOne({ where: { id: kosId } });
        if (!kos) return response.status(404).json({ status: false, message: "Kos not found" });
        const isAdmin = request.user.role === 'admin'
        if (kos.user_id !== request.user.id && !isAdmin) return response.status(403).json({ status: false, message: "Not owner" });

        // hitung booking accepted
        const acceptedBookingCount = await bookModel.count({ where: { kos_id: kosId, status: 'accepted' } });

        if (total_room < acceptedBookingCount) {
            return response.status(400).json({ status: false, message: `Total room cannot be less than accepted bookings (${acceptedBookingCount})` });
        }

        const available_room = total_room - acceptedBookingCount;

        await kos.update({ name, address, price_per_month, total_room, available_room, gender });

        return response.json({ status: true, message: "Kos updated successfully", data: kos });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ status: false, message: err.message });
    }
};



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