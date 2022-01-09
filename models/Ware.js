const { Schema, model, Types } = require('mongoose')
const Joi = require("joi")

const ware = new Schema({
    name: String,
    type: String,
    // price: Number,
    pieces: Number,
    day: Date,
    warehouse: { type: Types.ObjectId, ref: "WareHouse" }
})

function validateWare(ware) {
    const schema = Joi.object({
        name: Joi.string(),
        type: Joi.string(),
        // price: Joi.number(),
        pieces: Joi.number(),
        day: Joi.date(),
        warehouse: Joi.string()
    })
    return schema.validate(ware)
}

module.exports.Ware = model("Ware", ware)
module.exports.validateWare = validateWare
