const { Router } = require('express')
const router = Router()
const { WareHouse, validateWareHouse } = require('../models/WareHouse')
const { validateWare, Ware } = require('../models/Ware')
const auth = require('../middleware/auth.middleware')


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
            value,
            label,
            name,
            type,
            price,
            pieces,
            comment
        } = req.body
        const warehouse = new WareHouse({
            value,
            label,
            name,
            type,
            price,
            pieces
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
        await warehouse.save()
        await ware.save()
        res.status(201).send(warehouse)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})



// /api/warehouse
router.get('/', auth, async (req, res) => {
    try {
        const warehouse = await WareHouse.find({
            pieces: {$gt: 0}
        }).sort({ _id: 1 })
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
        const { error } = validateWareHouse(req.body)
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
        const edit = await WareHouse.findById(id)
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
        const edit = await WareHouse.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router