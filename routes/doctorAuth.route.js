const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')
const { Doctor, validateDoctor } = require('../models/Doctor')
const { DoctorResume, validateDoctorResume } = require('../models/DoctorResume')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post('/doctorresume/register',  async (req, res) => {
    try {
        const { error } = validateDoctorResume(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        console.log(req.body)
        const {
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image
        } = req.body

        const doctorResume = new DoctorResume({
            firstname,
            lastname,
            fathername,
            section,
            born,
            phone,
            image
        })
        await doctorResume.save()
        res.status(201).json( doctorResume)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

//
router.post('/register',  async (req, res) => {
    try {
        const { error } = validateDoctor(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password, doctorId } = req.body

        const candidate = await Doctor.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const doctor = new Doctor({ login: login, password: hash, doctorId: doctorId })
        await doctor.save()
        res.status(201).json({ message: "Doctor yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateDoctor(req.body)
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

        const doctorResume = await DoctorResume.findById(doctor.doctorId)
        const token = jwt.sign(
            { doctorId: doctor._id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }

        )
        res.send({ token, doctorId: doctor._id, doctor: doctorResume })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/director', auth, async (req, res) => {
    try {
        const doctors = await DoctorResume.find()
        res.json(doctors)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/login/:id', auth, async (req, res) => {
    try {
        const doctor = await Doctor.find({doctorId: req.params.id})
        res.json(doctor)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/section/reseption
router.get('/director/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const doctor = await DoctorResume.findById(id)
        res.json(doctor)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/director/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await DoctorResume.findByIdAndUpdate(id, req.body)
        res.json(edit)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/director/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const del = await DoctorResume.findByIdAndDelete(id)
        res.json(del)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router