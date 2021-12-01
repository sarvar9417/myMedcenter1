const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const app = express()

const PORT = config.get("PORT")

const path = require('path')
const { patch } = require('./routes/reseptionAuth.route')

app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
// Reseption
app.use('/api/auth/reseption', require('./routes/reseptionAuth.route'))
// Cashier
app.use('/api/auth/cashier', require('./routes/cashierAuth.route'))
// Director
app.use('/api/auth/director', require('./routes/directorAuth.route'))
// Clients
app.use('/api/clients', require('./routes/clients.route'))
// Section
app.use('/api/section', require('./routes/section.route'))
// Cost
app.use('/api/cost', require('./routes/cost.route'))
// Doctor
app.use('/api/auth/doctor', require('./routes/doctorAuth.route'))

if (process.env.NODE_ENV === "production" ) {
    app.use('/', express.static(path.join(__dirname, 'frontend', 'build')))

    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}
async function start() {
    try {
        await mongoose.connect(config.get("mongoUri"), {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            // useFindAndModify: false
        })
            .then(() => { console.log('Connect to MongoDB') })
            .catch(() => { console.log('Connecting error to MongoDB') })
        app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));
    } catch (e) {
        console.log("Server error", e.message);
        process.exit(1)
    }
}
start()