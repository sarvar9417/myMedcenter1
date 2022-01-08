const { Router } = require('express')
const router = Router()
const { Payment, validatePayment } = require('../models/Payment')
const auth = require('../middleware/auth.middleware')
const mongoose = require('mongoose')
const { Clients } = require('../models/Clients')

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


router.get('/statsionar/:id', auth, async (req, res) => {
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

router.get('/director', async (req, res) => {
    try {
        const payment = await Payment.find()
        let payments = []
        payment.map(pay => {
            if (new mongoose.Types.ObjectId(pay._id).getTimestamp().toLocaleDateString() === new Date().toLocaleDateString()) {
                payments.push(pay)
            }
        })
        res.json(payments)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/directorclients', async (req, res) => {
    try {
        const payment = await Payment.find({
            position: { $ne: "statsionar" }
        })
        let payments = []
        payment.map(pay => {
            if (new mongoose.Types.ObjectId(pay._id).getTimestamp().toLocaleDateString() === new Date().toLocaleDateString()) {
                payments.push(pay)
            }
        })
        let clients = []
        for (let i = 0; i < payments.length; i++) {
            const client = await Clients.findById(payments[i].client)
            clients.push(client)
        }
        res.json({ payments, clients })
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