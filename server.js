import express from 'express'
import {callAgent} from "./agent.js";

const app = express()
app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json({ message: "hello world" })
})

app.post('/api/chat', async(req, res) => {
    const { message } = req.body
    const response = await callAgent(message)
    res.json({ response })
})

app.use(express.static("public"));
app.listen(3000, () => console.log(`Serving http://localhost:3000`))