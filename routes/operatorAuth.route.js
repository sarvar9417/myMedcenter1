const { Router } = require('express')
const router = Router()
const { Operator, validateOperator, validateOperatorLogin } = require('../models/Operator')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateOperator(req.body)
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

        const candidate = await Operator.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'Bunday foydalanuvchi tizimda avvaldan mavjud' })
        }
        const hash = await bcrypt.hash(password, 8)
        const operator = new Operator({
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
        await operator.save()
        res.status(201).json({ message: "Operator yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateOperatorLogin(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { login, password } = req.body

        const operator = await Operator.findOne({ login })

        if (!operator) {
            return res.status(400).json({ message: 'Login yoki parol noto`g`ri' })
        }
        const isMatch = await bcrypt.compare(password, operator.password)
        if (!isMatch) {
            return res.status(400).json({ message: `Login yoki parol noto'g'ri` })
        }
        const token = jwt.sign(
            { operatorId: operator._id },
            config.get('jwtSecret')
        )
        res.send({ token, operatorId: operator._id, type: "operator" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/operator/:id
router.patch('/:id', async (req, res) => {
    try {
        
        const { error } = validateOperator(req.body)
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

        const hash = await bcrypt.hash(password, 8)
        const operator = await Operator.findById(req.params.id)
        operator.login = login
        operator.password = hash
        operator.firstname = firstname
        operator.lastname = lastname
        operator.fathername = fathername
        operator.section = section
        operator.born = born
        operator.phone = phone
        operator.image = image
        const update = await operator.save()
        res.status(201).send({ update })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/', async (req, res) => {
    try {
        const operator = await Operator.find()
        res.json(operator)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})
module.exports = router