const userModel = require(`../models/index`).user
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

exports.register = async (request, response) => {
    try {
        const { name, email, password, phone } = request.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const existingEmail = await userModel.findOne({where: {email}})
        if (existingEmail) {
            return response.status(400).json({message: 'Email already exists'})
        }
        const user = await userModel.create({name, email, password: hashedPassword, phone, role: request.role})
        response.status(201).json({status: true, message: 'Guest registered!', data: user})
    } catch (error) {
        response.status(500).json({error: error.message})
    }
}

exports.login = async (request, response) => {
    try {
        const { email, password } = request.body
        const user = await userModel.findOne({where: {email}})
        if (!user) {
            return response.status(401).json({error: "Invalid credentials"})
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return response.status(401).json({error: "Invalid credentials"})
        }

        const token = jwt.sign({id: user.id, name: user.name, email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: "24h" })
        response.json({
            status: true,
            data: user,
            message: "Login successful",
            token: token
        })
    } catch (error) {
        response.status(500).json({error: error.message})
    }
}