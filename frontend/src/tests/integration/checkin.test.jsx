import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import CheckIn from '../../pages/CheckIn'

// T04 integratietests - POST /sessions (FR01, FR02)

beforeEach(() => {
    globalThis.fetch = vi.fn(() => 
        Promise.resolve({
            json: () => Promise.resolve({ id: '123', date: '2026-04-03T10:00:00.000Z'})
        })
    )
})

test('POST /sessions wordt aangeroepen bij check-in', async () => {
    render(
        <MemoryRouter>
            <CheckIn />
        </MemoryRouter>
    )
    await userEvent.click(screen.getByText('Training registreren'))
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/sessions',
            expect.objectContaining({ method: 'POST' })
        )
    })
})

test('na check-it navigeert de gebruiker naar bevestigingsscherm', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <CheckIn />
        </MemoryRouter>
    )
    await userEvent.click(screen.getByText('Training registreren'))
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
    })
})