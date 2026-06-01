# API Sentinel - Documentação das Novas APIs

## 🔌 Endpoints Disponíveis

### 1. SCHEDULES API

#### Criar Agendamento
```http
POST /api/schedules/create
Content-Type: application/json

{
  "testId": 1,
  "intervalSeconds": 300,
  "isActive": true,
  "name": "Daily Health Check",
  "description": "Executa cada 5 minutos"
}
```

**Response 200**:
```json
{
  "id": 1,
  "testId": 1,
  "intervalSeconds": 300,
  "isActive": true,
  "name": "Daily Health Check",
  "description": "Executa cada 5 minutos",
  "testName": "API Health",
  "lastExecutedAt": null,
  "nextExecutionAt": "2026-06-01T10:05:00Z",
  "createdAt": "2026-06-01T10:00:00Z",
  "updatedAt": "2026-06-01T10:00:00Z"
}
```

---

#### Listar Todos os Agendamentos
```http
GET /api/schedules/list/all
```

**Response 200**: Array de `ResponseScheduleDTO`

---

#### Listar Agendamentos Ativos
```http
GET /api/schedules/list/active
```

**Response 200**: Array de `ResponseScheduleDTO` com `isActive: true`

---

#### Obter Agendamento por ID
```http
GET /api/schedules/{id}
```

**Response 200**: Um `ResponseScheduleDTO`

---

#### Atualizar Agendamento
```http
PUT /api/schedules/update
Content-Type: application/json

{
  "id": 1,
  "intervalSeconds": 600,
  "isActive": true,
  "name": "Daily Health Check v2",
  "description": "Agora executa cada 10 minutos"
}
```

**Response 200**: `ResponseScheduleDTO` atualizado

---

#### Ativar/Desativar Agendamento
```http
PATCH /api/schedules/{id}/toggle?isActive=false
```

**Response 200**:
```json
{
  "message": "Schedule toggled to False."
}
```

---

#### Deletar Agendamento
```http
DELETE /api/schedules/{id}
```

**Response 200**:
```json
{
  "message": "Schedule deleted successfully."
}
```

---

### 2. EXECUTION LOGS API

#### Criar Log de Execução
```http
POST /api/logs/create
Content-Type: application/json

{
  "executionId": 1,
  "testId": 1,
  "scheduleId": null,
  "status": "success",
  "message": "API respondeu corretamente",
  "responseTime": 234,
  "statusCode": 200,
  "errorDetails": null,
  "testName": "Auth - Login",
  "url": "https://api.example.com/v1/auth/login",
  "method": "POST"
}
```

**Response 200**: `ExecutionLogDTO` criado

---

#### Obter Log por ID
```http
GET /api/logs/{id}
```

**Response 200**: `ExecutionLogDTO`

---

#### Obter Logs de um Teste
```http
GET /api/logs/test/{testId}
```

**Response 200**: Array de `ExecutionLogDTO`

---

#### Obter Logs de um Schedule
```http
GET /api/logs/schedule/{scheduleId}
```

**Response 200**: Array de `ExecutionLogDTO`

---

#### Listar Todos os Logs
```http
GET /api/logs/list/all
```

**Response 200**: Array de `ExecutionLogDTO` (ordenado por data descendente)

---

#### Obter Dados de Analytics
```http
GET /api/logs/analytics/data
```

**Response 200**:
```json
{
  "summary": {
    "totalExecutions": 1250,
    "successfulExecutions": 1100,
    "failedExecutions": 150,
    "processingExecutions": 0,
    "averageResponseTime": 245.5,
    "successRate": 88.0
  },
  "recentExecutions": [ /* Array de 100 logs mais recentes */ ],
  "executionsByStatus": {
    "success": 1100,
    "failed": 150
  },
  "executionsByTest": {
    "Auth - Login": 450,
    "API Health": 300,
    "Database Check": 500
  },
  "executionTrend": [
    {
      "date": "2026-05-02",
      "successCount": 42,
      "failedCount": 5,
      "averageResponseTime": 230.0
    },
    /* ... mais 29 dias */
  ]
}
```

---

#### Obter Logs por Período
```http
GET /api/logs/date-range?startDate=2026-05-01&endDate=2026-06-01
```

**Response 200**: Array de `ExecutionLogDTO`

---

#### Atualizar Status de um Log
```http
PATCH /api/logs/{id}/status?status=success&message=Completed successfully
```

**Response 200**: `ExecutionLogDTO` atualizado

---

#### Deletar Log
```http
DELETE /api/logs/{id}
```

**Response 200**:
```json
{
  "message": "Log deleted successfully."
}
```

---

## 📊 Modelos de Dados

### ScheduleModel
```csharp
public class ScheduleModel
{
    public long Id { get; set; }
    public long TestId { get; set; }
    public int IntervalSeconds { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastExecutedAt { get; set; }
    public DateTime? NextExecutionAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}
```

