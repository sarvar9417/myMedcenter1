const { Router } = require('express')
const router = Router()
const { Fizioterapevt, validateFizioterapevt, validateFizioterapevtLogin } = require('../models/Fizioterapevt')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateFizioterapevt(req.body)
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

        const candidate = await Fizioterapevt.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const fizioterapevt = new Fizioterapevt({
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
        await fizioterapevt.save()
        res.status(201).json({ message: "Fizioterapevt yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateFizioterapevtLogin(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const fizioterapevt = await Fizioterapevt.findOne({ login })

        if (!fizioterapevt) {
            return res.status(400).json({ message: 'Login yoki parol noto`g`ri' })
        }
        const isMatch = await bcrypt.compare(password, fizioterapevt.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Login yoki parol noto'g'ri` })
        }
        const token = jwt.sign(
            { fizioterapevtId: fizioterapevt._id },
            config.get('jwtSecret')
        )
        res.send({ token, fizioterapevtId: fizioterapevt._id })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/fizioterapevt/:id
router.patch('/:id', async (req, res) => {
    try {
        const { error } = validateFizioterapevt(req.body)
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
        const fizioterapevt = await Fizioterapevt.findById(req.params.id)
        fizioterapevt.login = login
        fizioterapevt.password = hash
        fizioterapevt.firstname = firstname
        fizioterapevt.lastname = lastname
        fizioterapevt.fathername = fathername
        fizioterapevt.section = section
        fizioterapevt.born = born
        fizioterapevt.phone = phone
        fizioterapevt.image = image
        const update = await fizioterapevt.save()
        res.status(201).send({ update })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/', async (req, res) => {
    try {
        const fizioterapevt = await Fizioterapevt.find()
        res.json(fizioterapevt)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router