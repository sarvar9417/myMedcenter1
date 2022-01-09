const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const counterAgentPayment = new Schema({
    client: { type: Types.ObjectId, ref: "Clients" },
    connector: { type: Types.ObjectId, ref: "Connector" },
    counteragent: { type: Types.ObjectId, ref: "CounterAgent" },
    counterdoctor: { type: Types.ObjectId, ref: "CounterDoctor" },
    paymentDay: { type: Date }
})

function validateCounterAgentPayment(counterAgentPayment) {
    const schema = Joi.object({
        client: Joi.string(),
        connector: Joi.string(),
        counteragent: Joi.string(),
        counterdoctor: Joi.string(),
        paymentDay: Joi.string()
    })
    return schema.validate(counterAgentPayment)
}

module.exports.validateCounterAgentPayment = validateCounterAgentPayment
module.exports.CounterAgentPayment = model('CounterAgentPayment', counterAgentPayment)