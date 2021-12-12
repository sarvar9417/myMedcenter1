const { Router } = require('express')
const router = Router()
const { Director, validateDirector } = require('../models/Director')
const { DirectorResume, validateDirectorResume } = require('../models/DirectorResume')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post('/directorresume/register', async (req, res) => {
    try {
        const { error } = validateDirectorResume(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
        image } = req.body

        const directorResume = new DirectorResume({
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image
        })
        await directorResume.save()
        res.status(201).json( directorResume )

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

//
router.post('/register', async (req, res) => {
    try {
        const { error } = validateDirector(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password, directorId } = req.body
        const candidate = await Director.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const director = new Director({ login: login, password: hash, directorId: directorId })
        await director.save()
        res.status(201).json({ message: "Director yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateDirector(req.body)
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

        const directorResume = await DirectorResume.findById(director.directorId)
        const token = jwt.sign(
            { directorId: director._id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }

        )
        res.send({ token, directorId: director._id, director: directorResume })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router