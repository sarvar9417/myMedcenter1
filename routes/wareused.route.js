const { Router } = require('express')
const router = Router()
const { WareUsed, validateWareUsed } = require('../models/WareUsed')
const auth = require('../middleware/auth.middleware')
const { WareHouse } = require('../models/WareHouse')


// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/ware/register
router.post('/register', auth, async (req, res) => {
    try {
        console.log(req.body);
        const useds = req.body
        useds.map(async (used) => {
            const { error } = validateWareUsed(used)
            if (error) {
                return res.status(400).json({
                    error: error,
                    message: error.message
                })
            }
            const {
                connector,
                sectionname,
                warehouse,
                warehousename,
                section,
                count,
                day
            } = used
            const ware = new WareUsed({
                connector,
                sectionname,
                warehouse,
                warehousename,
                section,
                count,
                day
            })
            await ware.save()
            const warehouses = await WareHouse.findById(warehouse)
            warehouses.pieces = parseInt(warehouses.pieces) - parseInt(count)
            await warehouses.save()
        })

        res.send({ message: "Yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/warehouse/:id', auth, async (req, res) => {
    try {

        const ware = await WareUsed.find({
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
        const ware = await WareUsed.find().sort({ _id: -1 })
        res.json(ware)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const ware = await WareUsed.findById(req.params.id)
        res.json(ware)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/wares/:ware', auth, async (req, res) => {
    try {
        const ware = await WareUsed.find({
            value: req.params.ware
        })
        res.json(ware)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/:id', auth, async (req, res) => {
    try {
        const { error } = validateWareUsed(req.body)
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
        const edit = await WareUsed.findById(id)
        edit.set({
            value,
            label,
            name,
            type,
            price,
            pieces: parseInt(edit.pieces) + parseInt(req.body.pieces)
        })
        const ware = new WareUsed({
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
        const ware = await WareUsed.findById(id)
        const warehouse = await WareUsedHouse.findById(ware.warehouse)
        warehouse.pieces = parseInt(warehouse.pieces) - parseInt(ware.pieces)
        const edit = await WareUsed.findByIdAndDelete(id)
        await warehouse.save()
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router