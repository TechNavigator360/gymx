import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import calculateProgress from '../utils/calculateProgress'
import Navbar from '../components/Navbar'
import HomeIcon from '../components/icons/HomeIcon'
import ProgressCard from '../components/ProgressCard'


// Dashboard - container component
// Verantwoordelijk voor: ophalen en tonen van sessies en frequentie (FR03, FR05, FR09)

function Dashboard() {

    const [sessions, setSessions] = useState([])
    const [weekGoal, setWeekGoal] = useState(3)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:3000/sessions')
            .then(res => res.json())
            .then(data => setSessions(data))

        fetch('http://localhost:3000/weekGoal')
            .then(res => res.json())
            .then(data => setWeekGoal(data.value))
    }, [])

    const progress = calculateProgress(sessions, weekGoal)

    return (
        <div className="screen">
            <Navbar title="Dashboard" icon={<HomeIcon />} to="/" />
            <main className="content">
                <ProgressCard progress={progress}></ProgressCard>
                    <div className="goal-box">
                        <p className="goal-label">Weekdoel</p>
                        <p className="goal-value">{weekGoal} trainingen per week</p>
                        <button className="btn-primary" onClick={() => navigate('/settings')}>
                            Weekdoel aanpassen
                        </button>
                    </div>
            </main>
        </div>
    )
}

export default Dashboard