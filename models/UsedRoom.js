const { Schema, model , Types} = require('mongoose')
const Joi = require("joi")

const usedroom = new Schema({
    room: { type: Types.ObjectId, ref: "Room" },
    roomname: String,
    client: { type: Types.ObjectId, ref: "Clients" },
    connector: { type: Types.ObjectId, ref: "Connector" },
    beginDay: Date,
    endDay: Date,
    position: String,
    bed: String,
    price: Number,
    priceCashier: Number

})

function validateUsedRoom(usedroom) {
    const schema = Joi.object({
        room: Joi.string(),
        roomname: Joi.string(),
        client: Joi.string(),
        connector: Joi.string(),
        beginDay: Joi.date(),
        endDay: Joi.date(),
        position: Joi.string(),
        bed: Joi.string(),
        price: Joi.number(),
        priceCashier: Joi.number()
    })
    return schema.validate(usedroom)
}

module.exports.UsedRoom = model("UsedRoom", usedroom)
module.exports.validateUsedRoom = validateUsedRoom
