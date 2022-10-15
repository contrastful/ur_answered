import axios from "axios";

const QuestionsService = {
    fetchQuestions: () => new Promise((resolve, reject) => {
        axios.get('http://localhost:8080/admin/questions').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

export default QuestionsService