const { Schema, model, Types } = require('mongoose')
const Joi = require("joi")

const wareconnector = new Schema({
    section: { type: Types.ObjectId, ref: "Direction" },
    warehouse: { type: Types.ObjectId, ref: "WareHouse" },
    count: Number,
    sectionname: String,
    warehousename: String,
})

function validateWareConnector(wareconnector) {
    const schema = Joi.object({
        sectionname: Joi.string(),
        warehousename: Joi.string(),
        section: Joi.string(),
        warehouse: Joi.string(),
        count: Joi.number()
    })
    return schema.validate(wareconnector)
}

module.exports.WareConnector = model("WareConnector", wareconnector)
module.exports.validateWareConnector = validateWareConnector