### ExecutionLogModel
```csharp
public class ExecutionLogModel
{
    public long Id { get; set; }
    public long ExecutionId { get; set; }
    public long TestId { get; set; }
    public long? ScheduleId { get; set; }
    public string Status { get; set; } // "processing", "success", "failed", "timeout"
    public string? Message { get; set; }
    public int? ResponseTime { get; set; }
    public int? StatusCode { get; set; }
    public Dictionary<string, object>? ErrorDetails { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public string? TestName { get; set; }
    public string? Url { get; set; }
    public string? Method { get; set; }
}
```

---

## 🔗 Integração Frontend

### Exemplo: Criar Schedule
```typescript
import { createSchedule } from "@/app/services/schedulesService";
import { useQueryClient } from "@tanstack/react-query";

export default function MyComponent() {
  const queryClient = useQueryClient();

  const handleCreateSchedule = async () => {
    try {
      const schedule = await createSchedule(
        testId: 1,
        intervalSeconds: 300,
        name: "My Schedule"
      );
      
      // Invalida cache para recarregar lista
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      
      console.log("Schedule criado:", schedule);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <button onClick={handleCreateSchedule}>
      Criar Schedule
    </button>
  );
}
```

### Exemplo: Obter Analytics
```typescript
import { getAnalyticsData } from "@/app/services/logsService";
import { useQuery } from "@tanstack/react-query";

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsData,
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Taxa de Sucesso: {analytics?.summary.successRate}%</h1>
      <h2>Total: {analytics?.summary.totalExecutions}</h2>
    </div>
  );
}
```

---

## 🔄 Fluxo de Execution com Logs

1. **Usuário clica em "Run Test"**
   ↓
2. **ExecutionsService.CreateExecution() é chamado**
   ↓
3. **HTTP request é feito para o endpoint**
   ↓
4. **Resposta é recebida e armazenada em `executions` table**
   ↓
5. **ExecutionLogService.CreateLog() registra o log**
   - Status: "success" ou "failed"
   - Response time, status code, erro (se houver)
   ↓
6. **Frontend atualiza via React Query**
   ↓
7. **Logs aparecem em /dashboard/logs**
   ↓
8. **Analytics agrega dados dos logs**

---

## 📈 Analytics Disponíveis

### Summary (Resumo Geral)
- Total de Execuções
- Execuções Bem-Sucedidas
- Execuções Falhadas
- Tempo Médio de Resposta
- Taxa de Sucesso (%)

### By Status
- Contagem de cada status
- "success", "failed", "processing", "timeout"

### By Test
- Qual teste foi mais executado
- Ordenado por quantidade

### Trends (Últimos 30 dias)
- Data
- Sucessos naquele dia
- Falhas naquele dia
- Tempo médio de resposta

---

## 🛡️ Tratamento de Erros

Todos os endpoints retornam erros estruturados:

```json
{
  "error": "Test not found."
}
```

**Status codes**:
- `200` - Sucesso
- `400` - Bad Request (dados inválidos)
- `404` - Not Found (recurso não existe)
- `500` - Server Error

---

## ⚡ Performance

### Índices do Banco de Dados
- `idx_schedules_test_id` - Busca por teste
- `idx_schedules_is_active` - Filtrar ativos
- `idx_execution_logs_test_id` - Logs por teste
- `idx_execution_logs_status` - Filtrar por status
- `idx_execution_logs_created_at` - Ordenação por data
- `idx_execution_logs_test_status_date` - Query complexa

### React Query Caching
- `schedules`: staleTime 1 min
- `logs`: staleTime 2 min
- `analytics`: staleTime 2 min
- Refetch on window focus por padrão

---

## 🔐 Segurança (Recomendações)

1. **Validação de entrada** - Já implementada com DTOs
2. **SQL Injection** - Protegido por Supabase ORM
3. **RLS (Row Level Security)** - Configure no Supabase se necessário
4. **Rate Limiting** - Adicione no API Gateway
5. **CORS** - Já configurado para localhost:3000

---

## 📝 Exemplo de Curl

### Criar Schedule
```bash
curl -X POST http://localhost:5000/api/schedules/create \
  -H "Content-Type: application/json" \
  -d '{
    "testId": 1,
    "intervalSeconds": 300,
    "isActive": true,
    "name": "Health Check"
  }'
```

### Obter Analytics
```bash
curl http://localhost:5000/api/logs/analytics/data
```

### Listar Todos os Logs
```bash
curl http://localhost:5000/api/logs/list/all
```

---

## 🚀 Próximas Features (Sugestões)

1. **Webhook Notifications** - Notificar quando teste falha
2. **Scheduled Execution Worker** - Background job para executar schedules
3. **Export Logs** - CSV/JSON export
4. **Alert Rules** - Regras de alertas customizáveis
5. **Test Comparisons** - Comparar performance entre datas
6. **API History** - Histórico de mudanças nos testes
7. **Email Reports** - Relatórios por email
8. **Slack Integration** - Notificações no Slack

---

**Documentação atualizada em:** Junho 1, 2026
