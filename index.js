import express from "express"
import accountsRouter from "./routes/accounts.js"
import { promises as fs } from "fs"

const { writeFile, readFile } = fs

global.fileName = "accounts.json"

const app = express()

app.use(express.json())
app.use("/account", accountsRouter)

app.listen(3000, async () => {
    try {
        await readFile(global.fileName)
        console.log("API Started")
    } catch (error) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(initialJson))
            .then(() => {
                console.log("API Started & File created")
            })
            .catch(err => {
                console.log(err);
            })
    }
    console.log("API Started")
})