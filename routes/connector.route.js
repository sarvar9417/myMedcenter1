const { Router } = require('express')
const router = Router()
const { Connector, validateConnector } = require('../models/Connector')
const { Clients } = require('../models/Clients')
const { Section } = require('../models/Section')
const { Service } = require('../models/Service')
const { Source } = require('../models/Source')
const { Doctor } = require('../models/Doctor')
const { Direction } = require('../models/Direction')
const { UsedRoom } = require('../models/UsedRoom')
const { Room } = require('../models/Rooms')

// /api/auth/connector/register
router.post('/register', async (req, res) => {
    try {
        const { error } = validateConnector(req.body)
        if (error) {
            return res.status(400).json({
                error: error,
                message: error.message
            })
        }
        const {
            client,
            source,
            counteragent,
            type,
            position,
            doctor,
            prepaymentCashier,
            diagnosis,
            bronDay
        } = req.body
        const connector = new Connector({
            client,
            source,
            counteragent,
            type,
            position,
            doctor,
            prepaymentCashier,
            diagnosis,
            bronDay
        })
        await connector.save()
        res.status(201).send(connector)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/director/:start/:end/:section', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const section = req.params.section
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })

        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id,
                name: section
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
            const service = await Service.find({
                connector: connectors[i]._id,
                name: section
            })
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/reseptionoffline/:start/:end/:fish', async (req, res) => {
    try {
        const fish = (req.params.fish).split(" ")
        const name = new RegExp('.*' + fish[0] + ".*", "i")
        const lastname = fish[1] ? new RegExp('.*' + fish[1] + ".*", "i") : new RegExp('.*' + "" + ".*", "i")
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
        let connectors = []
        for (let i = 0; i < clientss.length; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt: new Date(new Date(end).getFullYear(),
                        new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
                client: clientss[i]._id
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connectors = connectors.concat(connector)
        }

        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
            const service = await Service.find({
                connector: connectors[i]._id
            })
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseptiononline/:start/:end/:fish', async (req, res) => {
    try {
        const fish = (req.params.fish).split(" ")
        const name = new RegExp('.*' + fish[0] + ".*", "i")
        const lastname = fish[1] ? new RegExp('.*' + fish[1] + ".*", "i") : new RegExp('.*' + "" + ".*", "i")
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const clientss = await Clients.find()
            .or([
                { firstname: name, lastname: lastname },
                { lastname: name, firstname: lastname }
            ])
        let connectors = []
        for (let i = 0; i < clientss.length; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                    $lt: new Date(new Date(end).getFullYear(),
                        new Date(end).getMonth(), new Date(end).getDate() + 1)
                },
                client: clientss[i]._id
            })
                .or([{ type: "online" }])
                .sort({ _id: -1 })
            connectors = connectors.concat(connector)
        }

        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const service = await Service.find({
                connector: connectors[i]._id
            })
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/doctor/:start/:end/:id', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const id = req.params.id
        const doctor = await Doctor.findById(id)
        const sections = await Section.find({
            name: doctor.section,
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },

        }).sort({ _id: -1 })
        let directions = []
        let clients = []
        for (let i = 0; i < sections.length; i++) {
            const client = await Clients.findById(sections[i].client)
            const direction = await Direction.findOne({
                section: sections[i].name,
                subsection: sections[i].subname
            })
            clients.push(client)
            directions.push(direction)
        }
        res.json({ clients, sections, directions })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


