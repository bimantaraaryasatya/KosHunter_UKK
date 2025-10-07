const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op

exports.getAllUser = async(request, response) => {
    try {
        const { search } = request.query;

        const users = await userModel.findAll({
            where: {
                name: {
                    [Op.like]: `%${search ? search.toString() : ''}`
                }
            }
        });

        return response.status(200).json({
            status: true,
            data: users,
            message: `Users have been loaded`
        })
    } catch (error) {
        return response.status(400).response({
            status: false,
            message: `There is an error. ${error.message}`
        })
    }
}

exports.findUser = async(request, response) => {
    let keyword = request.body.keyword

    try {
        
    } catch (error) {
        
    }
}

exports.updateUser = async(request, response) => {

}

exports.deleteUser = async(request, response) => {
    let idUser = request.params.id

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