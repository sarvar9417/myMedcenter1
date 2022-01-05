const { Router } = require('express')
const router = Router()
const { Payment, validatePayment } = require('../models/Payment')
const auth = require('../middleware/auth.middleware')
const { WareHouse } = require('../models/WareHouse')

// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/payment/register
router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validatePayment(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            client,
            connector,
            total,
            type,
            card,
            transfer,
            cash,
            position
        } = req.body
        const payment = new Payment({
            client,
            connector,
            total,
            type,
            card,
            transfer,
            cash,
            position
        })
        await payment.save()
        res.status(201).send(payment)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/cashier/:id', auth, async (req, res) => {
    try {
        const payment = await Payment.find({
            connector: req.params.id
        })
        res.json(payment)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/cashier/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Payment.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/payment
router.get('/', async (req, res) => {
    try {
        const payment = await Payment.find().sort({ section: 1 })
        res.json(payment)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})



router.get('/:id', auth, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
        res.json(payment)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Payment.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router