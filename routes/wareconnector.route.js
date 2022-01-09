const { Router } = require('express')
const router = Router()
const { WareConnector, validateWareConnector } = require('../models/WareConnector')
const auth = require('../middleware/auth.middleware')


// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/ware/register
router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateWareConnector(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            section,
            warehouse,
            count,
            sectionname,
            warehousename
        } = req.body
        const wareconnector = new WareConnector({
            section,
            warehouse,
            count,
            sectionname,
            warehousename
        })
        await wareconnector.save()
        res.send(wareconnector)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/wareconnector/:id', auth, async (req, res) => {
    try {

        const ware = await WareConnector.find({
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
        const wareconnector = await WareConnector.find().sort({ _id: 1 })
        res.json(wareconnector)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const ware = await WareConnector.findById(req.params.id)
        res.json(ware)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/wares/:ware', auth, async (req, res) => {
    try {
        const ware = await WareConnector.find({
            value: req.params.ware
        })
        res.json(ware)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/:id', auth, async (req, res) => {
    try {
        const { error } = validateWareConnector(req.body)
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
        const edit = await WareConnector.findById(id)
        edit.set({
            value,
            label,
            name,
            type,
            price,
            pieces: parseInt(edit.pieces) + parseInt(req.body.pieces)
        })
        const ware = new WareConnector({
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
        const edit = await WareConnector.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router