const { Schema, model } = require('mongoose')
const Joi = require('joi')

const counterAgent = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: Number },
})

function validateCounterAgent(counterAgent) {
    const schema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        phone: Joi.number(),
    })
    return schema.validate(counterAgent)
}

module.exports.validateCounterAgent = validateCounterAgent
module.exports.CounterAgent = model('CounterAgent', counterAgent)