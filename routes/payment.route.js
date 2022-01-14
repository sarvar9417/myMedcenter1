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

router.get('/directorclients/:start/:end/:type', async (req, res) => {
    try {
        const start = req.params.start
        const end = req.params.end
        const type = req.params.type
        const payment = await Payment.find({
            type: type
        }).sort({ _id: -1 })
        let payments = []
        payment.map(pay => {
            const year = new mongoose.Types.ObjectId(pay._id).getTimestamp().getFullYear()
            const month = new mongoose.Types.ObjectId(pay._id).getTimestamp().getMonth()
            const day = new mongoose.Types.ObjectId(pay._id).getTimestamp().getDate()
            if (
                Math.floor(new Date(year, month, day)) >= Math.floor(new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate())) &&
                Math.floor(new Date(year, month, day)) < Math.floor(new Date(new Date(end).getFullYear(), new Date(end).getMonth(), new Date(end).getDate())) + 86400000
            ) {
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

router.get('/directorclients/:start/:end', async (req, res) => {
    try {
        const start = req.params.start
        const end = req.params.end
        const payment = await Payment.find().sort({ _id: -1 })
        let payments = []
        payment.map(pay => {
            const year = new mongoose.Types.ObjectId(pay._id).getTimestamp().getFullYear()
            const month = new mongoose.Types.ObjectId(pay._id).getTimestamp().getMonth()
            const day = new mongoose.Types.ObjectId(pay._id).getTimestamp().getDate()
            if (
                Math.floor(new Date(year, month, day)) >= Math.floor(new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate())) &&
                Math.floor(new Date(year, month, day)) < Math.floor(new Date(new Date(end).getFullYear(), new Date(end).getMonth(), new Date(end).getDate())) + 86400000
            ) {
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