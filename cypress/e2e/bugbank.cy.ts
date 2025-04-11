describe('Fluxo completo de Cadastro, Login e Logout! | BugBank', () => {
    const credenciais = {
        email: 'pablo@gmail.com',
        senha: '123456',
        nome: 'Pablo'
    };

    // Mapeamento dos seletores
    const selectors = {
        botaoRegistrar: "//button[text()= 'Registrar']",
        inputEmail: "(//label[text()='E-mail']//following-sibling::input)[2]",
        inputNome: "/html/body/div/div/div[2]/div/div[2]/form/div[3]/input",
        inputSenha: "/html/body/div/div/div[2]/div/div[2]/form/div[4]/div/input",
        inputConfirmarSenha: "/html/body/div[1]/div/div[2]/div/div[2]/form/div[5]/div/input",
        botaoRegistrarForm: ".styles__ContainerFormRegister-sc-7fhc7g-0 > .style__ContainerButton-sc-1wsixal-0",
        fecharModal: "#btnCloseModal",
        inputLoginEmail: "(//label[text()='E-mail']//following-sibling::input)[1]",
        inputLoginSenha: "/html/body/div/div/div[2]/div/div[1]/form/div[2]/div/input",
        botaoEntrar: "/html/body/div/div/div[2]/div/div[1]/form/div[3]/button[1]",
        botaoSair: "/html/body/div/div/div[1]/div/a",
        botaotransf: "/html/body/div/div/div[3]/div[2]/div[1]/a/span/img", // Botão de transferência
        inputNumeroConta: "/html/body/div/div/div[3]/form/div[1]/div[1]/input", // Número da Conta
        inputDigito: "/html/body/div/div/div[3]/form/div[1]/div[2]/input", // Dígito
        inputValorTransferencia: "/html/body/div/div/div[3]/form/div[2]/input", // Valor da Transferência
        inputDescricao: "/html/body/div/div/div[3]/form/div[3]/input", // Descrição
        botaoTransferir: "/html/body/div/div/div[3]/form/button", // Botão Transferir Agora
        botaoVoltar: "/html/body/div/div/div[2]/div/a", // Botão Voltar
        botaoExtrato: "/html/body/div/div/div[3]/div[2]/div[3]/a/span/img", // Botão Extrato
        mensagemContaInvalida: "/html/body/div/div/div[5]/div/div[2]/p", // Mensagem "conta inválida ou inexistente"
        botaoFecharMensagem: "/html/body/div/div/div[5]/div/div[2]/a" // Botão Fechar
    };

    beforeEach(() => {
        cy.visit('https://bugbank.netlify.app/');
        cy.xpath(selectors.botaoRegistrar).click();
        cy.xpath(selectors.inputEmail).type(credenciais.email, { force: true, delay: 100 });
        cy.xpath(selectors.inputNome).type(credenciais.nome, { force: true, delay: 100 });
        cy.xpath(selectors.inputSenha).type(credenciais.senha, { force: true, delay: 100 });
        cy.xpath(selectors.inputConfirmarSenha).type(credenciais.senha, { force: true, delay: 100 });

        cy.get('#toggleAddBalance').click({ force: true });
        cy.wait(4000); // Espera de 4 segundos para observar a marcação

        cy.get(selectors.botaoRegistrarForm).click({ force: true });
        cy.wait(6000);
        cy.get(selectors.fecharModal).should('be.visible').click({ force: true });
    });

    it('CT 01 e 03: Login, Transferência, Verificar Extrato e Logout', () => {
        cy.xpath(selectors.inputLoginEmail).type(credenciais.email, { force: true, delay: 100 });
        cy.xpath(selectors.inputLoginSenha).type(credenciais.senha, { force: true, delay: 100 });
        cy.xpath(selectors.botaoEntrar).click();
        cy.wait(6000);

        // Interação: Transferência
        cy.xpath(selectors.botaotransf).should('be.visible').click(); // Clique no botão de transferência
        cy.xpath(selectors.inputNumeroConta).type('000', { force: true, delay: 100 }); // Substitui número da Conta para "000"
        cy.xpath(selectors.inputDigito).type('0', { force: true, delay: 100 }); // Dígito
        cy.xpath(selectors.inputValorTransferencia).type('500', { force: true, delay: 100 }); // Valor da Transferência
        cy.xpath(selectors.inputDescricao).type('Teste do Cypress', { force: true, delay: 100 }); // Descrição
        cy.xpath(selectors.botaoTransferir).click(); // Botão Transferir Agora

        // Condicional para conta inválida ou inexistente
        cy.xpath(selectors.mensagemContaInvalida).then($mensagem => {
            if ($mensagem.is(':visible')) {
                cy.xpath(selectors.botaoFecharMensagem).click(); // Fecha a mensagem de erro
            }
        });

        cy.xpath(selectors.botaoVoltar).click(); // Botão Voltar

        // Nova interação: Verificar Extrato
        cy.xpath(selectors.botaoExtrato).should('be.visible').click(); // Clique no botão Extrato
        cy.wait(5000); // Aguarde 5 segundos na página do extrato
        cy.xpath(selectors.botaoVoltar).click(); // Clique no botão Voltar novamente
        cy.wait(3000); // Aguarde 3 segundos na página antes de sair

        // Logout
        cy.xpath(selectors.botaoSair).click(); // Botão "Sair"
        cy.url().should('include', ''); // Confirma que retornou à tela de login
        cy.xpath(selectors.inputLoginEmail).should('be.visible'); // Verifica que o campo de e-mail está visível
        cy.wait(6000);
    });
});