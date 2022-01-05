const { Router } = require('express')
const router = Router()
const { UsedRoom, validateUsedRoom } = require('../models/UsedRoom')
const auth = require('../middleware/auth.middleware')
const { Room } = require('../models/Rooms')

// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/room/register
router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateUsedRoom(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            room,
            client,
            connector,
            roomname,
            beginDay,
            endDay,
            position,
            bed,
            price,
            priceCashier

        } = req.body
        const newroom = new UsedRoom({
            room,
            roomname,
            client,
            connector,
            beginDay,
            endDay,
            position,
            bed,
            price,
            priceCashier
        })
        const rooms = await Room.findById(room)
        rooms.position = "band"
        await rooms.save()
        await newroom.save()
        res.status(201).send(newroom)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})



router.get('/reseption/:id', auth, async (req, res) => {
    try {
        const room = await UsedRoom.findOne({
            connector: req.params.id
        })
        res.json(room)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await UsedRoom.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await UsedRoom.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/room
router.get('/', async (req, res) => {
    try {
        const room = await UsedRoom.find().sort({ section: 1 })
        res.json(room)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})
module.exports = router