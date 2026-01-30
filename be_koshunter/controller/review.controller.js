const reviewModel = require('../models/index').review
const userModel = require('../models/index').user
const kosModel = require('../models/index').kos

exports.getAllReview = async (request, response) => {
    try {
        const reviews = await reviewModel.findAll({
            where: { parent_id: null }, // hanya review utama
            include: [
                {
                    model: kosModel,
                    as: 'kos',
                    attributes: ['id', 'name', 'address'] // sesuaikan field kos
                },
                {
                    model: userModel,
                    attributes: ['id', 'name', 'role']
                },
                {
                    model: reviewModel,
                    as: 'replies',
                    include: [
                        {
                            model: userModel,
                            attributes: ['id', 'name', 'role']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        if (reviews.length === 0) {
            return response.status(200).json({
                status: false,
                message: 'No reviews found'
            })
        }

        return response.status(200).json({
            status: true,
            data: reviews,
            message: 'All reviews loaded successfully'
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.createReview = async (request, response) => {
    try {
        const { kos_id, comment } = request.body
        const userData = request.user

        if (userData.role !== 'society') {
            return response.status(403).json({
                status: false,
                message: 'Only society can do a review'
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
            message: 'Review has been created'
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
                message: 'Only owner can reply the review'
            })
        }

        const parentReview = await reviewModel.findByPk(parent_id)
        if (!parentReview) {
            return response.status(404).json({
                status: false,
                message: 'Review was not found'
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
            message: 'Reply sent successfully.'
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
                message: 'There are no reviews for Kos yet.'
            })
        }

        return response.status(200).json({
            status: true,
            data: reviews,
            message: 'Reviews and replies has been loaded'
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}
