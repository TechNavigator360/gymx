import calculateProgress from '../../utils/calculateProgress'

// T06 unit tests - weekvoortgang berekenen (FR08)

// hulpfunctie: maakt een sessie aan met datum van vandaag
function makeSession(daysAgo = 0) {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    return { id: String(daysAgo), date: date.toISOString() }
}

test('berekening klopt: 2 sessies, doel 3', () => {
    const sessions = [makeSession(0), makeSession(1)]
    const result = calculateProgress(sessions, 3)
    expect(result.completed).toBe(2)
    expect(result.total).toBe(3)
    expect(result.remaining).toBe(1)
})

test('randgeval: 0 sessies', () => {
    const result = calculateProgress([], 3)
    expect(result.completed).toBe(0)
    expect(result.remaining).toBe(3)
})

test('randgeval: doel bereikt', () => {
    const sessions = [makeSession(0), makeSession(1), makeSession(2)]
    const result = calculateProgress(sessions, 3)
    expect(result.completed).toBe(3)
    expect(result.remaining).toBe(0)
})

test('randgeval: boven doel', () => {
    const sessions = [makeSession(0), makeSession(1), makeSession(2), makeSession(3)]
    const result = calculateProgress(sessions, 3)
    expect(result.completed).toBe(4)
    expect(result.remaining).toBe(0)
})