const jwt = require('jsonwebtoken')

const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return response.status(401).json({
            status: false,
            message: `Access token missing`
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return response.status(403).json({
                status: false,
                message: `Invalid or expired token`
            })
        }
        request.user = decoded
        next()
    })
}

const authorizeRoles = (...allowedRoles) => {
    return (request, response, next) => {
        const userRole = request.user?.role
        const userId = request.user?.id
        const targetId = parseInt(request.params.id)

        if (userId === targetId) {
            return next()
        }

        if (!userRole) {
            return response.status(403).json({
                status: false,
                message: `User role not found in token`
            })
        }

        if (!allowedRoles.includes(userRole)) {
            return response.status(403).json({
                status: false,
                message: `Access denied, you are not authorized`
            })
        }
        next()
    }
}

module.exports = {authenticateToken, authorizeRoles}