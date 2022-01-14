const { Router } = require('express')
const router = Router()
const { CounterDoctor, validateCounterDoctor } = require('../models/CounterDoctor')
const auth = require('../middleware/auth.middleware')

router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateCounterDoctor(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            firstname,
            lastname,
            // section:,
            // phone: Joi.number(),
            clinic,
            counteragent,
            counteragentname
        } = req.body
        const agent = new CounterDoctor({
            firstname,
            lastname,
            clinic,
            counteragent,
            counteragentname
        })
        await agent.save()
        res.status(201).send(agent)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/doctor/:id', async (req, res) => {
    try {
        const counterDoctor = await CounterDoctor.findById(req.params.id)
        res.json(counterDoctor)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const counterDoctor = await CounterDoctor.find({
            counteragent: req.params.id
        })
        res.json(counterDoctor)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const counterDoctor = await CounterDoctor.find().sort({ _id: -1 })
        res.json(counterDoctor);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})




router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await CounterDoctor.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const counterDoctor = await CounterDoctor.findByIdAndDelete(req.params.id)
        res.json(counterDoctor)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router