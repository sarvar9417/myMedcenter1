const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const callCenter = new Schema({
    client: { type: Types.ObjectId, ref: "Clients" },
    position: String,
    voucher: String,
    illness: String,
    callDay: Date
})

function validateCallCenter(callCenter) {
    const schema = Joi.object({
        client: Joi.string(),
        position: Joi.string(),
        voucher: Joi.string(),
        illness: Joi.string(),
        callDay: Joi.date()
    })
    return schema.validate(callCenter)
}

module.exports.validateCallCenter = validateCallCenter
module.exports.CallCenter = model('CallCenter', callCenter)