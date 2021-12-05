const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const connector = new Schema({
    client: { type: Types.ObjectId, ref: "Clients" },
})

function validateConnector(connector) {
    const schema = Joi.object({
        client: Joi.string()
    })
    return schema.validate(connector)
}

module.exports.validateConnector = validateConnector
module.exports.Connector = model('Connector', connector)