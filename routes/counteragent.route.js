const { Router } = require('express')
const router = Router()
const { CounterAgent, validateCounterAgent } = require('../models/CounterAgent')
const auth = require('../middleware/auth.middleware')

router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateCounterAgent(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            firstname,
            lastname,
            fathername,
            phone,
            clinic, 
            section,
            procient
        } = req.body
        const agent = new CounterAgent({
            firstname,
            lastname,
            fathername,
            phone,
            clinic,
            section,
            procient
        })
        await agent.save()
        res.status(201).send(agent)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const counterAgent = await CounterAgent.find().sort({ _id: -1 })
        res.json(counterAgent);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const counterAgent = await CounterAgent.findById(req.params.id)
        res.json(counterAgent)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await CounterAgent.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const counterAgent = await CounterAgent.findByIdAndDelete(req.params.id)
        res.json(counterAgent)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router