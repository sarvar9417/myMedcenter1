const { Router } = require('express')
const router = Router()
const { Cashier, validateCashier } = require('../models/Cashier')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateCashier(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const candidate = await Cashier.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const cashier = new Cashier({ login: login, password: hash })
        await cashier.save()
        res.status(201).json({ message: "Cashier yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateCashier(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const cashier = await Cashier.findOne({ login })

        if (!cashier) {
            return res.status(400).json({ message: 'Login yoki parol noto`g`ri' })
        }
        const isMatch = await bcrypt.compare(password, cashier.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Login yoki parol noto'g'ri` })
        }
        const token = jwt.sign(
            { cashierId: cashier._id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )
        res.send({ token, cashierId: cashier._id })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

module.exports = router