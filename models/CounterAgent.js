const { Schema, model } = require('mongoose')
const Joi = require('joi')

const counterAgent = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    fathername: { type: String },
    phone: { type: Number },
    clinic: String,
    section: { type: String },
    procient: Number
})

function validateCounterAgent(counterAgent) {
    const schema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        fathername: Joi.string(),
        section: Joi.string(),
        phone: Joi.number(),
        clinic: Joi.string(),
        procient: Joi.number()
    })
    return schema.validate(counterAgent)
}

module.exports.validateCounterAgent = validateCounterAgent
module.exports.CounterAgent = model('CounterAgent', counterAgent)