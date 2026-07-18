import { useNavigate } from 'react-router-dom'

// Navbar - presentation component
// Gedeelde navigatiebalk voor alle schermen (NFR10)

function Navbar({ title, icon, to }) {
    const navigate = useNavigate()

    return (
        <nav className="navbar">
            <span className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                GYMX
            </span> {/* OPT05 T06 — actieve locatie zichtbaar voor gebruiker */}
            {title && <span className="nav-title">Je bent op: {title}</span>} 
            {/* OPT05 T06, T07 — actieve locatie zichtbaar voor gebruiker */}
            {to && (
                <button className="icon-btn" onClick={() => navigate(to)}>
                    {icon}
                </button>
            )}
        </nav>
    )
}

export default Navbar