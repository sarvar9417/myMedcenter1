const { Router } = require('express')
const router = Router()
const { Medsestra, validateMedsestra, validateMedsestraLogin } = require('../models/Medsestra')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateMedsestra(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            login,
            password,
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image
        } = req.body

        const candidate = await Medsestra.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const medsestra = new Medsestra({
            login,
            password: hash,
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image
        })
        await medsestra.save()
        res.status(201).json({ message: "Medsestra yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateMedsestraLogin(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const medsestra = await Medsestra.findOne({ login })

        if (!medsestra) {
            return res.status(400).json({ message: 'Login yoki parol noto`g`ri' })
        }
        const isMatch = await bcrypt.compare(password, medsestra.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Login yoki parol noto'g'ri` })
        }
        const token = jwt.sign(
            { medsestraId: medsestra._id },
            config.get('jwtSecret')
        )
        res.send({ token, medsestraId: medsestra._id })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/medsestra/:id
router.patch('/:id', async (req, res) => {
    try {
        const { error } = validateMedsestra(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        console.log(req.body);
        const {
            login,
            password,
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image } = req.body

        // const candidate = await Director.findOne({ login })
        // if (candidate) {
        //     return res.status(400).json({ message: 'Bunday Loginli foydalanuvchi tizimda avvaldan mavjud' })
        // }
        const hash = await bcrypt.hash(password, 8)
        const medsestra = await Medsestra.findById(req.params.id)
        medsestra.login = login
        medsestra.password = hash
        medsestra.firstname = firstname
        medsestra.lastname = lastname
        medsestra.fathername = fathername
        medsestra.section = section
        medsestra.born = born
        medsestra.phone = phone
        medsestra.image = image
        const update = await medsestra.save()
        res.status(201).send({ update })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/', async (req, res) => {
    try {
        const medsestra = await Medsestra.find()
        res.json(medsestra)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router