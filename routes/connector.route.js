const { Router } = require('express')
const router = Router()
const { Connector, validateConnector } = require('../models/Connector')

// /api/auth/connector/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateConnector(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { client } = req.body
        const connector = new Connector({ client })
        await connector.save()
        res.status(201).send(connector)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/', async (req, res) => {
    try {
        const connectors = await Connector.find({}).sort({ _id: -1 })
        res.json(connectors);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {

        const connector = await Connector.findById(req.params.id)
        res.json(connector);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Connector.findByIdAndUpdate(id, req.body)
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router