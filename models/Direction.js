const { Schema, model } = require('mongoose')
const Joi = require('joi')

const direction = new Schema({
    value: { type: String, required: true },
    price: { type: Number, required: true },
    label: { type: String },
    section: { type: String },
    subsection: { type: String },
    room: { type: String },
    doctorProcient: Number,
    counteragentProcient: Number,
    counterDoctor: Number,

})

function validateDirection(direction) {
    const schema = Joi.object({
        value: Joi.string(),
        price: Joi.number(),
        label: Joi.string(),
        section: Joi.string(),
        subsection: Joi.string(),
        room: Joi.string(),
        doctorProcient: Joi.number(),
        counteragentProcient: Joi.number(),
        counterDoctor: Joi.number(),

    })
    return schema.validate(direction)
}

module.exports.validateDirection = validateDirection
module.exports.Direction = model('Direction', direction)