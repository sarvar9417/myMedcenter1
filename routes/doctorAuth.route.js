const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')
const { Doctor, validateDoctor, validateDoctorLogin } = require('../models/Doctor')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateDoctor(req.body)
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

        const candidate = await Doctor.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const doctor = new Doctor({
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
        await doctor.save()
        res.status(201).json({ message: "Doctor yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateDoctorLogin(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const doctor = await Doctor.findOne({ login })

        if (!doctor) {
            return res.status(400).json({ message: 'Login yoki parol noto`g`ri' })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Login yoki parol noto'g'ri` })
        }

        const token = jwt.sign(
            { doctorId: doctor._id },
            config.get('jwtSecret'),
            { expiresIn: '12h' }

        )
        res.send({ token, doctorId: doctor._id, doctor: doctor })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/director', auth, async (req, res) => {
    try {
        const doctors = await Doctor.find()
        res.json(doctors)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/login/:id', auth, async (req, res) => {
    try {
        const doctor = await Doctor.find({ doctorId: req.params.id })
        res.json(doctor)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/director/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const doctor = await Doctor.findById(id)
        res.json(doctor)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/login
router.patch('/director/:id', async (req, res) => {
    try {
        const { error } = validateDoctor(req.body)
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
        const doctor = await Doctor.findById(req.params.id)
        doctor.login = login
        doctor.password = hash
        doctor.firstname = firstname
        doctor.lastname = lastname
        doctor.fathername = fathername
        doctor.section = section
        doctor.born = born
        doctor.phone = phone
        doctor.image = image
        const update = await doctor.save()
        res.status(201).send({ update })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/director/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const del = await Doctor.findByIdAndDelete(id)
        res.json(del)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/historyclient', async (req, res) => {
    try {
        const doctors = await Doctor.find()
        res.json(doctors)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router