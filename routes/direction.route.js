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
            subsection

        } = req.body
        const direction = new Direction({
            value,
            price,
            label,
            section,
            subsection
        })
        await direction.save()
        res.status(201).send(direction)

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

router.get('/:id', auth, async (req, res) => {
    try {
        const direction = await Direction.findById(req.params.id)
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