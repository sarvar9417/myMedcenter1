const { Router } = require('express')
const router = Router()
const { Clients } = require('../models/Clients')
const { Section } = require('../models/Section')

router.get('/client/:id', async (req, res) => {
    try {
        const clients = await Clients.findById(req.params.id)
        res.json(clients)
    } catch (e) {
        res.status(500).json({ message: 'So`ralgan mijoz ma`lumotlari topilmadi' })
    }
})
router.get('/sections/:id', async (req, res) => {
    try {
        
        const section = await Section.find({
            client: req.params.id
        }).sort({ turn: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'So`ralgan mijoz ma`lumotlari topilmadi' })
    }
})

module.exports = router