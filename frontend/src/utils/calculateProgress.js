// Berekent de voortgang van de gebruiker t.o.v. het weekdoel (FR08)

function calculateProgress(sessions, weekGoal) {
    // Bepaal het begin van de huidige week (maandag 00:00:00)
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = zondag, 1 = maandag, etc.
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    startOfWeek.setHours(0, 0, 0, 0) // maandag middernacht

    // Filter alleen sessies van deze week
    const thisWeekSessions = sessions.filter(session =>
        new Date(session.date) >= startOfWeek
    )

    const completed = thisWeekSessions.length
    const total = weekGoal
    const remaining = Math.max(0, weekGoal - completed)

    return { completed, total, remaining }
}

export default calculateProgress