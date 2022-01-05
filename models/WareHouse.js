const { Schema, model } = require('mongoose')
const Joi = require("joi")

const warehouse = new Schema({
    value: String,
    label: String,
    name: String,
    type: String,
    price: Number,
    pieces: Number
})

function validateWareHouse(warehouse) {
    const schema = Joi.object({
        value: Joi.string(),
        label: Joi.string(),
        name: Joi.string(),
        type: Joi.string(),
        price: Joi.number(),
        pieces: Joi.number(),
        comment: Joi.string()
    })
    return schema.validate(warehouse)
}

module.exports.WareHouse = model("WareHouse", warehouse)
module.exports.validateWareHouse = validateWareHouse
