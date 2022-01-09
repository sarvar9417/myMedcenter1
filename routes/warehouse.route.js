const { Router } = require('express')
const router = Router()
const { WareHouse, validateWareHouse } = require('../models/WareHouse')
const auth = require('../middleware/auth.middleware')
const { Ware } = require('../models/Ware')


// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/warehouse/register
router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateWareHouse(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            name,
            type,
            price,
            pieces
        } = req.body
        const warehouse = new WareHouse({
            name,
            type,
            price,
            pieces
        })
        await warehouse.save()
        res.send(warehouse)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/warehouse
router.get('/', auth, async (req, res) => {
    try {
        const warehouse = await WareHouse.find().sort({ _id: 1 })
        res.json(warehouse)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const warehouse = await WareHouse.findById(req.params.id)
        res.json(warehouse)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/wares/:ware', auth, async (req, res) => {
    try {
        const warehouse = await Ware.find({
            value: req.params.ware
        })
        res.json(warehouse)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const { error } = validateWareHouse(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const ware = await WareHouse.findByIdAndUpdate(id, req.body)
        res.json(ware)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const ware = await Ware.find({ warehouse: id })
        for (let i = 0; i < ware.length; i++) {
            const element = await Ware.findByIdAndDelete(ware[i]._id)
        }
        const edit = await WareHouse.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router