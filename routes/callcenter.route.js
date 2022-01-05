const { Router } = require('express')
const router = Router()
const { CallCenter, validateCallCenter } = require('../models/CallCenter')
const { Clients } = require('../models/Clients')

// /api/auth/callcenter/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateCallCenter(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const { client, position, illness, voucher, callDay } = req.body
        const callcenter = new CallCenter({ client, position, illness, voucher, callDay })
        await callcenter.save()
        res.status(201).send(callcenter)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/reseption/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const calls = await CallCenter.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date().getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .sort({ _id: -1 })
        let clients = []
        for (let i = 0; i < calls.length; i++) {
            const client = await Clients.findById(calls[i].client)
            clients.push(client)
        }
        res.json({ calls, clients })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/callcenter/
router.get('/call/:id', async (req, res) => {
    try {
        const id = req.params.id
        const client = await Clients.find({
            id: id
        })
        const calls = await CallCenter.find({
            client: client[0]._id
        })
        let clients = []
        for (let i = 0; i < calls.length; i++) {
            const client = await Clients.findById(calls[i].client)
            clients.push(client)
        }
        res.json({ calls, clients })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/callcenter/
router.get('/callborn/:born', async (req, res) => {
    try {
        const born = new Date(req.params.born)
        const client = await Clients.find({
            born: { $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()), $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1) }
        })

        let calls = []
        for (let i = 0; i < client.length; i++) {
            const call = await CallCenter.find({
                client: client[i]._id
            })
                .sort({ _id: -1 })
            call.map(c => {
                calls.push(c)
            })
        }
        let clients = []
        for (let i = 0; i < calls.length; i++) {
            const client = await Clients.findById(calls[i].client)
            clients.push(client)
        }
        res.json({ calls, clients })

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {

        const callcenter = await CallCenter.findById(req.params.id)
        res.json(callcenter);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const edit = await CallCenter.findByIdAndUpdate(id, req.body)
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router