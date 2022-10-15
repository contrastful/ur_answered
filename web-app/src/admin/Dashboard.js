import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import Questions from "./Questions";

const Dashboard = () => {
    const [visible, setVisible] = useState(true)

    return (
        <Questions />
    )
}

export default Dashboard