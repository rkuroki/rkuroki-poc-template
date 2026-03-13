# TASK001: Backend Base & Dynamic Route

1. **Create the Dynamic Route**:
   - Criar `app/crud/[entityName]/[mnemonic]/page.tsx`.
   - Implementar roteamento inicial que carrega parâmetros.
2. **Access Control (Forbidden)**:
   - Adicionar checagem de propriedade de dados pelo `userId` comparando com a sessão do usuário no `page.tsx` criado.
   - Renderizar o componente `<Forbidden />` quando o autorretrato falhar (erro 403).
3. **Backend Validation Setup**:
   - Revisar e adequar as Actions que salvam formulários para executar o `safeParse` via esquemas do `zod`.
   - Garantir que as Server Actions retornam de forma amigável os `fieldErrors` do `zod` em caso de falha.
