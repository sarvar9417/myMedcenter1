const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const section = new Schema({
    client: { type: Types.ObjectId, ref: "Clients" },
    connector: { type: Types.ObjectId, ref: "Connector" },
    name: { type: String, required: true },
    subname: { type: String },
    price: { type: Number, required: true },
    priceCashier: { type: Number, required: true },
    commentCashier: {type: String},
    comment: { type: String },
    summary: { type: String },
    done: { type: String, required: true },
    payment: { type: String, required: true },
    turn: { type: Number },
    bron: { type: String },
    bronDay: { type: Date },
    bronTime: { type: String },
    position: { type: String },
    checkup: { type: String },
    doctor: {type: String}


})

function validateSection(section) {
    const schema = Joi.object({
        client: Joi.string(),
        connector: Joi.string(),
        name: Joi.string(),
        subname: Joi.string(),
        price: Joi.number(),
        priceCashier: Joi.number(),
        commentCashier: Joi.string(),
        comment: Joi.string(),
        summary: Joi.string(),
        done: Joi.string(),
        payment: Joi.string(),
        turn: Joi.number(),
        bron: Joi.string(),
        bronDay: Joi.date(),
        bronTime: Joi.string(),
        position: Joi.string(),
        checkup: Joi.string(),
        doctor: Joi.string()

    })
    return schema.validate(section)
}

module.exports.validateSection = validateSection
module.exports.Section = model('Section', section)