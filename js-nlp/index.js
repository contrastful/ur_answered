const express = require('express')
const cors = require('cors')
const nlp = require('./nlp')

let qnaMap = {}
let database = []
let manager = null

nlp.train().then(() => {
    setTimeout(() => {
        manager = nlp.getManager()
        database = nlp.getDatabase()
        qnaMap = nlp.getQnaMap()
    }, 500) // Unneccessary but just in case
})

const app = express()
app.use(cors())

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/query', async (req, res) => {
    if (!manager) return null

    const query = req.query.q

    const response = await manager.process('en', query);
    console.log(response);

    let topPossibility = null
    response.classifications.forEach(possibility => {
        if (!topPossibility) topPossibility = possibility

        if (possibility.score > topPossibility.score) {
            topPossibility = possibility
        }
    })

    let answer = null

    if (topPossibility.score > 0.15) {
        answer = qnaMap[topPossibility.intent]
    }

    return res.json({
        success: answer ? true : false,
        intent: topPossibility,
        answer,
        classifications: response.classifications.map(c => {
            return {
                classification: c,
                qna: qnaMap[c.intent]
            }
        })
    })
})

app.get('/admin/questions', (req, res) => {
    if (!database) return null

    return res.json(database)
})

app.listen(8080)