describe('cypress/integration/tests.spec.js', () => {
  it('home page loads', () => {
    cy.visit('/')
    cy.contains('Destiny Child Tools')
    cy.contains('Censorship Level')
  })
  it('Childs & Mod Database', () => {
    cy.visit('/')
    cy.contains('Childs & Mods Database').click()
    cy.contains('View as')
  })
  it('individual child', () => {
    cy.visit('/childs/c000')
    cy.title().should('include', 'Hero')
    cy.contains('Hero')
  })
})
