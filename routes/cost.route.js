const { Router } = require('express')
const router = Router()
const { Cost, validateCost } = require('../models/Cost')

// /api/auth/cost/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateCost(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { price, comment } = req.body
        const cost = new Cost({ price, comment })
        await cost.save()
        res.status(201).json({ message: "Xarajat qo'shildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/cost/
router.get('/', async (req, res) => {
    try {
        const costs = await Cost.find({}).sort({ _id: -1 })
        res.json(costs);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {

        const cost = await Cost.findById(req.params.id)
        res.json(cost);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Cost.findByIdAndUpdate(id, req.body)
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router