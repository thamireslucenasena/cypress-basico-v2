Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Thamires') 
    cy.get('#lastName').type('Lucena')
    cy.get('#email').type('thamireslucenasena@gmail.com')
    cy.get('#open-text-area').type('teste') 
    cy.contains('button','Enviar').click()
})
