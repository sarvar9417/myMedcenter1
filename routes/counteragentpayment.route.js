const { Router } = require('express')
const router = Router()
const { CounterAgentPayment, validateCounterAgentPayment } = require('../models/CounterAgentPayment')
const auth = require('../middleware/auth.middleware')

router.post('/reseption/register', auth, async (req, res) => {
    try {
        const { error } = validateCounterAgentPayment(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            client,
            connector,
            counteragent,
            counterdoctor,
            paymentDay
        } = req.body
        const agent = new CounterAgentPayment({
            client,
            connector,
            counteragent,
            counterdoctor,
            paymentDay
        })
        await agent.save()
        res.status(201).send(agent)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const counterAgentPayment = await CounterAgentPayment.find().sort({ _id: -1 })
        res.json(counterAgentPayment);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const counterAgentPayment = await CounterAgentPayment.findById(req.params.id)
        res.json(counterAgentPayment)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await CounterAgentPayment.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const counterAgentPayment = await CounterAgentPayment.findByIdAndDelete(req.params.id)

        res.json(counterAgentPayment)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router