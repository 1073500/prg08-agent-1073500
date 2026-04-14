import express from "express"
import { callAgent } from "./agent.js"

const app = express()
app.use(express.json())
app.use(express.static("public"))

app.post("/api/chat", async(req,res) => {
    const { prompt } = req.body
    const result = await callAgent(prompt)
    res.json({ response: result })
})

app.listen(3000, ()=> console.log("started"))