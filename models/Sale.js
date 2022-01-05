const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const sale = new Schema({
    client: {type: Types.ObjectId, ref: "Clients"},
    connector: { type: Types.ObjectId, ref: "Connector" },
    prosent: {type: Number, required: true},
    day: {type: Date}
})

function validateSale(sale){
    const Schema = Joi.object({
        client: Joi.string(),
        connector: Joi.string(),
        prosent: Joi.number(),
        day: Joi.date()
    })
    return Schema.validate(sale)
}

module.exports.validateSale = validateSale
module.exports.sale = model('Sale',sale)