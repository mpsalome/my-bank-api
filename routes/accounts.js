import express from "express"
import { promises as fs, write } from "fs"

const { writeFile, readFile } = fs
const router = express.Router()

router.post("/", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName))
        let account = req.body

        account = { id: data.nextId++, ...account }
        data.accounts.push(account)

        await writeFile(global.fileName, JSON.stringify(data, null, 2))

        res.send(account)

    } catch (err) {
        next(err)
    }

})

router.get("/", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName))
        delete data.nextId
        res.send(data)
    } catch (err) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName))

        delete data.nextId

        const account = data.accounts.find(acc => acc.id === parseInt(req.params.id))

        res.send(account)
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName))

        data.accounts = data.accounts.filter(acc => acc.id !== parseInt(req.params.id))

        await writeFile(global.fileName, JSON.stringify(data, null, 2))

        res.end()
    } catch (err) {
        next(err)
    }
})


router.put("/", async (req, res, next) => {
    try {
        const account = req.body
        const data = JSON.parse(await readFile(global.fileName))
        const index = data.accounts.findIndex(acc => acc.id === account.id)

        data.accounts[index] = account

        await writeFile(global.fileName, JSON.stringify(data, null, 2))

        res.send(account)
    } catch (err) {
        next(err)
    }
})

router.patch("/updateBalance", async (req, res, next) => {
    try {
        const account = req.body
        const data = JSON.parse(await readFile(global.fileName))
        const index = data.accounts.findIndex(acc => acc.id === account.id)

        data.accounts[index].balance = account.balance

        await writeFile(global.fileName, JSON.stringify(data, null, 2))

        res.send(data.accounts[index])
    } catch (err) {
        next(err)
    }
})

router.use((err, req, res, next) => {
    console.log(err)
    res.status(400).send({ error: err.message })
})

export default router