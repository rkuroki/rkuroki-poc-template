# PLAN: Entity CRUD Pages Refactoring

## 1. Objetivo
Refatorar a aplicação para que toda entidade possua uma página acessível de edição via o path dinâmico `/crud/{entityName}/{mnemonic}`.

## 2. Requisitos
- **Path Dinâmico**: Criar uma rota genérica no Next.js: `app/crud/[entityName]/[mnemonic]/page.tsx`.
- **Edição Restrita (Forbidden)**: 
  - Apenas o usuário dono do registro pode editá-lo.
  - O backend deve checar se a entidade possui relacionamento com usuário (ex: um campo `userId`).
  - Caso o registro pertença a outro usuário, o sistema deve bloquear o acesso e exibir uma tela "Forbidden" (403).
- **Validação no Backend**:
  - Toda submissão deve ser validada no backend utilizando os schemas do Zod já existentes.
  - Em caso de falha de validação, os erros devem ser retornados estruturados para o frontend.
- **Feedback de Validação no Frontend**:
  - A lista de problemas de validação retornada pelo backend deve ser exibida ao usuário.
  - Estes alertas e erros devem estar posicionados visualmente abaixo do botão de "Submit" no formulário.
- **Navegação para a Página de Edição**:
  - Na página de listagem (`CrudTable`), ao clicar na ação de "Editar" de um registro, o usuário deve ser redirecionado para esta nova página de edição `app/crud/[entityName]/[mnemonic]/page.tsx` em vez de abrir um modal ou usar o formulário atual na mesma página.
- **Cobertura de Testes E2E**:
  - Implementar testes automatizados com Playwright para cobrir o fluxo de edição, permissões (Forbidden) e feedbacks de validação.

## 3. Implementação Proposta

### Estrutura de Rotas
- Criar `app/crud/[entityName]/[mnemonic]/page.tsx`:
  - Será responsável por analisar o `entityName`, carregar o registro pelo `mnemonic`.
  - Checar a sessão do usuário atual. Se o registro tem um `userId` e não bate com o usuário logado, renderizar um componente de erro `<Forbidden />`.
  - Renderizar o formulário genérico de edição da entidade.

### Validação e Server Actions
- Refatorar as Server Actions (ex: `upsertGenericAction` ou manter um dicionário de actions).
- A Action receberá o `FormData` e utilizará o `z.parse()`/`z.safeParse()` do respectivo schema da entidade.
- Caso `safeParse` indique erro:
  ```typescript
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Falha na validação dos campos.'
    };
  }
  ```

### Atualização do Frontend (Formulário)
- O componente de formulário utilizará o hook `useActionState` (ou equivalente) para capturar a resposta de erro da server action.
- Adicionar uma seção abaixo do botão de **Submit** para iteração do objeto de erros:
  ```tsx
  <button type="submit">Salvar</button>
  {state.errors && (
    <div className="mt-4 p-4 text-red-700 bg-red-100 rounded-md">
      <ul>
        {Object.entries(state.errors).map(([field, messages]) => (
          <li key={field}>
            <strong>{field}:</strong> {messages.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  )}
  ```

### Checklist
- [ ] Criar a rota dinâmica `app/crud/[entityName]/[mnemonic]/page.tsx`.
- [ ] Implementar a verificação de permissão e exibição da tela "Forbidden" para acessos não autorizados.
- [ ] Criar ou modificar a Server Action genérica para retornar `fieldErrors` do Zod.
- [ ] Ajustar o `CrudForm` (ou formulário genérico) para consumir esses erros.
- [ ] Exibir a lista de erros de validação abaixo do botão "Submit".
- [ ] Atualizar os componentes de listagem (ex: `CrudTable`) para que a ação de "Editar" navegue para `/crud/[entityName]/[mnemonic]`.
- [ ] Implementar testes E2E com Playwright cobrindo os cenários de: Sucesso na edição, Acesso negado (403), e Erros de validação do Zod.
- [ ] Validar a integração final realizando testes manuais com um `user` diferente e inputs inválidos.
