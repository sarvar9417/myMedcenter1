const { Router } = require('express')
const router = Router()
const { Source, validateSource } = require('../models/Source')
const auth = require('../middleware/auth.middleware')

router.post('/register', auth, async (req, res)=>{
    try {
        const { error } = validateSource(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            name
        } = req.body
        const source = new Source({
            name
        })
        await source.save()
        res.status(201).send(source)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
} )

router.get('/', auth, async (req, res) => {
    try {
        const source = await Source.find().sort({ _id: -1 })
        res.json(source)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const source = await Source.findById(req.params.id)
        res.json(source)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const source = await Source.findByIdAndDelete(req.params.id)
        res.json(source)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router

