const { Router } = require('express')
const router = Router()
const { Service, validateService } = require('../models/Service')
const auth = require('../middleware/auth.middleware')
const { WareHouse } = require('../models/WareHouse')

// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/service/register
router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateService(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            warehouse,
            client,
            connector,
            name,
            type,
            pieces,
            price,
            priceone,
            priceCashier,
            payment,
            paymentMethod,
            commentCashier
        } = req.body
        const service = new Service({
            warehouse,
            client,
            connector,
            name,
            type,
            pieces,
            price,
            priceone,
            priceCashier,
            payment,
            paymentMethod,
            commentCashier
        })
        const ware = await WareHouse.findById(warehouse)
        ware.pieces = ware.pieces - pieces
        await ware.save()
        await service.save()
        res.status(201).send(service)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/reseption/:id', auth, async (req, res) => {
    try {
        const service = await Service.find({
            connector: req.params.id
        })
        res.json(service)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/cashierconnector/:id', auth, async (req, res) => {
    try {
        const service = await Service.find({
            connector: req.params.id,
            payment: "kutilmoqda"
        })
        res.json(service)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/cashier/:id', auth, async (req, res) => {
    try {
        const service = await Service.find({
            client: req.params.id
        })
        res.json(service)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/cashier/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Service.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/service
router.get('/', async (req, res) => {
    try {
        const service = await Service.find().sort({ section: 1 })
        res.json(service)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})



router.get('/:id', auth, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
        res.json(service)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Service.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router