const { Schema, model, Types } = require('mongoose')
const Joi = require("joi")

const payment = new Schema({
    client: { type: Types.ObjectId, ref: "Clients" },
    connector: { type: Types.ObjectId, ref: "Connector" },
    total: { type: Number },
    type: { type: String, minlength: 3 },
    card: { type: Number },
    transfer: { type: Number },
    cash: Number,
    position: String

})

function validatePayment(payment) {
    const schema = Joi.object({
        client: Joi.string(),
        connector: Joi.string(),
        total: Joi.number(),
        type: Joi.string(),
        card: Joi.number(),
        transfer: Joi.number(),
        cash: Joi.number(),
        position: Joi.string()
    })
    return schema.validate(payment)
}

module.exports.Payment = model("Payment", payment)
module.exports.validatePayment = validatePayment
