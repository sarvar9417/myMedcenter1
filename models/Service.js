const {Schema, model, Types} = require('mongoose')
const Joi = require("joi")

const service = new Schema({
    warehouse: { type: Types.ObjectId, ref: "WareHouse" },
    client: { type: Types.ObjectId, ref: "Clients" },
    connector: { type: Types.ObjectId, ref: "Connector" },
    name: { type: String },
    type: { type: String },
    pieces: { type: Number },
    price: { type: Number },
    priceone: Number,
    priceCashier: Number,
    payment: String,
    paymentMethod: String,
    commentCashier: { type: String },

})

function validateService(service) {
    const schema = Joi.object({
        warehouse: Joi.string(),
        client: Joi.string(),
        connector: Joi.string(),
        name: Joi.string(),
        type: Joi.string(),
        pieces: Joi.number(),
        priceone: Joi.number(),
        price: Joi.number(),
        priceCashier: Joi.number(),
        payment: Joi.string(),
        paymentMethod: Joi.string(),
        commentCashier: Joi.string()
    })
    return schema.validate(service)
}

module.exports.Service = model("Service", service)
module.exports.validateService = validateService
