const { Router } = require('express')
const router = Router()
const { Reseption, validateReseption, validateReseptionLogin } = require('../models/Reseption')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateReseption(req.body)
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

        const candidate = await Reseption.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const reseption = new Reseption({
            login: login,
            password: hash,
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image
        })
        await reseption.save()
        res.status(201).json({ message: "Reseption yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateReseptionLogin(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const reseption = await Reseption.findOne({ login })

        if (!reseption) {
            return res.status(400).json({ message: 'Login yoki parol noto`g`ri' })
        }
        const isMatch = await bcrypt.compare(password, reseption.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Login yoki parol noto'g'ri` })
        }
        const token = jwt.sign(
            { reseptionId: reseption._id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )
        res.send({ token, reseptionId: reseption._id, type: "reseption" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/reseption/:id
router.patch('/:id', async (req, res) => {
    try {
        
        const { error } = validateReseption(req.body)
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
            image } = req.body

        // const candidate = await Director.findOne({ login })
        // if (candidate) {
        //     return res.status(400).json({ message: 'Bunday Loginli foydalanuvchi tizimda avvaldan mavjud' })
        // }
        const hash = await bcrypt.hash(password, 8)
        const reseption = await Reseption.findById(req.params.id)
        reseption.login = login
        reseption.password = hash
        reseption.firstname = firstname
        reseption.lastname = lastname
        reseption.fathername = fathername
        reseption.section = section
        reseption.born = born
        reseption.phone = phone
        reseption.image = image
        const update = await reseption.save()
        res.status(201).send({ update })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/', async (req, res) => {
    try {
        const reseption = await Reseption.find()
        res.json(reseption)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})
module.exports = router