const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const doctor = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    doctorId: { type: Types.ObjectId, ref: "DoctorResume" }
})

function validateDoctor(doctor) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6),
        doctorId: Joi.string()
    })
    return schema.validate(doctor)
}

module.exports.validateDoctor = validateDoctor
module.exports.Doctor = model('Doctor', doctor)