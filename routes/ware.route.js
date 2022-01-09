const { Router } = require('express')
const router = Router()
const { Ware, validateWare } = require('../models/Ware')
const auth = require('../middleware/auth.middleware')
const { WareHouse } = require('../models/WareHouse')


// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/ware/register
router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateWare(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            name,
            type,
            // price,
            pieces,
            day,
            warehouse
        } = req.body
        const ware = new Ware({
            name,
            type,
            // price,
            pieces,
            warehouse,
            day
        })
        const warehouses = await WareHouse.findById(warehouse)
        warehouses.pieces = warehouses.pieces + parseInt(pieces)
        await warehouses.save()
        await ware.save()
        res.send(ware)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/warehouse/:id', auth, async (req, res) => {
    try {

        const ware = await Ware.find({
            warehouse: req.params.id
        })
        res.json(ware)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/ware
router.get('/', auth, async (req, res) => {
    try {
        const ware = await Ware.find().sort({ _id: 1 })
        res.json(ware)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const ware = await Ware.findById(req.params.id)
        res.json(ware)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/wares/:ware', auth, async (req, res) => {
    try {
        const ware = await Ware.find({
            value: req.params.ware
        })
        res.json(ware)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/:id', auth, async (req, res) => {
    try {
        const { error } = validateWare(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const id = req.params.id
        const {
            value,
            label,
            name,
            type,
            price,
            pieces,
            comment

        } = req.body
        const edit = await Ware.findById(id)
        edit.set({
            value,
            label,
            name,
            type,
            price,
            pieces: parseInt(edit.pieces) + parseInt(req.body.pieces)
        })
        const ware = new Ware({
            value,
            label,
            name,
            type,
            price,
            pieces,
            comment
        })
        await edit.save()
        await ware.save()
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const ware = await Ware.findById(id)
        const warehouse = await WareHouse.findById(ware.warehouse)
        warehouse.pieces = parseInt(warehouse.pieces) - parseInt(ware.pieces)
        const edit = await Ware.findByIdAndDelete(id)
        await warehouse.save()
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router