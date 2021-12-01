const {Schema, model} = require('mongoose')
const Joi = require('joi')

const reseption = new Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

function validateReseption(reseption) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6)
    })
    return schema.validate(reseption)
}

module.exports.validateReseption = validateReseption
module.exports.Reseption = model('Reseption', reseption)