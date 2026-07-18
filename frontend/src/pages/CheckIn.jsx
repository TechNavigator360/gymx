import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import GearIcon from '../components/icons/GearIcon'

// Check-in - container component
// Verantwoordelijk voor: opslaan training check-in en dashboard bijwerken (FR01, FR02)

function CheckIn() {

    const navigate = useNavigate();

    function handleClick() {
        fetch('http://localhost:3000/sessions', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: new Date().toISOString() })
        })
    .then(res => res.json())
    .then(() => navigate('/confirmation'))
    }

    return (
        <div className="screen">
            <Navbar icon={<GearIcon />} to="/settings"/>
            <div className="content">
                {/* T12 - effect van check-in vooraf uitleggen (OPT08) */}
                <p className="nav-title" style={{textAlign: 'center', padding: '0 24px', marginTop: '198px'}}>
                    Registreer je training en update je voortgang
                </p>
                <button className="btn-primary btn-checkin" onClick={handleClick}>
                Training registreren
            </button>
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                Bekijk dashboard
            </button>  
            </div>
        </div>
    )
}

export default CheckIn