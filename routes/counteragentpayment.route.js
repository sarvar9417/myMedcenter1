const { Router } = require('express')
const router = Router()
const { CounterAgentPayment, validateCounterAgentPayment } = require('../models/CounterAgentPayment')
const auth = require('../middleware/auth.middleware')
const { Connector } = require('../models/Connector')
const { Clients } = require('../models/Clients')
const { Section } = require('../models/Section')
const { CounterAgent } = require('../models/CounterAgent')
const { CounterDoctor } = require('../models/CounterDoctor')
const { Direction } = require('../models/Direction')

router.post('/reseption/register', auth, async (req, res) => {
    try {
        const { error } = validateCounterAgentPayment(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            client,
            connector,
            counteragent,
            counterdoctor,
            paymentDay
        } = req.body
        const agent = new CounterAgentPayment({
            client,
            connector,
            counteragent,
            counterdoctor,
            paymentDay
        })
        await agent.save()
        res.status(201).send(agent)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/doctor/:start/:end/:id', auth, async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const id = req.params.id
        console.log(id);
        const counterAgentPayment = await CounterAgentPayment.find({
            counterdoctor: id,
            paymentDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        }
        ).sort({ _id: -1 })
        let connectors = []
        let counteragents = []
        let counterdoctors = []
        let clients = []
        for (let i = 0; i < counterAgentPayment.length; i++) {
            const client = await Clients.findById(counterAgentPayment[i].client)
            clients.push(client)
            const connector = await Connector.findById(counterAgentPayment[i].connector)
            connectors.push(connector)
            const counteragent = await CounterAgent.findById(counterAgentPayment[i].counteragent)
            counteragents.push(counteragent)
            const counterdoctor = await CounterDoctor.findById(counterAgentPayment[i].counterdoctor)
            counterdoctors.push(counterdoctor)
        }
        let sections = []
        let directions = []
        for (let i = 0; i < connectors.length; i++) {
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            let dir = []
            for (let k = 0; k < sec.length; k++) {
                const d = await Direction.find({
                    section: sec[k].name,
                    subsection: sec[k].subname
                })
                dir.push(d[0])
            }
            directions.push(dir)
            sections.push(sec)
        }

        res.json({ counteragents, counterdoctors, connectors, clients, sections, directions });

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:start/:end/:id', auth, async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const id = req.params.id
        const counterAgentPayment = await CounterAgentPayment.find({
            counteragent: id,
            paymentDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        }
        ).sort({ _id: -1 })
        let connectors = []
        let counteragents = []
        let counterdoctors = []
        let clients = []
        for (let i = 0; i < counterAgentPayment.length; i++) {
            const client = await Clients.findById(counterAgentPayment[i].client)
            clients.push(client)
            const connector = await Connector.findById(counterAgentPayment[i].connector)
            connectors.push(connector)
            const counteragent = await CounterAgent.findById(counterAgentPayment[i].counteragent)
            counteragents.push(counteragent)
            const counterdoctor = await CounterDoctor.findById(counterAgentPayment[i].counterdoctor)
            counterdoctors.push(counterdoctor)
        }
        let sections = []
        let directions = []
        for (let i = 0; i < connectors.length; i++) {
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            let dir = []
            for (let k = 0; k < sec.length; k++) {
                const d = await Direction.find({
                    section: sec[k].name,
                    subsection: sec[k].subname
                })
                dir.push(d[0])
            }
            directions.push(dir)
            sections.push(sec)
        }

        res.json({ counteragents, counterdoctors, connectors, clients, sections, directions });

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const counterAgentPayment = await CounterAgentPayment.findById(req.params.id)
        res.json(counterAgentPayment)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.patch('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const edit = await CounterAgentPayment.findByIdAndUpdate(id, req.body)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const counterAgentPayment = await CounterAgentPayment.findByIdAndDelete(req.params.id)

        res.json(counterAgentPayment)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router