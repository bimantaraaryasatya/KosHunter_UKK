const userModel = require(`../models/index`).user
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

exports.register = async (request, response) => {
    try {
        const { name, email, password, phone } = request.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const existingEmail = await userModel.findOne({where: {email}})
        if (existingEmail) {
            return response.status(400).json({
                status: false,
                message: 'Email already exists'
            })
        }
        const user = await userModel.create({name, email, password: hashedPassword, phone, role: 'society'})
        response.status(201).json({
            status: true, 
            data: user,
            message: 'Guest registered!'
        })
    } catch (error) {
        response.status(500).json({
            status: false,
            error: error.message
        })
    }
}

exports.registerOwner = async (request, response) => {
    try {
        const { name, email, password, phone } = request.body

        const user = await userModel.findOne({ where: { email } })

        if (!user) {
            return response.status(404).json({
                status: false,
                message: "You must register as society first"
            })
        }

        if (user.role !== "society") {
            return response.status(400).json({
                status: false,
                message: "User is already an owner"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return response.status(401).json({
                status: false,
                message: "Invalid credentials"
            })
        }

        user.name = name ?? user.name
        user.phone = phone ?? user.phone

        user.role = "owner"
        await user.save()

        response.json({
            status: true,
            data: user,
            message: "Successfully registered as owner"
        })
    } catch (error) {
        response.status(500).json({
            status: false,
            error: error.message 
        })
    }
}

exports.login = async (request, response) => {
    try {
        const { email, password } = request.body
        const user = await userModel.findOne({where: {email}})
        if (!user) {
            return response.status(401).json({
                status: false,
                error: "Invalid credentials"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return response.status(401).json({
                status: false,
                error: "Invalid credentials"
            })
        }

        const token = jwt.sign({id: user.id, name: user.name, email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: "24h" })
        response.json({
            status: true,
            data: user,
            message: "Login successful",
            token: token
        })
    } catch (error) {
        response.status(500).json({
            status: false,
            error: error.message
        })
    }
}