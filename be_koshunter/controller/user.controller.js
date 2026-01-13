const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op
const bcrypt = require(`bcrypt`)

exports.getAllUser = async (request, response) => {
    try {
        const { search } = request.query

        const users = await userModel.findAll({
            where: search
                ? {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            email: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            phone: {
                                [Op.like]: `%${search}%`
                            }
                        }
                    ]
                }
                : undefined
        })

        return response.status(200).json({
            status: true,
            data: users,
            message: "Users have been loaded"
        })
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `There is an error. ${error.message}`
        })
    }
}

exports.findUser = async(request, response) => {
    let keyword = request.body.keyword
    try {
        let users = await userModel.findAll({
            where: {
                [Op.or] : [
                    {name: { [Op.substring]: keyword }},
                    {email: { [Op.substring]: keyword }},
                    {role: { [Op.substring]: keyword }}
                ]
            }
        })

        if (users.length === 0) {
            return response.status(200).json({
                status: false,
                message: `No data to load`
            })
        }

        if (!keyword) {
            users = await userModel.findAll()
        }

        return response.json({
            status: true,
            data: users,
            message: `User has been loaded`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.createUser = async(request, response) => {
    try {
        const {name, email, password, phone, role} = request.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const existingEmail = await userModel.findOne({where: {email}})
        const existingPhone = await userModel.findOne({where: {phone}})
        if (existingEmail) {
            return response.status(400).json({
                status: false,
                message: 'Email already exists'
            })
        }
        if (existingPhone) {
            return response.status(400).json({
                status: false,
                message: 'One phone number only for one account'
            })
        }
        const newUser = await userModel.create({name, email, password: hashedPassword, phone, role})
        response.status(201).json({
            status: true, 
            data: newUser,
            message: 'Guest registered'
        })
    } catch (error) {
        response.status(500).json({
            status: false,
            error: error.message
        })
    }
}

exports.updateUser = async(request, response) => {
    let dataUser = {
        name: request.body.name,
        email: request.body.email,
        phone: request.body.phone,
        role: request.body.role
    }

    const isAdmin = request.user.role === 'admin'
    let idUser = request.params.id
    if (idUser !== request.user.id && !isAdmin) {
        return response.status(403).json({
            status: false,
            message: 'You are not the owner of this Id'
        })
    }
    userModel.update(dataUser, { where: { id: idUser } })
        .then(result => {
            return response.json({
                status: true,
                data: dataUser,
                message: `Data user has been updated`
            })
        })
        .catch(error => {
            return response.json({
                status: false,
                message: error.message
            })
        })
}

exports.deleteUser = async(request, response) => {
    let idUser = parseInt(request.params.id)
    const currentUser = request.user

    if (currentUser.role !== 'admin' && currentUser.id !== idUser) {
      return response.status(403).json({
        status: false,
        message: "You do not have access for this action"
      })
    }

    userModel.destroy({where: {id: idUser}})
        .then(result => {
            return response.json({
                status: true,
                message: "Data user has been deleted"
            })
        })
        .catch(error => {
            return response.json({
                status: false,
                message: error
            })
        })
}