const { Router } = require('express')
const router = Router()
const { Director, validateDirector, validateDirectorLogin } = require('../models/Director')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    try {
        const { error } = validateDirector(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login,
            password,
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image } = req.body
        const candidate = await Director.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const director = new Director({
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
        await director.save()
        res.status(201).json({ message: "Director yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateDirectorLogin(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const director = await Director.findOne({ login })

        if (!director) {
            return res.status(400).json({ message: 'Login yoki parol noto`g`ri' })
        }
        const isMatch = await bcrypt.compare(password, director.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Login yoki parol noto'g'ri` })
        }

        const token = jwt.sign(
            { directorId: director._id },
            config.get('jwtSecret')
        )
        res.send({ token, directorId: director._id, director: director })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/login
router.patch('/:id', async (req, res) => {
    try {
        const { error } = validateDirector(req.body)
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
        const director = await Director.findById(req.params.id)
        director.login = login
        director.password = hash
        director.firstname = firstname
        director.lastname = lastname
        director.fathername = fathername
        director.section = section
        director.born = born
        director.phone = phone
        director.image = image
        const update = await director.save()
        res.status(201).send({ update })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router