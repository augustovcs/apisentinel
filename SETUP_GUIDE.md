# APISentinel - Guia de Setup e Instalação

## ✅ Checklist de Implementação

### Backend (.NET)

- [x] Modelos criados:
  - `ScheduleModel.cs`
  - `ExecutionLogModel.cs`

- [x] DTOs criados:
  - `ScheduleDTO.cs`
  - `ExecutionLogDTO.cs`

- [x] Interfaces criadas:
  - `IScheduleService.cs`
  - `IExecutionLogService.cs`

- [x] Services implementados:
  - `ScheduleService.cs`
  - `ExecutionLogService.cs`

- [x] Controllers criados:
  - `ScheduleController.cs`
  - `ExecutionLogController.cs`

- [x] Program.cs atualizado com DI

### Frontend (Next.js)

- [x] Types atualizados em `lib/types.ts`

- [x] Services criados:
  - `app/services/schedulesService.ts`
  - `app/services/logsService.ts`

- [x] Componentes criados:
  - `components/tests/ScheduleModal.tsx`

- [x] Pages criadas:
  - `app/dashboard/analytics/page.tsx`
  - `app/dashboard/logs/page.tsx`

- [x] Componentes modificados:
  - `components/tests/TestsClient.tsx` - Botão Schedule
  - `components/layout/Sidebar.tsx` - Novas rotas
  - `app/dashboard/executions/page.tsx` - Botão Refresh

### Database (Supabase PostgreSQL)

- [ ] Tabelas criadas (EXECUTE O SCRIPT SQL)
- [ ] Índices criados
- [ ] Views criadas (opcional)

---

## 🚀 Passo a Passo de Instalação

### 1️⃣ **Clonar/Atualizar o Repositório**

```bash
cd c:\Users\augus\Documents\CODE\APISentinel
git status
git add .
git commit -m "feat: add schedule, analytics, and logs features"
```

### 2️⃣ **Executar Migrações do Banco de Dados**

