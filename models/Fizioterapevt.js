const { Schema, model } = require('mongoose')
const Joi = require('joi')

const fizioterapevt = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    fathername: { type: String },
    phone: { type: Number },
    born: { type: Date },
    section: { type: String },
    image: { type: String }
})

function validateFizioterapevt(fizioterapevt) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6),
        firstname: Joi.string(),
        lastname: Joi.string(),
        fathername: Joi.string(),
        section: Joi.string(),
        phone: Joi.number(),
        born: Joi.date(),
        image: Joi.string()
    })
    return schema.validate(fizioterapevt)
}

function validateFizioterapevtLogin(fizioterapevt) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6)
    })
    return schema.validate(fizioterapevt)
}

module.exports.validateFizioterapevtLogin = validateFizioterapevtLogin
module.exports.validateFizioterapevt = validateFizioterapevt
module.exports.Fizioterapevt = model('Fizioterapevt', fizioterapevt)