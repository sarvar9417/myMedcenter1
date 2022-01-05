const { Schema, model } = require('mongoose')
const Joi = require("joi")

const room = new Schema({
    value: String,
    label: String,
    room: String,
    roomtype: String,
    bed: String,
    price: Number,
    position: String
})

function validateRoom(room) {
    const schema = Joi.object({
        value: Joi.string(),
        label: Joi.string(),
        room: Joi.string(),
        roomtype: Joi.string(),
        bed: Joi.string(),
        price: Joi.number(),
        position: Joi.string()
    })
    return schema.validate(room)
}

module.exports.Room = model("Room", room)
module.exports.validateRoom = validateRoom
