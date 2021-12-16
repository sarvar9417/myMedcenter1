const { Schema, model } = require('mongoose')
const Joi = require('joi')

const templateDoctor = new Schema({
    section: {type: String},
    subsection: { type: String },
    template: { type: String }
})

function validateTemplateDoctor(templateDoctor) {
    const schema = Joi.object({
        section: Joi.string(),
        subsection: Joi.string(),
        template: Joi.string()
    })
    return schema.validate(templateDoctor)
}

module.exports.validateTemplateDoctor = validateTemplateDoctor
module.exports.TemplateDoctor = model('TemplateDoctor', templateDoctor)