// E2E tests — GYMX LU21
// Vereist: Vite draait op localhost:5173 + json-server op localhost:3000

// E2E-01: Volledige check-in flow (T01, T03, T04, T07, T08)
describe('Check-in flow', () => {
    beforeEach(() => {
        // Reset db.json voor elke test via json-server reset endpoint
        cy.request('GET', 'http://localhost:3000/sessions').then((response) => {
            response.body.forEach((session) => {
                cy.request({
                    method: 'DELETE', 
                    url: `http://localhost:3000/sessions/${session.id}`,
                failOnStatusCode: false
            })
            
        })
    })
})

    it('gebruiker registreert check-in en ziet bijgewerkte voortgang', () => {
        cy.visit('/')

        // Check-in scherm geladen
        cy.contains('Training registreren').should('be.visible')
        cy.contains('Registreer je training').should('be.visible')

        // Klik op check-in
        cy.contains('Training registreren').click()

        // Bevestigingsscherm
        cy.url().should('include', '/confirmation')
        cy.contains('Je bent op: Bevestiging').should('be.visible')
        cy.contains('Je training is opgeslagen').should('be.visible')

        // Navigeer naar dashboard
        cy.contains('Bekijk dashboard').click()
        cy.url().should('include', '/dashboard')
        cy.contains('Je bent op: Dashboard').should('be.visible')
        cy.contains('trainingen gedaan').should('be.visible')
    })
})

// E2E-02: Weekdoel wijzigen flow (T05, T07, T08)
describe('Weekdoel flow', () => {
    it('gebruiker past weekdoel aan e ziet bijgewerkte voortgang', () => {
        cy.visit('/dashboard')

        // Dashboard geladen
        cy.contains('Je bent op: Dashboard').should('be.visible')
        cy.contains('Weekdoel aanpassen').should('be.visible')

        // Navigeer naar settings
        cy.contains('Weekdoel aanpassen').click()
        cy.url().should('include', '/settings')
        cy.contains('Je bent op: Settings').should('be.visible')

        // Weekdoel wijzigen
        cy.contains('4 sessies').click()
        cy.contains('Weekdoel opslaan').click()

        // Terug op dashboard met bijgewerkt weekdoel
        cy.url().should('include', '/dashboard')
        cy.contains('4 trainingen per week').should('be.visible')
    })
})