# TASK003: E2E Testing with Playwright

1. **Test Record Ownership & Authorization**:
   - Criar teste que autentica um usuário e tenta acessar a página de edição de um registro próprio (sucesso esperado).
   - Criar teste que tenta acessar a URL de edição de um registro de outro usuário (deve validar se a tela "Forbidden" ou o status 403 é exibido).
2. **Test Validation Feedback**:
   - Automatizar o preenchimento de um formulário com dados inválidos (ex: campos obrigatórios vazios).
   - Validar se a lista de erros do Zod aparece corretamente abaixo do botão de "Submit" após a submissão.
3. **Test Navigation Flow**:
   - Testar a interação na `CrudTable`: ao clicar em "Editar", verificar se o Playwright detecta a mudança de URL para `/crud/[entityName]/[mnemonic]`.
4. **Regression Testing**:
   - Garantir que a criação de novos registros (Create) ainda funciona conforme esperado, mesmo com a mudança no fluxo de edição.
