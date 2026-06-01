# 5 GitHub Issues para C# .NET Learning

Cole o conteúdo de cada seção como uma issue no GitHub (Issues tab → New Issue)

---

## Issue #1: TASK 1 - Create PageModel for Page Management

**Title:** Create PageModel for page management

**Description:**

### 🎯 Objetivo
Criar um novo modelo chamado **`PageModel`** no backend para gerenciar páginas customizáveis do dashboard, igual aos modelos existentes (Schedule, ExecutionLog).

### 📋 O que você precisa fazer

1. **Criar arquivo**: `Backend/apisentinel_net/Models/PageModel.cs`

2. **Implementar a classe com as seguintes propriedades**:
   - `long Id` - identificador único (PRIMARY KEY)
   - `string Name` - nome da página (ex: "Dashboard Home")
   - `string Description` - descrição (nullable)
   - `string Slug` - URL slug único (ex: "dashboard-home")
   - `string Content` - conteúdo HTML/JSON (nullable)
   - `int Order` - ordem de exibição (para ordenação)
   - `bool IsActive` - ativo/inativo
   - `DateTime CreatedAt` - quando foi criado
   - `DateTime UpdatedAt` - última atualização
   - `long? CreatedByUserId` - usuário que criou (nullable)

3. **Adicionar validações**:
   - `Name` é obrigatório (mín. 3 caracteres, máx. 100)
   - `Slug` é obrigatório e único
   - `Order` deve ser >= 0

### ✅ Critérios de Aceitação
- [ ] Arquivo criado com todas as propriedades
- [ ] Annotations de validação adicionadas (atributos)
- [ ] Compila sem erros
- [ ] Commit feito com mensagem descritiva

### 💡 Dicas
- Veja `Models/ScheduleModel.cs` como referência
- Use `[Required]`, `[StringLength()]`, `[Range()]` para validações
- Use `[Key]` para marcar o ID como chave primária

**Labels:** `good first issue`, `backend`, `csharp`, `learning`
**Assignee:** Seu amigo que está aprendendo
**Difficulty:** Easy (1-2 horas)

---

## Issue #2: TASK 2 - Create PageDTO with Request and Response classes

**Title:** Create PageDTO with request and response classes

**Description:**

### 🎯 Objetivo
Criar um **DTO (Data Transfer Object)** para transferir dados de páginas entre frontend e backend, com classes para request e response.

### 📋 O que você precisa fazer

1. **Criar arquivo**: `Backend/apisentinel_net/DTOs/PageDTO.cs`

2. **Implementar 3 classes**:

   **A. `PageDTO`** - Para retornar dados da página
   ```csharp
   public class PageDTO
   {
       public long Id { get; set; }
       public string Name { get; set; }
       // ... outras propriedades
   }
   ```

   **B. `CreatePageRequestDTO`** - Para criar nova página
   ```csharp
   public class CreatePageRequestDTO
   {
       public string Name { get; set; }
       // ... inclua os campos necessários, EXCETO Id, CreatedAt, UpdatedAt
   }
   ```

   **C. `UpdatePageRequestDTO`** - Para atualizar página
   ```csharp
   public class UpdatePageRequestDTO
   {
       public long Id { get; set; }
       // ... campos que podem ser atualizados
   }
   ```

3. **Adicionar validações** no DTO:
   - `[Required]` em campos obrigatórios
   - `[StringLength(100)]` em Name
   - `[MinLength(3)]` em Name

### ✅ Critérios de Aceitação
- [ ] 3 classes criadas (PageDTO, CreatePageRequestDTO, UpdatePageRequestDTO)
- [ ] Validações adicionadas com atributos
- [ ] Compila sem erros
- [ ] Commit feito

### 💡 Dicas
- DTOs **não incluem** timestamps ou IDs auto-gerados em requests
- DTOs são usados para **validação** e **segurança**
- Veja `DTOs/ScheduleDTO.cs` como exemplo

**Labels:** `good first issue`, `backend`, `csharp`, `learning`
**Assignee:** Seu amigo
**Difficulty:** Easy-Medium (1-2 horas)

---

## Issue #3: TASK 3 - Implement IPageService Interface

**Title:** Implement IPageService interface with 8 methods

**Description:**

### 🎯 Objetivo
Criar a **interface (contrato)** do serviço que gerencia páginas, definindo quais métodos serão implementados.

### 📋 O que você precisa fazer

