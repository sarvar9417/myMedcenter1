const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const doctorResume = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    fathername: { type: String },
    gender: { type: String, required: true },
    phone: { type: Number },
    born: { type: Date },
    section: { type: String } 
})

function validateDoctorResume(doctorResume) {
    const schema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        fathername: Joi.string(),
        section: Joi.string(),
        gender: Joi.string(),
        phone: Joi.number(),
        born: Joi.date()
    })
    return schema.validate(doctorResume)
}

module.exports.validateDoctorResume = validateDoctorResume
module.exports.DoctorResume = model('DoctorResume', doctorResume)