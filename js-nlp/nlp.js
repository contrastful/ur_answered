const { NlpManager } = require('node-nlp');
const fs = require("fs");
const csv = require('fast-csv');
const path = require('path');

let qnaMap = {}
let database = []
let manager = null

const train = async () => {
    qnaMap = {}
    database = []
    manager = new NlpManager({ languages: ['en'], forceNER: true, nlu: { useNoneFeature: false } })
    
    await fs.createReadStream(path.resolve(__dirname, 'data', 'qna.csv'))
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
            if (row[0] === "Department") return

            const category = row['Department']
            const questions = row['Question (semicolon-delimited)'].split(';')
            const questionTag = row['Question Intent']
            const answer = row['Answer Content']

            // Define the answer
            manager.addAnswer('en', questionTag, answer);
            console.log(`Adding answer ${ questionTag }: ${ answer }`)
            qnaMap[questionTag] = {
                question: questions[0],
                answer
            }

            database.push({
                category, questions, questionTag, answer, status: !!answer, askedCount: row['Asked Count'], askedBy: row['Asked By']
            })

            questions.forEach(question => {
                // Train the model on the questions leading to given answer
                console.log(`Adding question: ${ question } => ${ questionTag }`)
                manager.addDocument('en', question, questionTag);
            })
        })
        .on('end', () => {
            // Train and save the model.
            console.log("Training")
            manager.train().then(async () => {
                manager.save();
            })
        })
}

const getQnaMap = () => qnaMap
const getDatabase = () => database
const getManager = () => manager

module.exports = { 
    getQnaMap, getDatabase, getManager, train
}