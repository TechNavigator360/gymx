// ProgressCard - presentation component
// Verantwoordelijk voor: tonen van weekvoortgang (FR05, FR09, OPT01)

function ProgressCard({ progress, children, animationDelay }) {

    const circumference = 502
    const offset = circumference - (Math.min(progress.completed / progress.total, 1) * circumference)
    const accentClass = progress.completed === 0 ? ''
        : progress.completed >= progress.total ? 'gold'
        : progress.completed / progress.total >= 0.5 ? 'silver'
        : 'bronze'

    return (
        <div className={`card progress-card ${accentClass}`}>
            {/* T02 - ring label */}
            <p className="progress-title">Voortgang naar je weekdoel</p>
            <div className="ring-wrapper">
                <svg className="progress-ring" viewBox="0 0 200 200">
                    <circle className="ring-bg" cx="100" cy="100" r="80" />
                    {/* OPT07 T10 T11 Voortgang en visuele feedback direct na checkin bevestiging (T09) */}
                    <circle className="ring-fg" cx="100" cy="100" r="80"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transitionDelay: `${animationDelay}ms` }}/>
                </svg>
                <div className="ring-label">
                    <span className="ring-num">{progress.completed} / {progress.total}</span>
                </div>
            </div>
            <p className="progress-title">Deze week:</p>
            {/* T01 — betekenis van X en Y */} {/* T03 — resterende trainingen */}
            <p className="goal-label">{progress.completed} van je {progress.total} trainingen gedaan.
                <br />Nog {progress.remaining} trainingen tot je doel! </p>
            {children}
        </div>
    )
}

export default ProgressCard