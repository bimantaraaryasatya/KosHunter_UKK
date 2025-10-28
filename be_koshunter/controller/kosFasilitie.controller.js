const kosFasilitieModel = require(`../models/index`).kos_fasilitie

exports.createFacilitiy = async(request, response) => {
    try {
        const {kos_id, facility} = request.body
        const newFacility = await kosFasilitieModel.create({kos_id, fasility: facility})
        return response.status(200).json({
            status: true,
            data: newFacility,
            message: `Facility has been created`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.updateFacility = async(request, response) => {
    try {
        let idKosFacility = request.params.id
        let dataKosFacility = {
            kos_id: request.body.kos_id,
            fasility: request.body.facility
        }

        await kosFasilitieModel.update(dataKosFacility, {where: { id:idKosFacility }})
        
        return response.json({
            status: true,
            data: dataKosFacility,
            message: `Data facility has been updated`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.deleteFacility = async(request, response) => {
    try {
        let idKosFacility = request.params.id

        const deletedFacility = await kosFasilitieModel.destroy({where: {id: idKosFacility}})

        if (deletedFacility === 0) {
            return response.status(404).json({
                status: false,
                message: `This facility with this id ${idKosFacility} is not found`
            })
        }

        return response.json({
            status: true,
            message: `Data facility has been deleted`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}