import express from 'express'
import {callAgent} from "./agent.js";

const app = express()
app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json({ message: "hello world" })
})
app.post('/api/chat', async(req, res) => {
    const { message } = req.body
    const thread_id = req.body?.thread_id ?? "1";
    const response = await callAgent(message)
    const { prompt, usersid } = req.body;
    console.log(`user ${usersid} heeft deze vraag: ${prompt}`)
    res.json({
        response: response.message,
        toolsUsed: response.toolsUsed,
        sources: response.sources
    });
})

app.use(express.static("public"));
app.listen(3000, () => console.log(`Serving http://localhost:3000`))