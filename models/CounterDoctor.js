const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const counterDoctor = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    // phone: { type: Number },
    clinic: String,
    // section: { type: String },
    counteragent: { type: Types.ObjectId, ref: "CounterAgent" },
    counteragentname: String
})

function validateCounterDoctor(counterDoctor) {
    const schema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        // section: Joi.string(),
        // phone: Joi.number(),
        clinic: Joi.string(),
        counteragent: Joi.string(),
        counteragentname: Joi.string()
    })
    return schema.validate(counterDoctor)
}

module.exports.validateCounterDoctor = validateCounterDoctor
module.exports.CounterDoctor = model('CounterDoctor', counterDoctor)