1. **Criar arquivo**: `Backend/apisentinel_net/Interface/IPageService.cs`

2. **Definir 8 métodos** (como interface, não implementação):
   - `GetPageByIdAsync(long id)` → retorna `Task<PageDTO>`
   - `GetPageBySlugAsync(string slug)` → retorna `Task<PageDTO>`
   - `GetAllPagesAsync()` → retorna `Task<List<PageDTO>>`
   - `GetActivePagesAsync()` → retorna `Task<List<PageDTO>>`
   - `CreatePageAsync(CreatePageRequestDTO request)` → retorna `Task<PageDTO>`
   - `UpdatePageAsync(UpdatePageRequestDTO request)` → retorna `Task<PageDTO>`
   - `DeletePageAsync(long id)` → retorna `Task<bool>`
   - `TogglePageStatusAsync(long id, bool isActive)` → retorna `Task<bool>`

### ✅ Critérios de Aceitação
- [ ] Interface criada com 8 métodos
- [ ] Métodos usam async/await pattern
- [ ] Nomes descritivos (terminam em -Async)
- [ ] Retornos tipados corretamente
- [ ] Compila sem erros
- [ ] Commit feito

### 💡 Dicas
- Uma **interface** é um **contrato** que outras classes assinam
- Use **async/await** para operações de banco de dados
- Termine nomes de métodos async com **Async**
- Veja `Interface/IScheduleService.cs` como referência

**Labels:** `good first issue`, `backend`, `csharp`, `learning`
**Assignee:** Seu amigo
**Difficulty:** Medium (2-3 horas)

---

## Issue #4: TASK 4 - Implement PageService with Supabase Integration

**Title:** Implement PageService with Supabase CRUD operations

**Description:**

### 🎯 Objetivo
Implementar a **classe PageService** que contém a lógica de negócio para CRUD de páginas usando Supabase como banco de dados.

### 📋 O que você precisa fazer

1. **Criar arquivo**: `Backend/apisentinel_net/Services/APISENTINEL-DEV/PageService.cs`

2. **Implementar a classe que herda de IPageService**:
   ```csharp
   public class PageService : IPageService
   {
       private readonly Supabase.Client _client;
       
       public PageService(Supabase.Client client)
       {
           _client = client;
       }
       
       public async Task<PageDTO> GetPageByIdAsync(long id)
       {
           // Implementação aqui
       }
       // ... mais métodos
   }
   ```

3. **Para cada método, você precisa**:
   - Fazer query no Supabase
   - Mapear dados do banco para DTO
   - Tratar erros com try-catch
   - Retornar dados tipados

4. **Exemplo de implementação (GetPageByIdAsync)**:
```csharp
public async Task<PageDTO> GetPageByIdAsync(long id)
{
    try
    {
        var response = await _client
            .From("pages")
            .Where(x => x.Id == id)
            .Single();
        
        return new PageDTO
        {
            Id = response.Id,
            Name = response.Name,
            // ... mapear outras propriedades
        };
    }
    catch (Exception ex)
    {
        // Logar erro
        throw new Exception($"Error fetching page: {ex.Message}");
    }
}
```

5. **Implementar os 8 métodos** com query ao banco

### ✅ Critérios de Aceitação
- [ ] Classe criada e implementa IPageService
- [ ] 8 métodos implementados com queries ao Supabase
- [ ] Supabase client é injetado via construtor
- [ ] Tratamento de erros com try-catch
- [ ] Dados são mapeados para DTOs
- [ ] Compila e roda sem erros
- [ ] Commit feito

### 💡 Dicas
- Use **injection constructor** para receber Supabase.Client
- Supabase queries usam `.From("table_name")`
- Use `.Where()` para filtrar dados
- `.Single()` traz um resultado, `.Get()` traz lista
- Sempre use `async/await` para operações I/O
- Veja `Services/ScheduleService.cs` como referência completa

### 📚 Conceitos a aprender
- Dependency Injection pattern
- Async/await com banco de dados
- Query builders
- Mapeamento de dados (Mapping)
- Error handling em services
- LINQ queries

**Labels:** `backend`, `csharp`, `learning`, `supabase`
**Assignee:** Seu amigo
**Difficulty:** Advanced (3-4 horas)

---

## Issue #5: TASK 5 - Create PageController with REST API Endpoints

**Title:** Create PageController with CRUD REST endpoints

**Description:**

