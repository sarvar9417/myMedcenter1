const { Schema, model } = require('mongoose')
const Joi = require('joi')

const companyLogo = new Schema({
    logo: { type: String}
})

function validateCompanyLogo(logos) {
    const schema = Joi.object({
        logo: Joi.string()
    })
    return schema.validate(logos)
}

module.exports.validateCompanyLogo = validateCompanyLogo
module.exports.CompanyLogo = model('CompanyLogo', companyLogo)