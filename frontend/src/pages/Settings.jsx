import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import HomeIcon from '../components/icons/HomeIcon'

// Settings - container component
// Verantwoordelijk voor: weekdoel instellen en opslaan (FR06, FR07)

function Settings() {
    const [weekGoal, setWeekGoal] = useState(3)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:3000/weekGoal')
            .then(res => res.json())
            .then(data => setWeekGoal(Number(data.value)))
    }, [])

    function handleClick() {
        fetch('http://localhost:3000/weekGoal', {
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: weekGoal })
        })
    .then(res => res.json())
    .then(() => navigate('/dashboard'))
    }

    return (
        <div className="screen">
            <Navbar title="Settings" icon={<HomeIcon />} to="/" />
            <main className="content">
                <div className="card">
                    <p className="picker-title">Hoevaak wil je per week trainen?</p>
                    <div className="radio-group">
                        {[1,2,3,4,5,6,7].map(n => (
                            <label
                                key={n}
                                className={`radio-option ${weekGoal === n ? 'selected' : ''}`}
                                onClick={() => setWeekGoal(n)}>
                                <span className="radio-dot"></span>
                                {n} {n === 1 ? 'sessie' : 'sessies'}
                            </label>
                        ))}
                    </div>
                    <button className="btn-primary" onClick={handleClick}>
                        Weekdoel opslaan
                    </button>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                    Bekijk dashboard
                </button>
            </main>
        </div>
    )
}

export default Settings