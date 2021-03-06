const { Router } = require('express')
const router = Router()
const { Direction, validateDirection } = require('../models/Direction')
const auth = require('../middleware/auth.middleware')


// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/direction/register

router.post('/register', auth, async (req, res) => {
    try {
        console.log(req.body);
        const { error } = validateDirection(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            value,
            price,
            label,
            section,
            subsection,
            room,
            doctorProcient,
            counteragentProcient,
            counterDoctor,
        } = req.body
        const direction = new Direction({
            value,
            price,
            label,
            section,
            subsection,
            room,
            doctorProcient,
            counteragentProcient,
            counterDoctor,
        })
        await direction.save()
        res.status(201).send(direction)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})
router.get('/id/:id', auth, async (req, res) => {
    try {
        console.log("Salom");
        const direction = await Direction.findById(req.params.id)
        res.json(direction)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/fizioterapevt', async (req, res) => {
    try {
        const direction = await Direction.find({
            section: "ФИЗИОТЕРАПИЯ"
        }).sort({ section: 1 })
        res.json(direction)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/direction
router.get('/:name', async (req, res) => {
    try {
        const name = new RegExp('.*' + req.params.name + ".*", "i")
        const direction = await Direction.find({
        })
            .or([{ section: name }, { subsection: name }])
            .sort({ section: 1 })
        res.json(direction)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/direction
router.get('/', async (req, res) => {
    try {
        const direction = await Direction.find().sort({ section: 1 })
        res.json(direction)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})




router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Direction.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Direction.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router