const reviewModel = require('../models/index').review
const userModel = require('../models/index').user
const kosModel = require('../models/index').kos
const { Op } = require('sequelize')

exports.getAllReview = async (request, response) => {
    try {
        const reviews = await reviewModel.findAll({
            where: { parent_id: null },
            include: [
                {
                    model: kosModel,
                    as: 'kos',
                    attributes: ['id', 'name', 'address'] 
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

exports.getMyReview = async(request, response) => {
    try {
        const ownerId = request.user.id

        const kosList = await kosModel.findAll({
            where: { user_id: ownerId },
            attributes: ['id']
        })

        const kosIds = kosList.map(k => k.id)
        
        console.log('OWNER ID:', ownerId)
        console.log('KOS IDS:', kosIds)

        const reviews = await reviewModel.findAll({
            where: {
                parent_id: null,
                kos_id: kosIds 
            },
            include: [
                {
                    model: kosModel,
                    as: 'kos',
                    attributes: ['id', 'name', 'address'],
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
                status: true,
                data: [],
                message: 'No review found for your kos'
            })
        }

        return response.status(200).json({
            status: true,
            data: reviews,
            message: 'Bookings for owner kos loaded'
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

        if (!['society', 'admin'].includes(userData.role)) {
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

exports.deleteReview = async (request, response) => {
    try {
        const { id } = request.params
        const userData = request.user

        const review = await reviewModel.findByPk(id)

        if (!review) {
            return response.status(404).json({
                status: false,
                message: 'Review not found'
            })
        }

        // society hanya boleh hapus review miliknya sendiri
        if (
            userData.role === 'society' &&
            review.user_id !== userData.id
        ) {
            return response.status(403).json({
                status: false,
                message: 'You are not allowed to delete this review'
            })
        }

        // owner tidak boleh hapus review
        if (userData.role === 'owner') {
            return response.status(403).json({
                status: false,
                message: 'Owner cannot delete reviews'
            })
        }

        // hapus reply dulu (jika ada)
        await reviewModel.destroy({
            where: { parent_id: review.id }
        })

        // hapus review utama
        await review.destroy()

        return response.status(200).json({
            status: true,
            message: 'Review deleted successfully'
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}
