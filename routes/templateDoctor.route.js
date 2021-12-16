const { Router } = require('express')
const router = Router()
const { TemplateDoctor, validateTemplateDoctor } = require('../models/TemplateDoctor')

// /api/templateDoctor/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateTemplateDoctor(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { section, subsection, template } = req.body
        const templateDoctor = new TemplateDoctor({ section, subsection, template })
        await templateDoctor.save()
        res.status(201).json({ message: "Xarajat qo'shildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/templateDoctor/
router.get('/', async (req, res) => {
    try {
        const templateDoctors = await TemplateDoctor.find({}).sort({ _id: -1 })
        res.json(templateDoctors);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const templateDoctor = await TemplateDoctor.findById(req.params.id)
        res.json(templateDoctor)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const edit = await TemplateDoctor.findByIdAndUpdate(id, req.body)
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const del = await TemplateDoctor.findByIdAndDelete(id)
        res.json(del)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router