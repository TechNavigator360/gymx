import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import calculateProgress from '../utils/calculateProgress'
import Navbar from '../components/Navbar'
import HomeIcon from '../components/icons/HomeIcon'
import ProgressCard from '../components/ProgressCard'

// Confirmation - container component
// Verantwoordelijk voor: dashboard bijwerken en bevestigen (FR02, FR05, FR09)

function Confirmation() {

    {/* T09 — bevestiging na check-in (OPT07) 1/2 */}
    const [showToast, setShowToast] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setShowToast(false), 1000)
        return () => clearTimeout(timer)
    }, [])

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
    const msg = progress.remaining === 0
        ? 'Geweldig! Je hebt je weekdoel bereikt!'
        : `Gefeliciteerd! Nog ${progress.remaining} training${progress.remaining === 1 ? '' : 'en'} tot je weekdoel.`

    return (
        <div className="screen">
            {/* T09 - bevestiging na checkin (OPT07 2/2 */}
            {showToast && (
                <>
                    {/* Overlay — vervaagt achtergrond tijdens bevestiging */}
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(248,247,245, 0.9)',
                        zIndex: 99
                    }} />
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        background: 'var(--color-reward-gold)',
                        color: 'var(--color-text-primary)',
                        padding: '32px 40px',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-card-hover)',
                        fontSize: '16px', 
                        fontWeight: '600',
                        textAlign: 'center',
                        zIndex: 100
                    }}>
                        <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>💯</span>
                        Je training is opgeslagen!                       
                    </div>
                </>
            )}

            <Navbar title="Bevestiging" icon={<HomeIcon />} to="/" />
            <main className="content">
                <div className="card confirmation-banner">
                    <p>{msg}</p>
                </div>
                {/*OPT07 T10, T11 Voortgang en visuele feedback direct na checkin bevestiging (T09)*/}
                <ProgressCard progress={progress} animationDelay={1800} /> 
                <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                    Bekijk dashboard
                </button>
            </main>
        </div>
    )

}

export default Confirmation