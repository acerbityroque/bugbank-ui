describe('Fluxo de Cadastro e Login | BugBank', () => {
  const credenciais = {
      email: 'pablo@gmail.com',
      senha: '123456'
  };

  before(() => {
      // Realiza o cadastro (CT03)
      cy.visit('https://bugbank.netlify.app/');
      cy.xpath("//button[text()= 'Registrar']").click();
      cy.xpath("(//label[text()='E-mail']//following-sibling::input)[2]").type(credenciais.email, { force: true, delay: 100 });
      cy.xpath("/html/body/div/div/div[2]/div/div[2]/form/div[3]/input").type('Pablo', { force: true, delay: 100 });
      cy.xpath("/html/body/div/div/div[2]/div/div[2]/form/div[4]/div/input").type(credenciais.senha, { force: true, delay: 100 });
      cy.xpath("/html/body/div[1]/div/div[2]/div/div[2]/form/div[5]/div/input").type(credenciais.senha, { force: true, delay: 100 });
      cy.xpath("/html/body/div[1]/div/div[2]/div/div[2]/form/div[6]/label/span").click({ force: true });
      cy.get('.styles__ContainerFormRegister-sc-7fhc7g-0 > .style__ContainerButton-sc-1wsixal-0').click({ force: true });
      cy.get('#btnCloseModal').should('be.visible').click({ force: true });
  });

  it('Realiza login com as credenciais cadastradas (CT01)', () => {
      // Faz login com as credenciais criadas no CT03
      cy.visit('https://bugbank.netlify.app/');
      cy.xpath("(//label[text()='E-mail']//following-sibling::input)[1]").type(credenciais.email, { force: true, delay: 100 });
      cy.xpath("(//label[text()='Senha']//following-sibling::input)[1]").type(credenciais.senha, { force: true, delay: 100 });
      cy.xpath("//button[text()='Acessar']").click();

  });
});