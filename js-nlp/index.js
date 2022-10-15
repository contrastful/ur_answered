const { NlpManager } = require('node-nlp');
const fs = require("fs");
const readline = require("readline");
const stream = fs.createReadStream("./data/qna.csv");

// NL Training
const rl = readline.createInterface({ input: stream });
let data = [];

const qnaDatabase = {}

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
        qnaDatabase[questionTag] = {
            question: questions[0],
            answer
        }

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
const app = express()

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
        answer = qnaDatabase[topPossibility.intent]
    }

    return res.json({
        success: answer ? true : false,
        intent: topPossibility,
        answer,
        classifications: response.classifications.map(c => {
            return {
                classification: c,
                qna: qnaDatabase[c.intent]
            }
        })
    })
})

app.listen(8080)