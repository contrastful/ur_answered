const { NlpManager } = require('node-nlp');
const fs = require("fs");
const readline = require("readline");
const stream = fs.createReadStream("./data/qna.csv");

// NL Training
const rl = readline.createInterface({ input: stream });
let data = [];

const qnaMap = {}
const database = []

const manager = new NlpManager({ languages: ['en'], forceNER: true, nlu: { useNoneFeature: false } });

rl.on("line", (row) => {
    data.push(row.split(","));
});
 
rl.on("close", () => {
    data.forEach(row => {
        if (row[0] === "Department") return

        const category = row[0]
        const questions = row[1].split(';').map(q => q.trim())
        const questionTag = row[2]
        const answer = row[3]

        // Define the answer
        manager.addAnswer('en', questionTag, answer);
        console.log(`Adding answer ${ questionTag }: ${ answer }`)
        qnaMap[questionTag] = {
            question: questions[0],
            answer
        }

        database.push({
            category, questions, questionTag, answer, status: true
        })

        questions.forEach(question => {
            // Train the model on the questions leading to given answer
            console.log(`Adding question: ${ question } => ${ questionTag }`)
            manager.addDocument('en', question, questionTag);
        })
    })

    // Train and save the model.
    manager.train().then(async () => {
        manager.save();
    })
});

const express = require('express')
const cors = require('cors')

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