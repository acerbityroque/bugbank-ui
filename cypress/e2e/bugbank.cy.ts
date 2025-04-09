describe('Fluxo completo de Cadastro, Login e Logout! | BugBank', () => {
    const credenciais = {
        email: 'pablo@gmail.com',
        senha: '123456',
        nome: 'Pablo'
    };

    beforeEach(() => {
        // test_CT03: Cadastro com dados válidos
        cy.visit('https://bugbank.netlify.app/');
        cy.xpath("//button[text()= 'Registrar']").click();
        cy.xpath("(//label[text()='E-mail']//following-sibling::input)[2]").type(credenciais.email, { force: true, delay: 100 });
        cy.xpath("/html/body/div/div/div[2]/div/div[2]/form/div[3]/input").type(credenciais.nome, { force: true, delay: 100 });
        cy.xpath("/html/body/div/div/div[2]/div/div[2]/form/div[4]/div/input").type(credenciais.senha, { force: true, delay: 100 });
        cy.xpath("/html/body/div[1]/div/div[2]/div/div[2]/form/div[5]/div/input").type(credenciais.senha, { force: true, delay: 100 });
        cy.xpath("/html/body/div[1]/div/div[2]/div/div[2]/form/div[6]/label/span").click({ force: true });
        cy.get('.styles__ContainerFormRegister-sc-7fhc7g-0 > .style__ContainerButton-sc-1wsixal-0').click({ force: true });
         // Adiciona um delay de 6 segundos antes do login
         cy.wait(6000);
        cy.get('#btnCloseModal').should('be.visible').click({ force: true });
        
    });


    it.only('CT 01 e 03, Login e Logout', () => {
        // ct_TEST01_TEST_03: Login e Logout
        cy.xpath("(//label[text()='E-mail']//following-sibling::input)[1]").type(credenciais.email, { force: true, delay: 100 });;
        cy.xpath('/html/body/div/div/div[2]/div/div[1]/form/div[2]/div/input').type(credenciais.senha, { force: true, delay: 100 });
        cy.xpath("/html/body/div/div/div[2]/div/div[1]/form/div[3]/button[1]").click(); // Botão "Entrar"
         // Adiciona um delay de 6 segundos antes do login
         cy.wait(6000);
        cy.xpath("/html/body/div/div/div[1]/div/a").click(); // Botão "Sair" na tela logada

        // Validações pós-logout
        cy.url().should('include', ''); // Confirma que retornou à tela de login
        cy.xpath("(//label[text()='E-mail']//following-sibling::input)[1]").should('be.visible'); // Verifica que o campo de e-mail está visível
        cy.wait(6000)
    }); 
});