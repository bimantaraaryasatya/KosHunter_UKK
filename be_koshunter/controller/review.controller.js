const reviewModel = require('../models/index').review
const userModel = require('../models/index').user

exports.createReview = async (request, response) => {
    try {
        const { kos_id, comment } = request.body
        const userData = request.user

        if (userData.role !== 'society') {
            return response.status(403).json({
                status: false,
                message: 'Hanya society yang boleh memberi review.'
            })
        }

        const newReview = await reviewModel.create({
            kos_id,
            comment,
            user_id: userData.id,
            parent_id: null
        })

        return response.status(201).json({
            status: true,
            data: newReview,
            message: 'Review berhasil dibuat.'
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.replyReview = async (request, response) => {
    try {
        const { parent_id, comment } = request.body
        const userData = request.user

        if (userData.role !== 'owner') {
            return response.status(403).json({
                status: false,
                message: 'Hanya owner yang boleh membalas review.'
            })
        }

        const parentReview = await reviewModel.findByPk(parent_id)
        if (!parentReview) {
            return response.status(404).json({
                status: false,
                message: 'Review yang akan dibalas tidak ditemukan.'
            })
        }

        const reply = await reviewModel.create({
            kos_id: parentReview.kos_id,
            comment,
            user_id: userData.id,
            parent_id
        })

        return response.status(201).json({
            status: true,
            data: reply,
            message: 'Balasan berhasil dikirim.'
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.getReviewsWithReplies = async (request, response) => {
    try {
        const { kos_id } = request.params

        const reviews = await reviewModel.findAll({
            where: { kos_id, parent_id: null },
            include: [
                {
                    model: reviewModel,
                    as: 'replies',
                    include: [
                        { model: userModel, attributes: ['id', 'name', 'role'] }
                    ]
                },
                { model: userModel, attributes: ['id', 'name', 'role'] }
            ],
            order: [['createdAt', 'ASC']]
        })

        if (reviews.length === 0) {
            return response.status(200).json({
                status: false,
                message: 'Belum ada review untuk kos ini.'
            })
        }

        return response.status(200).json({
            status: true,
            data: reviews,
            message: 'Berhasil mengambil review dan balasan.'
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}
