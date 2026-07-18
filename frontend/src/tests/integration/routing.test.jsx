import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

// T01 Integratietests: routing tussen schermen werkt correct

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([])
    })
  )
})

test('/ toont check-in scherm', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <App />
        </MemoryRouter>
    )
    expect(screen.getByText('Training registreren')).toBeInTheDocument()
})

test('/confirmation toont bevestigingsscherm', () => {
    render(
        <MemoryRouter initialEntries={['/confirmation']}>
            <App />
        </MemoryRouter>
    )
    expect(screen.getByText(/Bevestiging/)).toBeInTheDocument()
})

test('/dashboard toont dashboard scherm', () => {
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <App />
        </MemoryRouter>
    )
    expect(screen.getByText(/Dashboard/)).toBeInTheDocument()
})

test('/settings toont settingsscherm', () => {
    render(
        <MemoryRouter initialEntries={['/settings']}>
            <App />
        </MemoryRouter>
    )
    expect(screen.getByText(/Settings/)).toBeInTheDocument()
})