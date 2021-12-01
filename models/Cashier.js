const { Schema, model } = require('mongoose')
const Joi = require('joi')

const cashier = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

function validateCashier(cashier) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6)
    })
    return schema.validate(cashier)
}

module.exports.validateCashier = validateCashier
module.exports.Cashier = model('Cashier', cashier)