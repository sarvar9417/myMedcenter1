const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')
const { CompanyLogo, validateCompanyLogo } = require('../models/CompanyLogo')

// /api/companyLogo/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateCompanyLogo(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            logo,
            name,
            companyname,
            address,
            orientation,
            bank,
            mfo,
            accountnumber,
            inn,
            phone1,
            phone2,
            phone3
        } = req.body
        const companyLogo = new CompanyLogo({
            logo,
            name,
            companyname,
            address,
            orientation,
            bank,
            mfo,
            accountnumber,
            inn,
            phone1,
            phone2,
            phone3
        })
        await companyLogo.save()
        res.status(201).json({ message: "Logo yaratildi" })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/companyLogo/
router.get('/', async (req, res) => {
    try {
        const companyLogos = await CompanyLogo.find({}).sort({ _id: -1 })
        res.json(companyLogos);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {

        const companyLogo = await CompanyLogo.findById(req.params.id)
        res.json(companyLogo);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const edit = await CompanyLogo.findByIdAndUpdate(id, req.body)
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router