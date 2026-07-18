import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'

// T03 integratietests — GET /sessions (FR03, FR05)

beforeEach(() => {
    global.fetch = vi.fn()
        .mockResolvedValueOnce({
            json: () => Promise.resolve([
                { id: 1, date: new Date().toISOString() }
            ])
        })
        .mockResolvedValueOnce({
            json: () => Promise.resolve({ value: 3 })
        })
        
})

test('GET /sessions wordt aangeroepen bij laden dashboard', async () => {
    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>)
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/sessions')
    })
})

test('opgehaalde sessies worden correct weergegeven in UI', async () => {
    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>)
    await waitFor(() => {
        expect(screen.getByText(/trainingen gedaan/)).toBeInTheDocument()
    })
})