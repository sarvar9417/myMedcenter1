const { Schema, model } = require('mongoose')
const Joi = require('joi')

const counterAgent = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: Number },
})

function validateCounterAgent(counterAgent) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6),
        firstname: Joi.string(),
        lastname: Joi.string(),
        phone: Joi.number(),
    })
    return schema.validate(counterAgent)
}

function validateCounterAgentLogin(counteragent) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6)
    })
    return schema.validate(counteragent)
}
module.exports.validateCounterAgentLogin = validateCounterAgentLogin
module.exports.validateCounterAgent = validateCounterAgent
module.exports.CounterAgent = model('CounterAgent', counterAgent)