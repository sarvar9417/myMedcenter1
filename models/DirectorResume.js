const { Schema, model } = require('mongoose')
const Joi = require('joi')

const directorResume = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    fathername: { type: String },
    gender: { type: String, required: true },
    phone: { type: Number },
    born: { type: Date },
    section: { type: String },
    img: {type:String}
})

function validateDirectorResume(directorResume) {
    const schema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        fathername: Joi.string(),
        section: Joi.string(),
        gender: Joi.string(),
        phone: Joi.number(),
        born: Joi.date(),
        img: Joi.string()
    })
    return schema.validate(directorResume)
}

module.exports.validateDirectorResume = validateDirectorResume
module.exports.DirectorResume = model('DirectorResume', directorResume)