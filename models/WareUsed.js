const { Schema, model, Types } = require('mongoose')
const Joi = require("joi")

const wareused = new Schema({
    connector: { type: Types.ObjectId, ref: "Connector" },
    sectionname: String,
    warehouse: { type: Types.ObjectId, ref: "WareHouse" },
    warehousename: String,
    section: { type: Types.ObjectId, ref: "Section" },
    day: Date,
    count: Number
})

function validateWareUsed(wareused) {
    const schema = Joi.object({
        connector: Joi.string(),
        sectionname: Joi.string(),
        warehouse: Joi.string(),
        warehousename: Joi.string(),
        section: Joi.string(),
        count: Joi.number(),
        day: Joi.date(),
    })
    return schema.validate(wareused)
}

module.exports.WareUsed = model("WareUsed", wareused)
module.exports.validateWareUsed = validateWareUsed
