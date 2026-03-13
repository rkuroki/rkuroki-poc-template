# TASK002: Frontend Form & Navigation Update

1. **Frontend Feedback Integration**:
   - Ajustar formulários genéricos (eg. `CrudForm`) para usar o hook `useActionState` (ou equivalente da sua stack Next).
   - Injetar o state retornado pela action na UI e mapear a lista de `errors` devidamente preenchida abaixo do botão de "Submit".
2. **Navigation Flow Update**:
   - Avaliar e alterar as páginas de listagem como `CrudTable`.
   - Modificar a ação ou os handlers do botão "Editar" para redicionarem o usuário para a página de edição(`/crud/{entityName}/{mnemonic}`) ao invés de abrir o formulário na mesa página/modal.
3. **Manual Validation & Polish**:
   - Testar o fluxo completo submetendo formulários com erros variados para certificar que as mensagens são recebidas e renderizadas.
   - Entrar em uma conta de teste secundária e atestar visualmente se o ecrã `Forbidden` é chamado em tentativa de acesso não autorizado pelo frontend.
