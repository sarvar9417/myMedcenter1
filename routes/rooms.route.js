const { Router } = require('express')
const router = Router()
const { Room, validateRoom } = require('../models/Rooms')
const auth = require('../middleware/auth.middleware')


// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/room/register
router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateRoom(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            value,
            label,
            room,
            roomtype,
            bed,
            price,
            position

        } = req.body
        const newroom = new Room({
            value,
            label,
            room,
            roomtype,
            bed,
            price, 
            position
        })
        await newroom.save()
        res.status(201).send(newroom)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})



// /api/room
router.get('/', async (req, res) => {
    try {
        const room = await Room.find().sort({ section: 1 })
        res.json(room)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
        res.json(room)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Room.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Room.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router