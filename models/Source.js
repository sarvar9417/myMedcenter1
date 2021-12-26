const {Schema, model} = require('mongoose')
const Joi = require('joi')

const source = new Schema({
    name: String
})

function validateSource(source) {
    const schema = Joi.object({
        name: Joi.string()
    })

    return schema.validate(source)
}

module.exports.validateSource = validateSource
module.exports.Source = model('Source', source)