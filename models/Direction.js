const { Schema, model } = require('mongoose')
const Joi = require('joi')

const direction = new Schema({
    value: { type: String, required: true },
    price: { type: Number, required: true },
    label: { type: String },
    subvalue: { type: String }
})

function validateDirection(direction) {
    const schema = Joi.object({
        value: Joi.string(),
        price: Joi.number(),
        label: Joi.string(),
        subvalue: Joi.string()

    })
    return schema.validate(direction)
}

module.exports.validateDirection = validateDirection
module.exports.Direction = model('Direction', direction)