const { Router } = require('express')
const router = Router()
const { CounterAgent, validateCounterAgent, validateCounterAgentLogin } = require('../models/CounterAgent')
const auth = require('../middleware/auth.middleware')
const { CounterDoctor } = require('../models/CounterDoctor')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

router.post('/register', auth, async (req, res) => {
    try {
        const { error } = validateCounterAgent(req.body)
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
            phone
        } = req.body

        const candidate = await CounterAgent.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }

        const hash = await bcrypt.hash(password, 8)

        const counteragent = new CounterAgent({
            login,
            password: hash,
            firstname,
            lastname,
            phone
        })
        await counteragent.save()
        res.status(201).json({ message: "Kounteragent yaratildi" })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateCounterAgentLogin(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const counteragent = await CounterAgent.findOne({ login })

        if (!counteragent) {
            return res.status(400).json({ message: 'Login yoki parol noto`g`ri' })
        }
        const isMatch = await bcrypt.compare(password, counteragent.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Login yoki parol noto'g'ri` })
        }
        const token = jwt.sign(
            { counteragentId: counteragent._id },
            config.get('jwtSecret')
        )
        res.send({ token, counteragentId: counteragent._id, counteragent: counteragent })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const counterAgent = await CounterAgent.find().sort({ _id: -1 })
        res.json(counterAgent)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const counterAgent = await CounterAgent.findById(req.params.id)
        res.json(counterAgent)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', auth, async (req, res) => {
    try {
        const { error } = validateCounterAgent(req.body)
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
            phone
        } = req.body
        const hash = await bcrypt.hash(password, 8)
        const counteragent = await CounterAgent.findById(req.params.id)
        counteragent.login = login
        counteragent.password = hash
        counteragent.firstname = firstname
        counteragent.lastname = lastname
        counteragent.phone = phone
        const update = await counteragent.save()
        res.status(201).send({ update })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const doctors = await CounterDoctor.find({
            counteragent: id
        })
        for (let i = 0; i < doctors.length; i++) {
            const doctor = await CounterDoctor.findByIdAndDelete(doctors[i]._id)
        }
        const counterAgent = await CounterAgent.findByIdAndDelete(req.params.id)

        res.json(counterAgent)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router