const { Schema, model } = require('mongoose')
const Joi = require('joi')

const companyLogo = new Schema({
    logo: { type: String },
    name: { type: String },
    companyname: { type: String },
    address: { type: String },
    orientation: { type: String },
    bank: { type: String },
    mfo: { type: String },
    accountnumber: { type: Number },
    inn: { type: Number },
    phone1: { type: Number },
    phone2: { type: Number },
    phone3: { type: Number }

})

function validateCompanyLogo(logos) {
    const schema = Joi.object({
        logo: Joi.string(),
        name: Joi.string(),
        companyname: Joi.string(),
        address: Joi.string(),
        orientation: Joi.string(),
        bank: Joi.string(),
        mfo: Joi.string(),
        accountnumber: Joi.number(),
        inn: Joi.number(),
        phone1: Joi.number(),
        phone2: Joi.number(),
        phone3: Joi.number()
    })
    return schema.validate(logos)
}

module.exports.validateCompanyLogo = validateCompanyLogo
module.exports.CompanyLogo = model('CompanyLogo', companyLogo)