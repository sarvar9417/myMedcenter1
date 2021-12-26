const { Router } = require('express')
const router = Router()
const { Section, validateSection } = require('../models/Section')
const auth = require('../middleware/auth.middleware')

// ===================================================================================
// ===================================================================================
// RESEPTION routes
// /api/section/reseption/register/
router.post('/reseption/register/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const { error } = validateSection(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            name,
            subname,
            price,
            priceCashier,
            commentCashier,
            comment,
            summary,
            done,
            payment,
            turn,
            bron,
            bronDay,
            bronTime,
            position,
            checkup,
            connector,
            doctor,
            source,
            counterAgent,
            paymentMethod


        } = req.body
        const section = new Section({
            client: id,
            name,
            subname,
            price,
            priceCashier,
            commentCashier,
            comment,
            summary,
            done,
            payment,
            turn,
            bron,
            bronDay,
            bronTime,
            position,
            checkup,
            connector,
            doctor,
            source,
            counterAgent,
            paymentMethod
        })
        await section.save()
        res.status(201).send(section)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/reseption', auth, async (req, res) => {
    try {
        const section = await Section.find().sort({ _id: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/reseption/:id', async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.findById(id)
        res.json(sections)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption/clientId //
router.get('/reseptionid/:id', async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.find({ client: id })
        res.json(sections)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption/clientId //
router.get('/reseptionid/:id/:connector', auth, async (req, res) => {
    try {
        const id = req.params.id
        const connector = req.params.connector
        const sections = await Section.find({ client: id, connector: connector })
        res.json(sections)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.put('/reseption/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findById(id)
        edit.position = req.body.position
        await edit.save()
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/reseption/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findByIdAndDelete(id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})
// END RESEPTION routes
// ===================================================================================
// ===================================================================================



// ===================================================================================
// ===================================================================================
// CASHIER routes
// /api/section/reseption
router.get('/cashier', auth, async (req, res) => {
    try {
        const section = await Section.find().sort({ _id: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/
router.get('/cashier/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.find({ client: id }).sort({ _id: -1 })
        res.json(sections);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/cashier/
router.patch('/cashier/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// END CASHIER routes
// ===================================================================================
// ===================================================================================



// ===================================================================================
// ===================================================================================
// DOCTOR routes

// Get online sections
router.get('/doctoronline/:section', auth, async (req, res) => {
    try {
        const sections = await Section.find({
            bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
            bron: "online",
            checkup: "chaqirilmagan",
            name: req.params.section,
            position: "kelgan",
            payment: { $ne: "to'lanmagan" }
        })
            .or([{ payment: "to'langan" }, { commentCashier: { $ne: " " } }])
            .and([{ payment: { $ne: "to'lanmagan" } }, {}])
            .sort({ bronTime: 1 })
        let c = []
        sections.map((section) => {
            if (new Date(section.bronDay).toLocaleDateString() === new Date().toLocaleDateString()) {
                c.push(section)
            }
        })
        res.json(c[0])
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// Get offline sections
router.get('/doctoroffline/:section', auth, async (req, res) => {
    try {
        const sections = await Section.find({
            bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
            bron: "offline",
            checkup: "chaqirilmagan",
            name: req.params.section,
            payment: { $ne: "to'lanmagan" }
        })
            .or([{ payment: "to'langan" }, { commentCashier: { $ne: " " } }])
            .sort({ turn: 1 })
        let c = []
        sections.map((section) => {
            if (new Date(section.bronDay).toLocaleDateString() === new Date().toLocaleDateString()) {
                c.push(section)
            }
        })
        res.json(c[0])
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/section/doctor
router.get('/doctor/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.findById(id)
        res.json(sections);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.put('/doctordontcome/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findById(id)
        edit.checkup = req.body.checkUp
        await edit.save()
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// Get sections
router.get('/doctorall/:section', auth, async (req, res) => {
    try {
        const section = await Section.find({
            name: req.params.section,
            payment: { $ne: "to'lanmagan" },

        })
            .or([{ payment: "to'langan" }, { commentCashier: { $ne: " " } }])
            .sort({ _id: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// Get history
router.get('/doctorhistory/:id', auth, async (req, res) => {
    try {
        const section = await Section.find({
            client: req.params.id
        }).sort({ turn: -1 })
        res.json(section)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.put('/doctordone/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findById(id)
        edit.checkup = req.body.checkUp
        edit.comment = req.body.comment
        edit.summary = req.body.summary
        edit.done = req.body.done
        edit.doctor = req.body.doctor
        await edit.save()
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// END DOCTOR SECTION
// ===================================================================================
// ===================================================================================


// ===================================================================================
// ===================================================================================
// DIRECTOR routes

router.get('/director', auth, async (req, res) => {
    try {
        const sections = await Section.find()
        res.json(sections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/director/:index', auth, async (req, res) => {
    try {
        const months = parseInt(req.params.index)
        const sections = await Section.find()
        var m = 0
        var n = 0
        sections.map((section) => {
            if (parseInt(new Date(section.bronDay).getMonth()) === months) {
                m++
                n = n + section.priceCashier
            }
        })
        res.json({ count: m, price: n })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// END DIRECTOR SECTION
// ===================================================================================
// ===================================================================================

// ===================================================================================
// ===================================================================================
// Counteragent routes
router.get('/counteragent/:agent', async (req, res) => {
    try {
        const sections = await Section.find({
            counterAgent: req.params.agent
        }).sort({ bronDay: -1 })
        res.json(sections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// END COUNTERAGENT SECTION
// ===================================================================================
// ===================================================================================

// ===================================================================================
// ===================================================================================
// Advertisement routes
router.get('/advertisement/:agent', async (req, res) => {
    try {
        const sections = await Section.find({
            source: req.params.agent
        }).sort({ bronDay: -1 })
        res.json(sections)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// END Advertisement SECTION
// ===================================================================================
// ===================================================================================


// ===================================================================================
// ===================================================================================
// TURN routes

router.get('/turn/:section', async (req, res) => {
    try {
        const section = await Section.find({
            bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
            bron: "offline",
            checkup: "chaqirilmagan",
            name: req.params.section,
            payment: { $ne: "to'lanmagan" }
        }).sort({ turn: 1 })
        res.json(section[0])
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// END TURN
// ===================================================================================
// ===================================================================================


// /api/section/
router.get('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const sections = await Section.find({ client: id }).sort({ _id: -1 })
        res.json(sections);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.put('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findById(id)
        edit.position = req.body.position
        await edit.save()
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Section.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router