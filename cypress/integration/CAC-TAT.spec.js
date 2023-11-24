/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function(){
        cy.visit('./src/index.html')   /*visitar a aplicação seja local ou na web*/
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT') /*comparar se o titulo da pagina e igual ao esperado*/
    })

    it('preenche os campos obrigatórios e envia o formulário', function(){
        const longText= 'Teste,teste,teste,teste,teste,,teste,teste,teste,teste,,teste,teste,teste,teste,,teste,teste,teste,teste,,teste,teste,teste,teste,,teste,teste,teste,teste,,teste,teste,teste,teste,,teste,teste,teste,teste,vv'
        cy.get('#firstName').type('Thamires') /*preencher campo atraves de um id*/
        cy.get('#lastName').type('Lucena')
        cy.get('#email').type('thamireslucenasena@gmail.com')
        cy.get('#open-text-area').type(longText, {delay:0}) /*remover delay ao digitar texto muito grande*/
        /*cy.get('.button').click() Procurar e clicar no elemento*/ 
        cy.contains('button','Enviar').click() /*Identifica o elemento e ve se o texto corresponde ao esperado*/
        cy.get('.success').should('be.visible') /*verificar se mensagem de sucesso está visivel*/
        cy.contains('Mensagem enviada com sucesso.').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('#firstName').type('Thamires')
        cy.get('#lastName').type('Lucena')
        cy.get('#email').type('thamireslucenasena@gmail,com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button','Enviar').click()

        cy.get('.error').should('be.visible') /*verificar se mensagem de erro está visivel*/
        cy.contains('Valide os campos obrigatórios!').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numerico', function(){
        cy.get('#phone')
        .type('abcdefg')
        .should('have.value','')

    })

    it('exibe mensagem de erro quando o campo telefone se torna obrigatório, mas, não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Thamires')
        cy.get('#lastName').type('Lucena')
        cy.get('#email').type('thamireslucenasena@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.contains('button','Enviar').click()

        cy.get('.error').should('be.visible') /*verificar se mensagem de erro está visivel*/
    })

    it('preenche e limpa os campos de nome, sobrenome, email e telefone', function(){
        cy.get('#firstName')
            .type('Thamires') /*Digita conteudo no campo*/
            .should('have.value','Thamires') /*Verifica se o conteudo digitado é o esperado*/
            .clear() /*Limpa o campo*/
            .should('have.value','') /*Verifica se o campo ficou em branco*/
        
        cy.get('#lastName')
            .type('Lucena')
            .should('have.value','Lucena')
            .clear()
            .should('have.value','')

        cy.get('#email')
            .type('thamireslucenasena@gmail.com')
            .should('have.value','thamireslucenasena@gmail.com')
            .clear()
            .should('have.value','')

        cy.get('#phone')
        .type('92994438133')
        .should('have.value','92994438133')
        .clear()
        .should('have.value','') 

    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.contains('button','Enviar').click()
        cy.get('.error').should('be.visible') 
    })

    it('enviar formulário com sucesso usando um comando customizado',function(){
        cy.fillMandatoryFieldsAndSubmit() /*Os passos que se repetem foram simplificados em uma função só*/
        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (Youtube) por seu texto', function(){
       cy.get('#product')
            .select('YouTube')
            .should('have.value','youtube') 

    })

    
    it('seleciona um produto (mentoria) por seu valor', function(){
        cy.get('#product')
             .select('mentoria')
             .should('have.value','mentoria') 
 
     })

     it('seleciona um produto (Blog) por seu indice', function(){
        cy.get('#product')
             .select(1)
             .should('have.value','blog') 
 
     })

     it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('be.checked')
     })

     it('marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function($radio){
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
     })

     it('marcando checkbox de "E-mail"', function(){
        cy.get('#email-checkbox')
            .check()
            .should('be.checked')
     })

     it('marcando checkbox de "Telefone"', function(){
        cy.get('#phone-checkbox')
            .check()
            .should('be.checked')
     })

     it('marca ambos os checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]')
            .check() /*marca todos */
            .last() /*pega o ultimo que foi marcado*/
            .uncheck() /*desmarca esse ultimo que foi marcado*/
            .should('not.be.checked') /*checa se realmente foi desmarcado*/
     })

     it('seleciona um arquivo na pasta fixtures', function(){
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value') /*verifica se ja tem algum documento inserido */
            .selectFile('./cypress/fixtures/example.json') /*fazer o upload dos arquivos inserindo manualmente quando clica no botão*/
            .should(function($input){
                console.log($input)
                expect($input[0].files[0].name).to.equal('example.json') /*verifica se o nome do arquivo bate com o que foi feito o upload */
            })
     })

     it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]#file-upload')
        .should('not.have.value') /*verifica se ja tem algum documento inserido */
        .selectFile('./cypress/fixtures/example.json', {action:'drag-drop'}) /*fazer o upload dos arquivos simulando que esta arrastando da janela pra pagina*/
        .should(function($input){
            console.log($input)
            expect($input[0].files[0].name).to.equal('example.json') /*verifica seo nome do arquivo bate com o que foi feito o upload */
        })
     })

     it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile') /*maneira pra facilitar pra precisar escrever o caminho todo do arquivo */
        cy.get('input[type="file"]#file-upload')
            .selectFile('@sampleFile')  
            .should(function($input){
                console.log($input)
                expect($input[0].files[0].name).to.equal('example.json') /*verifica seo nome do arquivo bate com o que foi feito o upload */
            })
     })

     it('verifica que a politica de privacidade abre em outra aba sem necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target','_blank') /*pega a ancora e verifica se ela deve abrir em outra aba, ou seja, se tem o valor blank" */
     })

     it('acessa a página da politica de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr','target') /*remove o target pra conseguir acessar na mesma pagina do cypress */
            .click()
            cy.contains('Talking About Testing').should('be.visible')
     })


})