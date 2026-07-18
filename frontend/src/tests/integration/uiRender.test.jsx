import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'
import Confirmation from '../../pages/Confirmation'

// T07 integratietests - UI renderen op basis van API data (FR05, FR09)

beforeEach(() => {
    global.fetch = vi.fn()
        .mockResolvedValueOnce({
            json: () => Promise.resolve([
                { id: '1', date: new Date().toISOString() },
                { id: '2', date: new Date().toISOString() }
            ])
        })
        .mockResolvedValueOnce({
            json: () =>Promise.resolve({ value: 5 })
        })
})

test('dashboard toont correcte voortgang op basis van sessies en weekdoel', async () => {
    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
    )
    await waitFor(() => {
        expect(screen.getByText(/Voortgang naar je weekdoel/)).toBeInTheDocument()
        expect(screen.getByText(/trainingen gedaan/)).toBeInTheDocument()
    })
})

test('confirmation toont correcte voortgang en dynamische bevestigingstekst', async () => {
    render(
        <MemoryRouter>
            <Confirmation />
        </MemoryRouter>
    )
    await waitFor(() => {
        expect(screen.getByText(/Voortgang naar je weekdoel/)). toBeInTheDocument()
        expect(screen.getByText(/Nog 3 trainingen tot je weekdoel/)).toBeInTheDocument()
    })
})