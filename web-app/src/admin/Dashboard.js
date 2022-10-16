import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Dashboard.scss"

import { Card } from 'primereact/card';
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button'
import Questions from "./Questions";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const [stats, saveStats] = useState(null)

    const dbLoaded = (data) => {
        console.log(data)
        if (data) {
            let entryCount = 0
            let unansweredCount = 0
            data.forEach(row => {
                entryCount += row.questions.length

                if (!row.answer) unansweredCount++
            })

            saveStats({
                entryCount, answerCount: 0, unansweredCount
            })
        }
    }

    return (
        <div class="admin">
            <div class="container">
                <div className="surface-0">
                    <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                        <li>
                            <a className="text-500 no-underline line-height-3 cursor-pointer">UR Answered</a>
                        </li>
                        <li className="px-2">
                            <i className="pi pi-angle-right text-500 line-height-3"></i>
                        </li>
                        <li>
                            <span className="text-900 line-height-3">Admin Panel</span>
                        </li>
                    </ul>
                    <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                        <div>
                            <div className="font-medium text-3xl text-900">Knowledge Base</div>
                            <div className="flex align-items-center text-700 flex-wrap">
                                <div className="mr-5 flex align-items-center mt-3">
                                    <i className="pi pi-database mr-2"></i>
                                    <span>{ stats ? stats.entryCount : '...' } Knowledge Entries</span>
                                </div>
                                <div className="mr-5 flex align-items-center mt-3">
                                    <i className="pi pi-users mr-2"></i>
                                    <span>{ stats ? stats.answerCount : '...' } AI Queries Answered</span>
                                </div>
                                <div className="mr-5 flex align-items-center mt-3">
                                    <i className="pi pi-question mr-2"></i>
                                    <span>{ stats ? stats.unansweredCount : '...' } Unanswered Questions</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 lg:mt-0">
                            {/* <Button label="Add" className="p-button-outlined mr-2" icon="pi pi-user-plus" /> */}
                            <Button label="Add entry" icon="pi pi-plus-circle" />
                        </div>
                    </div>
                </div>
        
                <Card>
                    <Questions onDbLoaded={ (data) => dbLoaded(data) } />
                </Card>
            </div>
        </div>
    )
}

export default Dashboard