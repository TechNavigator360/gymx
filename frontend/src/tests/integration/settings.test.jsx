import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Settings from '../../pages/Settings'

// T05 integratietest - PATCH /weekGoal (FR06, FR07)

beforeEach(() => {
    global.fetch = vi.fn()
        .mockResolvedValueOnce({
            json: () => Promise.resolve({ value: 3 })
        })
        .mockResolvedValueOnce({
            json: () => Promise.resolve({ value: 5 })
    })    
})

test('PATCH /weekGoal wordt correct aangeroepen bij opslaan weekdoel', async () => {
    render(
        <MemoryRouter>
            <Settings />
        </MemoryRouter>
    )

    await userEvent.click(screen.getByText(/5 sessies/))
    await userEvent.click(screen.getByText('Weekdoel opslaan'))

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/weekGoal', 
            expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({ value: 5 })
            })
        )
    })
})
