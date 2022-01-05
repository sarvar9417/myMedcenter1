const {Schema, model} = require('mongoose')
const Joi = require("joi")

const ware = new Schema({
    value: String,
    label: String,
    name: String,
    type: String,
    price: Number,
    pieces: Number,
    comment: String,
})

function validateWare(ware) {
    const schema = Joi.object({
        value: Joi.string(),
        label: Joi.string(),
        name: Joi.string(),
        type: Joi.string(),
        price: Joi.number(),
        pieces: Joi.number(),
        comment: Joi.string()
    })
    return schema.validate(ware)
}

module.exports.Ware = model("Ware", ware)
module.exports.validateWare = validateWare
