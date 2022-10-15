const express = require('express')
const cors = require('cors')
const nlp = require('./nlp')

nlp.train()
const manager = nlp.manager
const database = nlp.database
const qnaMap = nlp.qnaMap

const app = express()
app.use(cors())

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/query', async (req, res) => {
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
    return res.json(database)
})

app.listen(8080)