1. Abra o Supabase Dashboard (https://supabase.com)
2. Vá para seu projeto
3. Clique em "SQL Editor"
4. Clique em "New Query"
5. Copie todo o conteúdo de `DATABASE_MIGRATION.sql`
6. Cole no editor do Supabase
7. Clique em "Execute"

```bash
# Ou use psql se tiver acesso direto ao banco
psql -U postgres -h [host] -d postgres -f DATABASE_MIGRATION.sql
```

### 3️⃣ **Backend - Build e Run**

```bash
cd Backend/apisentinel_net

# Restaurar dependências
dotnet restore

# Build
dotnet build

# Run
dotnet run
```

O backend deve estar rodando em `http://localhost:5000`

### 4️⃣ **Frontend - Instalar Dependências**

```bash
cd Frontend

# Instalar packages (se não estiver feito)
npm install

# Ou se usar yarn
yarn install
```

### 5️⃣ **Frontend - Configurar Variáveis de Ambiente**

Crie ou atualize `.env.local`:

```bash
cd Frontend
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
```

### 6️⃣ **Frontend - Run em Desenvolvimento**

```bash
cd Frontend

# Desenvolvimento
npm run dev

# Ou build para produção
npm run build
npm run start
```

O frontend estará em `http://localhost:3000`

---

## 🧪 Teste as Funcionalidades

### Teste 1: Modal de Schedule

1. Acesse `http://localhost:3000/dashboard/tests`
2. Procure um teste existente
3. Clique no botão **"Schedule"** (laranja)
4. Configure o intervalo (ex: 5 minutos)
5. Clique em **"Create Schedule"**
6. Verifique se a agenda foi criada (não há confirmação visual yet)

### Teste 2: Refresh na Página de Executions

1. Acesse `http://localhost:3000/dashboard/executions`
2. Clique no botão **"Refresh"** (azul, no header)
3. Verifique se a lista se atualiza

### Teste 3: Analytics

1. Acesse `http://localhost:3000/dashboard/analytics`
2. Explore as 4 abas:
   - **Overview** - Cards com métricas
   - **Executions** - Tabela de logs
   - **Tests** - Gráfico de testes
   - **Trends** - Tendências dos últimos 30 dias

### Teste 4: Logs

1. Acesse `http://localhost:3000/dashboard/logs`
2. Execute um teste (Dashboard → Tests → Run)
3. Volte para Logs
4. Verifique se o log aparece
5. Use os filtros (Status, Data, Busca)

---

## 🔍 Verificação de Dados

### Verificar Tabelas no Supabase

```sql
-- Verificar agendamentos
SELECT * FROM schedules LIMIT 10;

-- Verificar logs
SELECT * FROM execution_logs LIMIT 10;

-- Ver resumo
SELECT * FROM v_execution_summary;

-- Ver testes mais executados
SELECT * FROM v_top_tests;

-- Ver tendência
SELECT * FROM v_execution_trend_30d;
```

### Verificar APIs no Postman/Insomnia

```http
GET http://localhost:5000/api/schedules/list/all
GET http://localhost:5000/api/logs/list/all
GET http://localhost:5000/api/logs/analytics/data
```

---

## ⚠️ Troubleshooting

### Erro: "Test not found" ao criar Schedule

**Causa**: TestId não existe no banco
**Solução**: 
1. Acesse `/dashboard/tests`
2. Copie o ID de um teste existente
3. Use esse ID ao criar schedule

### Erro: "Failed to fetch schedule"

**Causa**: Backend não está rodando ou API URL está errada
**Solução**:
1. Verifique se backend está rodando: `http://localhost:5000/swagger`
2. Verifique `.env.local` no Frontend
3. Verifique CORS no `Program.cs`

### Erro: Tables don't exist

**Causa**: Migrações SQL não foram executadas
**Solução**:
1. Abra `DATABASE_MIGRATION.sql`
2. Execute cada CREATE TABLE manualmente no Supabase SQL Editor
3. Verifique se as tabelas foram criadas

### Modal não fecha após criar Schedule

**Causa**: Erro no request
**Solução**:
1. Abra DevTools (F12)
2. Vá para Network
3. Procure by `POST /api/schedules/create`
4. Verifique se a resposta é 200 OK
5. Se não, veja a mensagem de erro

### Analytics mostra "No data"

**Causa**: Nenhuma execução foi registrada ainda
**Solução**:
1. Execute alguns testes: `/dashboard/tests` → Run
2. Aguarde 5-10 segundos
3. Vá para `/dashboard/analytics`
4. Dados devem aparecer

---

## 📱 Responsive Design

- ✅ Desktop (1920x1080): Fully tested
- ✅ Tablet (768x1024): Tables scrollable
- ✅ Mobile (375x667): Grid adjust to 1 column

Para testar:
1. Abra DevTools (F12)
2. Clique no ícone de device toggle
3. Selecione diferentes dispositivos

---

## 🎯 Próximas Otimizações

### Performance
- [ ] Lazy load DataTable columns
- [ ] Virtual scrolling para grandes datasets
- [ ] Debounce search input
- [ ] Cache images

### Features
- [ ] Export analytics para PDF
- [ ] Scheduled emails com relatórios
- [ ] Webhook integrations
- [ ] Custom alerts

### Security
- [ ] Rate limiting no backend
- [ ] Input sanitization
- [ ] CSRF tokens
- [ ] API key authentication

---

## 📚 Documentação Adicional

- **API Documentation**: Veja `API_DOCUMENTATION.md`
- **Implementation Details**: Veja `IMPLEMENTACAO_COMPLETA.md`
- **Database Schema**: Veja `DATABASE_MIGRATION.sql`

---

## 👨‍💻 Desenvolvimento

### Adicionar Nova Métrica no Analytics

1. Edite `ExecutionLogService.cs` → `GetAnalyticsData()`
2. Adicione lógica para nova métrica
3. Atualize `AnalyticsDataDTO.cs`
4. Atualize frontend `analytics/page.tsx`

### Adicionar Novo Filtro no Logs

1. Edite `logs/page.tsx`
2. Adicione state para novo filtro
3. Atualizar função `filtered`
4. Adicione input de filtro no UI

### Estender Schedule com Notificações

1. Crie nova tabela `schedule_notifications`
2. Implemente `INotificationService`
3. Adicione envio de email/SMS após execução
4. Integre com UI para configurar notificações

---

## 🔐 Segurança em Produção

### Antes de Deploy

- [ ] Mudar URL da API para produção
- [ ] Configurar CORS corretamente
- [ ] Habilitar RLS no Supabase
- [ ] Adicionar autenticação/JWT
- [ ] Usar HTTPS
- [ ] Rate limiting no API Gateway
- [ ] Validação de entrada no backend
- [ ] Logs de auditoria
- [ ] Backup automático do banco

### Exemplo CORS Produção

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowProduction",
        policy =>
        {
            policy
                .WithOrigins("https://seu-dominio.com")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12 → Console)
2. Verifique logs do backend (terminal do `dotnet run`)
3. Verifique Supabase logs
4. Consulte a documentação das APIs
5. Faça um git diff para ver o que mudou

---

## ✨ Conclusão

Parabéns! Você agora tem um sistema completo de:
- ✅ Agendamento de testes
- ✅ Logs detalhados de execução
- ✅ Analytics em tempo real
- ✅ Interface intuitiva para monitoramento

Aproveite! 🚀