### 🎯 Objetivo
Criar o **controller** que expõe os endpoints HTTP da API para páginas, permitindo CRUD via HTTP requests.

### 📋 O que você precisa fazer

1. **Criar arquivo**: `Backend/apisentinel_net/Controllers/PageController.cs`

2. **Implementar endpoints** (como métodos HTTP):
   - `[HttpGet("list/all")]` - GET `/api/pages/list/all` → listar todas
   - `[HttpGet("list/active")]` - GET `/api/pages/list/active` → listar ativas
   - `[HttpGet("{id}")]` - GET `/api/pages/{id}` → obter por ID
   - `[HttpGet("slug/{slug}")]` - GET `/api/pages/slug/{slug}` → obter por slug
   - `[HttpPost("create")]` - POST `/api/pages/create` → criar nova
   - `[HttpPut("update")]` - PUT `/api/pages/update` → atualizar
   - `[HttpDelete("{id}")]` - DELETE `/api/pages/{id}` → deletar
   - `[HttpPatch("{id}/toggle")]` - PATCH `/api/pages/{id}/toggle` → ativar/desativar

3. **Estrutura do Controller**:
```csharp
[ApiController]
[Route("api/[controller]")]
public class PageController : ControllerBase
{
    private readonly IPageService _pageService;
    
    public PageController(IPageService pageService)
    {
        _pageService = pageService;
    }
    
    [HttpGet("list/all")]
    public async Task<ActionResult<List<PageDTO>>> GetAllPages()
    {
        try
        {
            var pages = await _pageService.GetAllPagesAsync();
            return Ok(pages);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    
    // ... mais endpoints
}
```

4. **Para cada endpoint**:
   - Use o atributo correto `[HttpGet]`, `[HttpPost]`, etc.
   - Receba dados via body ou rota
   - Chame o método do service
   - Retorne `Ok()` (200) em sucesso
   - Retorne `BadRequest()` (400) em erro
   - Adicione tratamento de exceções

### ✅ Critérios de Aceitação
- [ ] Controller criado com 8 endpoints
- [ ] Endpoints mapeados corretamente (GET, POST, PUT, DELETE, PATCH)
- [ ] Routes estão claras e consistentes
- [ ] IPageService é injetado via construtor
- [ ] Todos retornam respostas tipadas
- [ ] Tratamento de erros implementado
- [ ] Compila e testa via Postman/Insomnia
- [ ] Commit feito

### 💡 Dicas
- Use `[ApiController]` no topo da classe
- `[Route("api/[controller]")]` mapeia automaticamente para `/api/Page`
- `StatusCode` corretos: `200 Ok`, `201 Created`, `400 BadRequest`, `404 NotFound`
- Sempre retorne `ActionResult<T>` para flexibilidade
- Veja `Controllers/ScheduleController.cs` como exemplo

### 🧪 Teste seus endpoints
```bash
# Listar páginas
curl http://localhost:5000/api/page/list/all

# Criar página
curl -X POST http://localhost:5000/api/page/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Home","slug":"home"}'

# Obter por ID
curl http://localhost:5000/api/page/1

# Atualizar
curl -X PUT http://localhost:5000/api/page/update \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Home Updated"}'

# Deletar
curl -X DELETE http://localhost:5000/api/page/1
```

### 📚 Conceitos a aprender
- ASP.NET Core controllers
- Atributos HTTP (Get, Post, Put, Delete, Patch)
- Dependency Injection em controllers
- Async action methods
- Status codes HTTP
- Validação e error handling
- RESTful API design

**Labels:** `backend`, `csharp`, `learning`, `api`
**Assignee:** Seu amigo
**Difficulty:** Advanced (3-4 horas)

---

## Como Criar as Issues no GitHub

1. Vá para: https://github.com/augustovcs/apisentinel/issues
2. Clique em "New Issue"
3. Cole o **Title** e **Description** de cada issue
4. Adicione as **Labels** listadas
5. Assigne para seu amigo
6. Clique em "Submit new issue"

---

## Ordem Recomendada

1. **Issue #1** (Model) - Base para tudo
2. **Issue #2** (DTO) - Validação e transferência
3. **Issue #3** (Interface) - Define o contrato
4. **Issue #4** (Service) - Lógica de negócio
5. **Issue #5** (Controller) - Expõe a API

Cada issue **depende da anterior**, então não pule passos!

---

**Total estimado**: 10-15 horas de aprendizado
**Nível**: Progressivo (Easy → Medium → Advanced)
