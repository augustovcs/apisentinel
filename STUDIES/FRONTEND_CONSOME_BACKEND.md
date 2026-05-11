# 🔄 Frontend Consumindo Dados do Backend: Guia Completo

## Do Backend .NET ao Frontend TypeScript

**Nível:** Intermediário a Avançado  
**Tempo de leitura:** ~1 hora  
**Foco:** Entender o fluxo completo de dados

---

## 📑 Índice

1. [Visão Geral do Fluxo](#visão-geral-do-fluxo)
2. [Backend .NET: Expor Dados via API](#backend-net-expor-dados-via-api)
3. [Frontend TypeScript: Consumir API](#frontend-typescript-consumir-api)
4. [Fluxo Completo de Dados](#fluxo-completo-de-dados)
5. [Padrões e Best Practices](#padrões-e-best-practices)
6. [Exemplos do APISentinel](#exemplos-do-apisentinel)

---

## 🎯 Visão Geral do Fluxo

### Arquitetura Cliente-Servidor

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                   INTERNET (HTTP/REST)              │
│                  Request ←→ Response                │
│                                                     │
├──────────────────┬────────────────────────────────┤
│                  │                                 │
│    BACKEND       │            FRONTEND             │
│    (.NET)        │        (TypeScript/React)       │
│                  │                                 │
│  ┌────────────┐  │        ┌──────────────┐         │
│  │ Controller │  │        │   Component  │         │
│  │   (API)    │  │        │   (Client)   │         │
│  └────────────┘  │        └──────────────┘         │
│        ↓ ↑       │              ↓ ↑                │
│  ┌────────────┐  │        ┌──────────────┐         │
│  │  Service   │  │        │   HTTP       │         │
│  │  (Lógica)  │  │        │   Client     │         │
│  └────────────┘  │        └──────────────┘         │
│        ↓ ↑       │              ↓ ↑                │
│  ┌────────────┐  │        ┌──────────────┐         │
│  │  Database  │  │        │    Estado    │         │
│  │  (Dados)   │  │        │  (useState)  │         │
│  └────────────┘  │        └──────────────┘         │
│                  │                                 │
└──────────────────┴────────────────────────────────┘
```

### Fluxo de Dados (Simplificado)

```
Frontend (React)
    ↓
useEffect disparado
    ↓
fetch() ou axios
    ↓
HTTP GET/POST/PUT/DELETE
    ↓
Backend (.NET)
    ↓
Controller recebe requisição
    ↓
Service executa lógica
    ↓
Database retorna dados
    ↓
Controller formata JSON
    ↓
HTTP 200 + Response JSON
    ↓
Frontend recebe response
    ↓
useState atualiza estado
    ↓
Component re-renderiza
    ↓
UI atualizada com novos dados
```

---

## 🔌 Backend .NET: Expor Dados via API

### O que é uma API REST?

**API (Application Programming Interface):** Contrato que define como frontend e backend comunicam

**REST (Representational State Transfer):** Padrão de como estruturar APIs

### Verbos HTTP

```
GET     → Buscar dados (leitura)
POST    → Criar dados novo (escrita)
PUT     → Atualizar dados existente (substituição)
PATCH   → Atualizar parcialmente (modificação)
DELETE  → Deletar dados (remoção)
HEAD    → Como GET, mas sem body
OPTIONS → Descobre métodos disponíveis
```

### Exemplo 1: Controller .NET Simple

```csharp
// 📄 Backend/apisentinel_net/Controllers/TestController.cs

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using apisentinel_net.Models;
using apisentinel_net.Services;

// [ApiController] = Configuração para validação automática
// [Route("api/[controller]")] = Base URL é /api/test
[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly TestService _testService;

    // Injeção de dependência
    public TestController(TestService testService)
    {
        _testService = testService;
    }

    // ========== GET (BUSCAR TODOS) ==========
    /// <summary>
    /// GET /api/test
    /// Busca todos os testes
    /// </summary>
    [HttpGet]  // ← Método HTTP: GET
    public IActionResult GetAllTests()
    {
        try
        {
            // Service faz o trabalho
            var testes = _testService.GetAll();
            
            // Retorna 200 OK + JSON
            return Ok(new
            {
                success = true,
                data = testes,
                message = "Testes recuperados com sucesso"
            });
        }
        catch (Exception ex)
        {
            // Erro → 500 Internal Server Error
            return StatusCode(500, new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    // ========== GET (BUSCAR UM) ==========
    /// <summary>
    /// GET /api/test/123
    /// Busca um teste específico por ID
    /// </summary>
    [HttpGet("{id}")]  // ← {id} = parâmetro dinâmico
    public IActionResult GetTestById(string id)
    {
        try
        {
            // Buscar no service
            var teste = _testService.GetById(id);
            
            // Validar se existe
            if (teste == null)
            {
                return NotFound(new
                {
                    success = false,
                    error = $"Teste com ID {id} não encontrado"
                });
            }

            return Ok(new
            {
                success = true,
                data = teste
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }

    // ========== POST (CRIAR) ==========
    /// <summary>
    /// POST /api/test
    /// Cria um novo teste
    /// Body: JSON com dados do teste
    /// </summary>
    [HttpPost]  // ← Método HTTP: POST
    public IActionResult CreateTest([FromBody] CreateTestRequest request)
    {
        try
        {
            // Validar dados (decorador faz automaticamente)
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }

            // Criar no service
            var novoTeste = _testService.Create(request);

            // Retorna 201 Created + JSON + Location header
            return CreatedAtAction(
                nameof(GetTestById),
                new { id = novoTeste.Id },
                new
                {
                    success = true,
                    data = novoTeste
                }
            );
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }

    // ========== PUT (ATUALIZAR COMPLETO) ==========
    /// <summary>
    /// PUT /api/test/123
    /// Atualiza um teste completo (todos os campos)
    /// </summary>
    [HttpPut("{id}")]
    public IActionResult UpdateTest(string id, [FromBody] UpdateTestRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var testeAtualizado = _testService.Update(id, request);
            
            if (testeAtualizado == null)
            {
                return NotFound(new
                {
                    success = false,
                    error = $"Teste {id} não encontrado"
                });
            }

            return Ok(new
            {
                success = true,
                data = testeAtualizado
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }

    // ========== DELETE ==========
    /// <summary>
    /// DELETE /api/test/123
    /// Deleta um teste
    /// </summary>
    [HttpDelete("{id}")]
    public IActionResult DeleteTest(string id)
    {
        try
        {
            var resultado = _testService.Delete(id);
            
            if (!resultado)
            {
                return NotFound(new
                {
                    success = false,
                    error = $"Teste {id} não encontrado"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Teste deletado com sucesso"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }
}

// ========== REQUEST/RESPONSE MODELS ==========

// Modelo para criar teste (POST body)
public class CreateTestRequest
{
    public string Name { get; set; }
    public string Url { get; set; }
    public string Method { get; set; }  // GET, POST, etc
    public List<Header> Headers { get; set; }
    public string Body { get; set; }
    public int ExpectedStatusCode { get; set; }
    public int MaxResponseTime { get; set; }
}

// Modelo para atualizar teste (PUT body)
public class UpdateTestRequest : CreateTestRequest
{
    // Pode reutilizar CreateTestRequest ou adicionar campos específicos
}

// ========== RESPOSTA PADRÃO ==========

// Sempre retorna em formato similar:
// {
//   "success": true/false,
//   "data": {...},
//   "error": "mensagem de erro (se houver)"
// }
```

### Exemplo 2: Service .NET (Lógica)

```csharp
// 📄 Backend/apisentinel_net/Services/TestService.cs

using apisentinel_net.Models;
using apisentinel_net.DTOs;

namespace apisentinel_net.Services
{
    public class TestService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<TestService> _logger;

        public TestService(IHttpClientFactory httpClientFactory, ILogger<TestService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        // ========== BUSCAR TODOS ==========
        /// <summary>
        /// Busca todos os testes do banco de dados
        /// </summary>
        public List<ApiTest> GetAll()
        {
            _logger.LogInformation("Buscando todos os testes");

            // TODO: Em app real, buscar do banco via Entity Framework
            // var testes = await _context.ApiTests.ToListAsync();
            
            // Por enquanto, retorna dados simulados
            return new List<ApiTest>
            {
                new ApiTest
                {
                    Id = "t1",
                    Name = "Login Test",
                    Url = "https://api.example.com/v1/auth/login",
                    Method = "POST",
                    Headers = new List<Header>
                    {
                        new Header { Key = "Content-Type", Value = "application/json" }
                    },
                    Body = "{\"username\":\"test\",\"password\":\"pass\"}",
                    ExpectedStatusCode = 200,
                    MaxResponseTime = 500,
                    LastStatus = "success",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
                // ... mais testes
            };
        }

        // ========== BUSCAR UM ==========
        public ApiTest GetById(string id)
        {
            _logger.LogInformation($"Buscando teste: {id}");

            var testes = GetAll();
            return testes.FirstOrDefault(t => t.Id == id);
        }

        // ========== CRIAR ==========
        public ApiTest Create(CreateTestRequest request)
        {
            _logger.LogInformation($"Criando novo teste: {request.Name}");

            var novoTeste = new ApiTest
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                Url = request.Url,
                Method = request.Method,
                Headers = request.Headers,
                Body = request.Body,
                ExpectedStatusCode = request.ExpectedStatusCode,
                MaxResponseTime = request.MaxResponseTime,
                LastStatus = null,  // Nunca foi executado
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // TODO: Salvar no banco: _context.ApiTests.Add(novoTeste);

            return novoTeste;
        }

        // ========== ATUALIZAR ==========
        public ApiTest Update(string id, UpdateTestRequest request)
        {
            _logger.LogInformation($"Atualizando teste: {id}");

            var teste = GetById(id);
            if (teste == null) return null;

            teste.Name = request.Name;
            teste.Url = request.Url;
            teste.Method = request.Method;
            teste.Headers = request.Headers;
            teste.Body = request.Body;
            teste.ExpectedStatusCode = request.ExpectedStatusCode;
            teste.MaxResponseTime = request.MaxResponseTime;
            teste.UpdatedAt = DateTime.UtcNow;

            // TODO: Salvar no banco

            return teste;
        }

        // ========== DELETAR ==========
        public bool Delete(string id)
        {
            _logger.LogInformation($"Deletando teste: {id}");

            var teste = GetById(id);
            if (teste == null) return false;

            // TODO: Deletar do banco: _context.ApiTests.Remove(teste);

            return true;
        }

        // ========== EXECUTAR TESTE ==========
        /// <summary>
        /// Executa um teste e retorna resultado
        /// </summary>
        public async Task<Execution> ExecuteTest(string testId)
        {
            _logger.LogInformation($"Executando teste: {testId}");

            var teste = GetById(testId);
            if (teste == null)
                throw new Exception($"Teste {testId} não encontrado");

            var execution = new Execution
            {
                Id = Guid.NewGuid().ToString(),
                TestId = teste.Id,
                TestName = teste.Name,
                Status = "pending",
                ExecutedAt = DateTime.UtcNow
            };

            try
            {
                // Fazer requisição HTTP ao endpoint
                using (var client = _httpClientFactory.CreateClient())
                {
                    var sw = System.Diagnostics.Stopwatch.StartNew();

                    var request = new HttpRequestMessage
                    {
                        Method = new HttpMethod(teste.Method),
                        RequestUri = new Uri(teste.Url),
                        Content = string.IsNullOrEmpty(teste.Body) 
                            ? null 
                            : new StringContent(teste.Body, Encoding.UTF8, "application/json")
                    };

                    // Adicionar headers customizados
                    foreach (var header in teste.Headers ?? new List<Header>())
                    {
                        request.Headers.Add(header.Key, header.Value);
                    }

                    // Enviar requisição
                    var response = await client.SendAsync(request);

                    sw.Stop();

                    // Preencher resultado
                    execution.ResponseTime = (int)sw.ElapsedMilliseconds;
                    execution.StatusCode = (int)response.StatusCode;
                    execution.Error = null;

                    // Validar resultado
                    if ((int)response.StatusCode == teste.ExpectedStatusCode &&
                        execution.ResponseTime <= teste.MaxResponseTime)
                    {
                        execution.Status = "success";
                    }
                    else if (execution.ResponseTime > teste.MaxResponseTime)
                    {
                        execution.Status = "timeout";
                        execution.Error = $"Response time exceeded: {execution.ResponseTime}ms";
                    }
                    else
                    {
                        execution.Status = "failed";
                        execution.Error = $"Unexpected status code: {execution.StatusCode}";
                    }
                }
            }
            catch (Exception ex)
            {
                execution.Status = "failed";
                execution.Error = ex.Message;
            }

            return execution;
        }
    }
}
```

---

## 🎣 Frontend TypeScript: Consumir API

### Padrão 1: fetch() API Nativa

```typescript
// 📄 Frontend/src/lib/api.ts

/**
 * API Client usando fetch nativa (sem dependências)
 * Simples, funciona em qualquer navegador moderno
 */

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number = 30000;  // 30 segundos

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ========== MÉTODO GENÉRICO ==========
  private async request<T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      headers?: Record<string, string>;
      body?: unknown;
      timeout?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout || this.timeout
    );

    try {
      const response = await fetch(url, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // ✅ Parse response
      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: responseData.data || responseData,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: `Request timeout (${options.timeout || this.timeout}ms)`,
          };
        }

        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: "Unknown error",
      };
    }
  }

  // ========== MÉTODOS CONVENIENTES ==========

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PATCH", body });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// ========== INSTÂNCIA GLOBAL ==========

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const api = new ApiClient(API_URL);
```

### Padrão 2: Usando no Componente React

```typescript
// 📄 Frontend/src/components/tests/TestsList.tsx

"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { ApiTest } from "@/lib/types";

interface TestsListProps {
  onSelect?: (test: ApiTest) => void;
}

export default function TestsList({ onSelect }: TestsListProps) {
  // ========== ESTADO ==========
  
  const [tests, setTests] = useState<ApiTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========== EFEITO: BUSCAR DADOS ==========

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1️⃣ Fazer chamada à API
        const response = await api.get<ApiTest[]>("/api/test");

        // 2️⃣ Validar resposta
        if (!response.success) {
          throw new Error(response.error || "Erro ao buscar testes");
        }

        // 3️⃣ Atualizar estado
        setTests(response.data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        console.error("Erro ao buscar testes:", err);
      } finally {
        setLoading(false);
      }
    };

    // Executar função assíncrona
    fetchTests();
  }, []);  // [] = executar apenas uma vez

  // ========== RENDER ==========

  if (loading) {
    return <div className="p-4">Carregando testes...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Erro: {error}</div>;
  }

  if (tests.length === 0) {
    return <div className="p-4 text-gray-600">Nenhum teste encontrado</div>;
  }

  return (
    <div className="space-y-2">
      {tests.map((test) => (
        <div
          key={test.id}
          onClick={() => onSelect?.(test)}
          className="p-4 border rounded cursor-pointer hover:bg-gray-100"
        >
          <h3 className="font-bold">{test.name}</h3>
          <p className="text-sm text-gray-600">{test.method} {test.url}</p>
          <p className={`text-xs font-semibold ${
            test.lastStatus === "success" ? "text-green-600" : "text-red-600"
          }`}>
            {test.lastStatus || "Não executado"}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Padrão 3: Hook Customizado para Requisições

```typescript
// 📄 Frontend/src/lib/hooks.ts

import { useState, useEffect, useCallback } from "react";
import { api } from "./api";

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook customizado para fazer requisições HTTP
 * 
 * Exemplo:
 * const { data, loading, error } = useApi<ApiTest[]>(
 *   () => api.get("/api/test"),
 *   []
 * );
 */
export function useApi<T>(
  fn: () => Promise<ApiResponse<T>>,
  deps: React.DependencyList = [],
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(options.initialData ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fn();
      
      if (!response.success) {
        throw new Error(response.error || "Erro na requisição");
      }
      
      setData(response.data || null);
      options.onSuccess?.(response.data || ({} as T));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fn, options]);

  useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
}

// ========== USO DO HOOK ==========

import { useApi } from "@/lib/hooks";
import { api } from "@/lib/api";
import type { ApiTest } from "@/lib/types";

export default function TestsListWithHook() {
  const { data: tests, loading, error, refetch } = useApi<ApiTest[]>(
    () => api.get("/api/test"),
    [],  // dependências
    {
      onSuccess: (data) => console.log("Testes carregados:", data),
      onError: (error) => console.error("Erro:", error)
    }
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {tests?.map((test) => (
        <div key={test.id}>{test.name}</div>
      ))}
      <button onClick={() => refetch()}>Recarregar</button>
    </div>
  );
}
```

---

## 🔄 Fluxo Completo de Dados

### Exemplo: Criar Novo Teste

#### 1. Frontend: Componente Form

```typescript
// 📄 Frontend/src/components/tests/CreateTestForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { CreateTestInput } from "@/lib/types";

export default function CreateTestForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateTestInput>({
    name: "",
    url: "",
    method: "GET",
    headers: [],
    body: "",
    expectedStatusCode: 200,
    maxResponseTime: 500,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========== SUBMIT ==========

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Fazer POST para backend
      const response = await api.post("/api/test", formData);

      // 2️⃣ Validar resposta
      if (!response.success) {
        throw new Error(response.error || "Erro ao criar teste");
      }

      // 3️⃣ Sucesso - navegar para testes
      alert("Teste criado com sucesso!");
      router.push("/tests");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Nome do Teste</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
      </div>

      <div>
        <label>URL</label>
        <input
          type="text"
          value={formData.url}
          onChange={(e) =>
            setFormData({ ...formData, url: e.target.value })
          }
        />
      </div>

      <div>
        <label>Método HTTP</label>
        <select
          value={formData.method}
          onChange={(e) =>
            setFormData({ ...formData, method: e.target.value as any })
          }
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Criando..." : "Criar Teste"}
      </button>
    </form>
  );
}
```

#### 2. Backend .NET: Receber e Processar

```csharp
// O Controller já mostrado recebe:
[HttpPost]
public IActionResult CreateTest([FromBody] CreateTestRequest request)
{
    // [FromBody] = Parse automaticamente o JSON recebido

    // ValidateRequest
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    // Executar lógica
    var novoTeste = _testService.Create(request);

    // Retornar resposta
    return CreatedAtAction(nameof(GetTestById), 
        new { id = novoTeste.Id },
        new { success = true, data = novoTeste }
    );
}
```

#### 3. Fluxo Visual Completo

```
FRONTEND                          BACKEND
──────────────────────────────────────────────────────

User preenche form
    ↓
User clica "Criar"
    ↓
handleSubmit disparado
    ↓
Validação local (opcional)
    ↓
api.post("/api/test", formData)
    ↓
fetch() envia HTTP POST
       ────────────────────────→ HTTP POST /api/test
                                  ├─ Headers
                                  └─ Body (JSON)
                                     ↓
                                 Controller recebe
                                  ├─ Parse JSON
                                  ├─ Validar (ModelState)
                                     ↓
                                 Service executa
                                  ├─ Criar ID
                                  ├─ Preencher dados
                                  ├─ Salvar em DB
                                     ↓
                                 Retornar resposta
                                  ├─ Status Code 201
                                  └─ Body JSON
       ←──────────────────────── HTTP 201 Created
    ↓
response.json() parse
    ↓
Validar success
    ↓
setState atualiza UI
    ↓
Router navega
    ↓
User vê mensagem de sucesso
```

---

## 💡 Padrões e Best Practices

### 1. Sempre Validar Resposta

```typescript
// ❌ ERRADO - confia na resposta
const response = await fetch("/api/test");
const data = await response.json();
console.log(data.data);  // Pode falhar!

// ✅ CORRETO - valida antes de usar
const response = await api.get("/api/test");
if (!response.success) {
  console.error(response.error);
  return;
}
console.log(response.data);  // Seguro!
```

### 2. Separar Camadas

```typescript
// ❌ ERRADO - lógica de API no componente
export default function Component() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch("/api/test")
      .then(r => r.json())
      .then(d => setData(d.data));
  }, []);
}

// ✅ CORRETO - usar hook customizado
export default function Component() {
  const { data } = useApi(() => api.get("/api/test"), []);
}
```

### 3. Tratamento de Erros

```typescript
// ✅ BOM - múltiplos níveis de tratamento
try {
  const response = await api.get<ApiTest[]>("/api/test");
  
  if (!response.success) {
    throw new Error(response.error);
  }
  
  if (!response.data || response.data.length === 0) {
    setError("Nenhum teste encontrado");
    return;
  }
  
  setTests(response.data);
} catch (err) {
  const message = err instanceof Error ? err.message : "Erro desconhecido";
  setError(message);
} finally {
  setLoading(false);
}
```

### 4. Cancelamento de Requisições

```typescript
// ✅ Usar AbortController para cancelar requisição
export function useApi<T>(
  fn: () => Promise<ApiResponse<T>>,
  deps: React.DependencyList
): UseApiReturn<T> {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    
    fetchData();
    
    return () => {
      // Cancelar requisição ao desmontar componente
      abortControllerRef.current?.abort();
    };
  }, deps);

  return { data, loading, error, refetch };
}
```

### 5. Caching de Dados

```typescript
// ✅ Cache simples em memória
class ApiClientWithCache extends ApiClient {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTime = 5 * 60 * 1000;  // 5 minutos

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const cached = this.cache.get(endpoint);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTime) {
      return { success: true, data: cached.data };
    }

    const response = await super.get<T>(endpoint);
    
    if (response.success && response.data) {
      this.cache.set(endpoint, { data: response.data, timestamp: Date.now() });
    }

    return response;
  }
}
```

---

## 📊 Exemplos do APISentinel

### Backend .NET: Executar Teste

```csharp
// POST /api/test/123/execute

[HttpPost("{id}/execute")]
public async Task<IActionResult> ExecuteTest(string id)
{
    try
    {
        // Service executa o teste (chamadas HTTP, etc)
        var execution = await _testService.ExecuteTest(id);

        return Ok(new
        {
            success = true,
            data = execution
        });
    }
    catch (Exception ex)
    {
        return BadRequest(new
        {
            success = false,
            error = ex.Message
        });
    }
}
```

### Frontend TypeScript: Executar Teste

```typescript
// 📄 Frontend/src/components/tests/TestDetail.tsx

export default function TestDetail({ testId }: { testId: string }) {
  const [executing, setExecuting] = useState(false);
  const [execution, setExecution] = useState<Execution | null>(null);

  const handleExecute = async () => {
    try {
      setExecuting(true);

      // Fazer POST para executar
      const response = await api.post<Execution>(
        `/api/test/${testId}/execute`,
        {}  // Sem body
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      // Atualizar resultado
      setExecution(response.data || null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao executar");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleExecute} 
        disabled={executing}
      >
        {executing ? "Executando..." : "Executar Teste"}
      </button>

      {execution && (
        <div>
          <p>Status: {execution.status}</p>
          <p>Response Time: {execution.responseTime}ms</p>
          <p>Status Code: {execution.statusCode}</p>
          {execution.error && <p>Erro: {execution.error}</p>}
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Resumo Visual

```
┌─────────────────────────────────────────────────────────┐
│                    FLUXO COMPLETO                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FRONTEND (TypeScript/React)                           │
│  ├─ Component (JSX)                                    │
│  ├─ useEffect (disparar requisição)                    │
│  ├─ useState (gerenciar estado)                        │
│  ├─ fetch/api.get() (fazer requisição)                │
│  └─ UI (renderizar resposta)                           │
│                                                         │
│              ↓ HTTP REQUEST ↑                          │
│                                                         │
│  BACKEND (.NET)                                        │
│  ├─ Controller (receber requisição)                    │
│  ├─ Service (executar lógica)                          │
│  ├─ Database (buscar/salvar dados)                     │
│  ├─ Response (formatar JSON)                           │
│  └─ HTTP STATUS + BODY                                 │
│                                                         │
│              ↓ HTTP RESPONSE ↑                         │
│                                                         │
│  FRONTEND (TypeScript/React)                           │
│  ├─ response.json() (parse)                            │
│  ├─ setState (atualizar estado)                        │
│  ├─ Component re-renderiza                             │
│  └─ UI atualizada com novos dados                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Checklist de Implementação

- [ ] Backend expõe API REST com Controllers
- [ ] API segue padrão Request/Response consistente
- [ ] API retorna HTTP status codes corretos (200, 201, 400, 404, 500)
- [ ] Frontend cria API client (fetch wrapper)
- [ ] Frontend usa hooks para requisições
- [ ] Frontend trata erros em múltiplos níveis
- [ ] Frontend mostra estados (loading, error, empty)
- [ ] Dados são tipados em ambos os lados
- [ ] Backend valida dados recebidos
- [ ] Frontend valida resposta do backend

---

**Parabéns! Agora você entende completamente como frontend e backend se comunicam!** 🎉
