const { Router } = require('express')
const router = Router()
const { Direction, validateDirection } = require('../models/Direction')
const auth = require('../middleware/auth.middleware')

// ===================================================================================
// ===================================================================================
// DIRECTOR routes
// /api/direction/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateDirection(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }

        const {
            value,
            price,
            label,
            subvalue

        } = req.body
        const direction = new Direction({
            value,
            price,
            label,
            subvalue
        })
        await direction.save()
        res.status(201).send(direction)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/direction
router.get('/', auth, async (req, res) => {
    try {
        const direction = await Direction.find().sort({ _id: -1 })
        res.json(direction)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// // /api/direction/reseption
// router.get('/reseption/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const directions = await Direction.findById(id)
//         res.json(directions)

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// // /api/direction/reseption/clientId //
// router.get('/reseptionid/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const directions = await Direction.find({ client: id })
//         res.json(directions)

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// router.put('/reseption/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const edit = await Direction.findById(id)
//         edit.position = req.body.position
//         await edit.save()
//         res.json(edit)

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })
// // END RESEPTION routes
// // ===================================================================================
// // ===================================================================================



// // ===================================================================================
// // ===================================================================================
// // CASHIER routes
// // /api/direction/reseption
// router.get('/cashier', auth, async (req, res) => {
//     try {
//         const direction = await Direction.find().sort({ _id: -1 })
//         res.json(direction)
//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// // /api/direction/
// router.get('/cashier/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const directions = await Direction.find({ client: id }).sort({ _id: -1 })
//         res.json(directions);

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// // /api/direction/cashier/
// router.patch('/cashier/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const edit = await Direction.findByIdAndUpdate(id, req.body)
//         res.json(edit)

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })


// // END CASHIER routes
// // ===================================================================================
// // ===================================================================================



// // ===================================================================================
// // ===================================================================================
// // CASHIER routes
// // DOCTOR routes

// // Get online directions
// router.get('/doctoronline/:direction', auth, async (req, res) => {
//     try {
//         const direction = await Direction.find({
//             bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
//             bron: "online",
//             checkup: "chaqirilmagan",
//             name: req.params.direction
//         }).sort({ turn: 1 })
//         res.json(direction[0])
//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// // Get offline directions
// router.get('/doctoroffline/:direction', auth, async (req, res) => {
//     try {
//         const direction = await Direction.find({
//             bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
//             bron: "offline",
//             checkup: "chaqirilmagan",
//             name: req.params.direction
//         }).sort({ turn: 1 })
//         res.json(direction[0])
//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// // /api/direction/doctor
// router.get('/doctor/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const directions = await Direction.findById(id)
//         res.json(directions);

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// router.put('/doctordontcome/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const edit = await Direction.findById(id)
//         edit.checkup = req.body.checkUp
//         await edit.save()
//         res.json(edit)

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// router.put('/doctordone/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const edit = await Direction.findById(id)
//         edit.checkup = req.body.checkUp
//         edit.comment = req.body.comment
//         edit.summary = req.body.summary
//         edit.done = req.body.done
//         await edit.save()
//         res.json(edit)

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// // END DOCTOR SECTION
// // ===================================================================================
// // ===================================================================================


// // ===================================================================================
// // ===================================================================================
// // TURN routes

// router.get('/turn/:direction', async (req, res) => {
//     try {
//         const direction = await Direction.find({
//             bronDay: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) },
//             bron: "offline",
//             checkup: "chaqirilmagan",
//             name: req.params.direction
//         }).sort({ turn: 1 })
//         res.json(direction[0])
//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })


// // END TURN
// // ===================================================================================
// // ===================================================================================


// // /api/direction/
// router.get('/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const directions = await Direction.find({ client: id }).sort({ _id: -1 })
//         res.json(directions);

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })

// router.put('/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const edit = await Direction.findById(id)
//         edit.position = req.body.position
//         await edit.save()
//         res.json(edit);

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })





// router.patch('/:id', auth, async (req, res) => {
//     try {
//         const id = req.params.id
//         const edit = await Direction.findByIdAndUpdate(id, req.body)
//         res.json(edit)

//     } catch (e) {
//         res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
//     }
// })





module.exports = router