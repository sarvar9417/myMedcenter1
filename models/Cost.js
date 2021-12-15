const { Schema, model } = require('mongoose')
const Joi = require('joi')

const cost = new Schema({
    price: { type: Number, required: true },
    comment: { type: String },
    name: { type: String, required: true }
})

function validateCost(cost) {
    const schema = Joi.object({
        price: Joi.number().required(),
        comment: Joi.string(),
        name: Joi.string().required(),
    })
    return schema.validate(cost)
}

module.exports.validateCost = validateCost
module.exports.Cost = model('Cost', cost)