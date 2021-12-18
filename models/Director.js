const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const director = new Schema({
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

function validateDirector(director) {
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
    return schema.validate(director)
}

function validateDirectorLogin(director) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6)
    })
    return schema.validate(director)
}

module.exports.validateDirector = validateDirector
module.exports.validateDirectorLogin = validateDirectorLogin
module.exports.Director = model('Director', director)