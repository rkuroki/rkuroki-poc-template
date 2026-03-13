# TASK004: Admin — Edição Completa de Todas as Entidades

Atualmente a tela de edição `/crud/{entityName}/{mnemonic}` expõe apenas um subconjunto dos campos de cada entidade. O admin deve poder editar **todos** os campos editáveis.

## Por Entidade

### User
Campos atualmente expostos: `name`, `pwd`  
Campos que faltam para o admin:
- `username` — editável pelo admin (exceto o próprio usuário `admin` não pode ser renomeado)

Ação necessária:
1. Adicionar `username` ao `UserUpdatePayloadSchema` (com validação `min(1)`)
2. Adicionar campo `username` no formulário da página (`app/crud/[entityName]/[mnemonic]/page.tsx`)
3. Atualizar `updateEntityAction` para incluir `username` no `updateUserAdmin` (ou criar `updateUserFull`)
4. Lembrar: o usuário `admin` não pode ter o `username` alterado — manter essa guard

---

### PageUrl
Campos atualmente expostos: `url`, `path`  
Todos os campos editáveis já estão expostos. ✅ Nenhuma alteração necessária.

---

### Note
Campos atualmente expostos: `note`, `order`  
Campos que faltam para o admin:
- `userId` — o admin pode reatribuir uma nota a outro usuário

Ação necessária:
1. Adicionar `userId` ao `NoteUpdatePayloadSchema` (opcional, uuid)
2. Adicionar um campo `<select>` ou input de texto com `userId` no formulário (somente visível para admin)
3. Atualizar `updateEntityAction` para incluir `userId` no `updateNote`
4. Atualizar `updateNote` no model para aceitar `userId` opcional
5. Na tela de edição, passar a lista de usuários como prop para exibir o `<select>`

---

### FeatureFlag
Atualmente **não tem** página de edição dinâmica (usa edição inline no `CrudLayout`).  
Campos editáveis: `name`, `value`

Ação necessária:
1. Adicionar `getFeatureFlagByMne` ao `featureFlag.model.ts`
2. Criar `FeatureFlagUpdatePayloadSchema` com `name` e `value` (ambos `z.string().min(1)`)
3. Adicionar suporte a `featureflags` no `updateEntityAction`
4. Adicionar suporte a `featureflags` na página `app/crud/[entityName]/[mnemonic]/page.tsx`
5. Adicionar `entityName="featureflags"` na página `/home/feature-flags/page.tsx`
6. A rota de volta deve apontar para `/home/feature-flags`

---

## Checklist

- [ ] **User**: adicionar campo `username` ao `UserUpdatePayloadSchema`, action e formulário
- [ ] **User**: garantir que admin não pode renomear o próprio usuário `admin`
- [ ] **Note (admin)**: adicionar campo `userId` ao formulário e possibilitar reatribuição
- [ ] **Note**: atualizar `updateNote` model para aceitar `userId` opcional
- [ ] **FeatureFlag**: adicionar `getFeatureFlagByMne` e `FeatureFlagUpdatePayloadSchema` ao model
- [ ] **FeatureFlag**: conectar ao `updateEntityAction` e à página de edição dinâmica
- [ ] **FeatureFlag**: adicionar `entityName="featureflags"` na listagem `/home/feature-flags`
- [ ] **Testes manuais**: verificar cada entidade após as mudanças
