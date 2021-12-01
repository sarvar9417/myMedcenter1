const { Schema, model } = require('mongoose')
const Joi = require('joi')


const clients = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    fathername: { type: String },
    id: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: Number },
    born: { type: Date },    
})

function validateClients(clients) {
    const schema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        fathername: Joi.string(),
        id: Joi.number(),
        gender: Joi.string(),
        phone: Joi.number(),
        born: Joi.date()
    })
    return schema.validate(clients)
}

module.exports.validateClients = validateClients
module.exports.Clients = model('Clients', clients)