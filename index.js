const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRouter = require('./routes/authRouter')
const ordersRouter = require('./routes/orderRoutes')

const PORT = 5000
const app = express()

app.use(express.json())
app.use("/auth", cors(), authRouter)
app.use("/orders", cors(), ordersRouter)

const start = async () => {
    try { 
        await mongoose.connect(`mongodb+srv://Andrey30:Andrey30@cluster0.plzlcqy.mongodb.net/?retryWrites=true&w=majority`)
        app.listen(PORT, () => console.log(`server started on port: ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()