// /api/auth/connector/
router.get('/reseption/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
            const service = await Service.find({
                connector: connectors[i]._id
            })
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseptiononline/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            type: "online"
        })
            .sort({ _id: -1 })

        let clients = []
        let sections = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/statsionar/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            type: "statsionar"
        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/cashierstatsionar/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            type: "statsionar",

        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/marketing/:start/:end', async (req, res) => {
    try {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date(start).getFullYear(), new Date(start).getMonth(), new Date(start).getDate()),
                $lt: new Date(new Date(end).getFullYear(),
                    new Date(end).getMonth(), new Date(end).getDate() + 1)
            },
            source: { $ne: " " },

        })
            .sort({ _id: -1 })
        const sources = await Source.find()
        res.json({ connectors, sources })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/director', async (req, res) => {
    try {
        let connectors = []
        for (let i = 0; i < 12; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date().getFullYear(), i, 1),
                    $lt:
                        new Date(new Date().getFullYear(), i, 32)
                }
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connectors.push(connector.length)

        }
        res.json(connectors)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/directorstatsionar', async (req, res) => {
    try {
        let connectors = []
        for (let i = 0; i < 12; i++) {
            const connector = await Connector.find({
                bronDay: {
                    $gte:
                        new Date(new Date().getFullYear(), i, 1),
                    $lt:
                        new Date(new Date().getFullYear(), i, 32)
                },
                type: "statsionar"
            })
                .sort({ _id: -1 })
            connectors.push(connector.length)

        }
        res.json(connectors)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseption/:id', async (req, res) => {
    try {
        const id = req.params.id
        const client = await Clients.find({
            id: id
        })
        const connectors = await Connector.find({
            client: client[0]._id
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
            const service = await Service.find({
                connector: connectors[i]._id
            })
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/statsionar/:id', async (req, res) => {
    try {
        const id = req.params.id
        const client = await Clients.find({
            id: id
        })
        const connectors = await Connector.find({
            client: client[0]._id,
            type: "statsionar"
        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseptiononline/:id', async (req, res) => {
    try {
        const id = req.params.id
        const client = await Clients.find({
            id: id
        })
        const connectors = await Connector.find({
            client: client[0]._id,
            type: "online"
        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


router.get('/reseptionborn/:born', async (req, res) => {
    try {
        const born = new Date(req.params.born)
        const client = await Clients.find({
            born: {
                $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()),
                $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1)
            }
        })
        let connectors = []
        for (let i = 0; i < client.length; i++) {
            const connector = await Connector.find({
                client: client[i]._id
            })
                .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
                .sort({ _id: -1 })
            connector.map(c => {
                connectors.push(c)
            })
        }

        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
            const service = await Service.find({
                connector: connectors[i]._id
            })
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/statsionarborn/:born', async (req, res) => {
    try {
        const born = new Date(req.params.born)
        const client = await Clients.find({
            born: { $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()), $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1) }
        })
        let connectors = []
        for (let i = 0; i < client.length; i++) {
            const connector = await Connector.find({
                client: client[i]._id,
                type: "statsionar"
            })
                .sort({ _id: -1 })
            connector.map(c => {
                connectors.push(c)
            })
        }

        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/reseptionbornonline/:born', async (req, res) => {
    try {
        const born = new Date(req.params.born)
        const client = await Clients.find({
            born: { $gte: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate()), $lt: new Date(new Date(born).getFullYear(), new Date(born).getMonth(), new Date(born).getDate() + 1) }
        })
        let connectors = []
        for (let i = 0; i < client.length; i++) {
            const connector = await Connector.find({
                client: client[i]._id,
                type: "online"
            })
                .sort({ _id: -1 })
            connector.map(c => {
                connectors.push(c)
            })
        }

        let clients = []
        let sections = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/statsionarid/:id', async (req, res) => {
    try {
        const edit = await Connector.findById(req.params.id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.delete('/reseption/:id', async (req, res) => {
    try {
        const edit = await Connector.findByIdAndDelete(req.params.id)
        res.json(edit)

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/endstatsionar/:id', async (req, res) => {
    try {
        const id = req.params.id
        const connector = await Connector.findById(id)
        connector.position = "yakunlangan"
        connector.endDay = new Date()
        const usedroom = await UsedRoom.findOne({
            connector: id
        })
        usedroom.position = "yakunlangan"
        usedroom.endDay = new Date()
        const room = await Room.findById(usedroom.room)
        room.position = "bo'sh"
        await room.save()
        await usedroom.save()
        await connector.save()
        res.json(connector)
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/statsionar', async (req, res) => {
    try {
        const connectors = await Connector.find({
            type: "statsionar",
            position: "davolanishda"
        })
            .sort({ _id: -1 })
        let clients = []
        let sections = []
        let services = []
        let rooms = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            const room = await UsedRoom.findOne({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
            rooms.push(room)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/cashierstatsionar', async (req, res) => {
    try {
        const rooms = await UsedRoom.find({})
            .or([{
                position: "band"
            },
            {
                endDay: {
                    $gte:
                        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                    $lt: new Date(new Date().getFullYear(),
                        new Date().getMonth(), new Date().getDate() + 1)
                }
            }])
        let connectors = []
        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < rooms.length; i++) {
            const connector = await Connector.findById(rooms[i].connector)
            connectors.push(connector)
        }
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
            const ser = await Service.find({
                connector: connectors[i]._id
            })
            clients.push(client)
            sections.push(sec)
            services.push(ser)
        }
        res.json({ connectors, clients, sections, services, rooms })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/reseption', async (req, res) => {
    try {
        const pagenumber = 1
        const connectors = await Connector.find({
            bronDay: {
                $gte:
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                $lt: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate() + 1)
            }
        })
            .or([{ type: "offline" }, { type: "online" }, { type: "callcenter" }])
            .sort({ _id: -1 })
            .skip((pagenumber - 1) * 15)
            .limit(15)
        let clients = []
        let sections = []
        let services = []
        for (let i = 0; i < connectors.length; i++) {
            const client = await Clients.findById(connectors[i].client)
            const sec = await Section.find({
                connector: connectors[i]._id
            })
                .or([{ position: "offline" }, { position: "kelgan" }, { position: "callcenter" }])
            const service = await Service.find({
                connector: connectors[i]._id
            })
            services.push(service)
            clients.push(client)
            sections.push(sec)
        }
        res.json({ connectors, clients, sections, services })
    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

// /api/auth/connector/
router.get('/', async (req, res) => {
    try {
        const connectors = await Connector.find({}).sort({ _id: -1 })
        res.json(connectors);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})

router.get('/:id', async (req, res) => {
    try {

        const connector = await Connector.findById(req.params.id)
        res.json(connector);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})



router.patch('/cashier/:id', async (req, res) => {
    try {
        const id = req.params.id
        const edit = await Connector.findByIdAndUpdate(id, req.body)
        res.json(edit);

    } catch (e) {
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
    }
})


module.exports = router