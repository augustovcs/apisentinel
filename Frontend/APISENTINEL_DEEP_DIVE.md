# 🏗️ Deep Dive: Análise Completa do Projeto APISentinel

## Decodificando Cada Arquivo e Padrão do Projeto Real

**Nível:** Avançado  
**Duração estimada:** 1-2 horas  
**Foco:** Entender como tudo funciona junto

---

## 📑 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Análise de types.ts - O Contrato de Dados](#análise-de-typests---o-contrato-de-dados)
3. [Análise de mock-data.ts - Dados Simulados](#análise-de-mock-datats---dados-simulados)
4. [Análise de Components UI - Componentes Reutilizáveis](#análise-de-components-ui)
5. [Análise do Layout System](#análise-do-layout-system)
6. [Análise de Páginas](#análise-de-páginas)
7. [Fluxos de Dados Completos](#fluxos-de-dados-completos)
8. [Padrões TypeScript Utilizados](#padrões-typescript-utilizados)
9. [Como Estender o Projeto](#como-estender-o-projeto)

---

## 🎯 Visão Geral da Arquitetura

### Estrutura em Pirâmide

```
┌─────────────────────────────┐
│    Páginas (Routes)         │  Níveis mais altos
│  /tests, /dashboard, etc.   │
├─────────────────────────────┤
│    Componentes de Página    │  *Client.tsx
│  DashboardClient, etc.      │
├─────────────────────────────┤
│    Componentes UI           │  Reutilizáveis
│  DataTable, Button, etc.    │
├─────────────────────────────┤
│    Tipos e Interfaces       │  Contrato de dados
│  ApiTest, Execution, etc.   │
├─────────────────────────────┤
│    Dados e Utilitários      │  Camada de dados
│  mock-data.ts, etc.         │  Níveis mais baixos
└─────────────────────────────┘
```

### Fluxo de Dados

```
API Backend (simulada)
        ↓
    mock-data.ts (dados)
        ↓
    types.ts (tipos)
        ↓
    Components (renders)
        ↓
    Navegador (UI visual)
```

### Stack Tecnológico

```
Next.js 16.2.3 (framework)
    ├── React 19.2.4 (library UI)
    ├── TypeScript 5 (tipagem)
    └── Tailwind CSS 4 (estilos)

Compilação:
TypeScript → JavaScript → Bundle → Navegador
```

---

## 🔍 Análise de types.ts - O Contrato de Dados

### Arquivo Completo Comentado

```typescript
// 📄 src/lib/types.ts

// ========== 1. TIPOS PRIMITIVOS (ESPECIALIZAÇÃO) ==========

/**
 * HttpMethod: Union type de métodos HTTP válidos
 * 
 * Por que não usar 'string'?
 * ✅ Evita erros: impossível usar "INVALID_METHOD"
 * ✅ Autocompletar: IDE oferece os 7 métodos
 * ✅ Documentação: claro que são métodos HTTP
 */
export type HttpMethod = 
  | "GET"      // Buscar recursos
  | "POST"     // Criar recursos
  | "PUT"      // Substituir recursos
  | "PATCH"    // Atualizar parcialmente
  | "DELETE"   // Deletar recursos
  | "HEAD"     // Como GET, mas sem body
  | "OPTIONS"; // Descobrir métodos disponíveis

/**
 * ExecutionStatus: Possíveis estados de uma execução
 * 
 * Estados do workflow:
 * pending  → sucesso/falha/timeout
 * success  → ✅ Teste passou
 * failed   → ❌ Teste falhou
 * timeout  → ⏱️ Timeout excedido
 */
export type ExecutionStatus = 
  | "success"  // HTTP correto + resposta rápida
  | "failed"   // HTTP incorreto ou falha
  | "timeout"  // Excedeu maxResponseTime
  | "pending"; // Ainda executando

// ========== 2. INTERFACES DE ESTRUTURA ==========

/**
 * Header: Cabeçalho HTTP (key-value)
 * 
 * Exemplo:
 * { key: "Content-Type", value: "application/json" }
 * { key: "Authorization", value: "Bearer token_aqui" }
 * 
 * Por que interface ao invés de type?
 * - Simples (apenas 2 propriedades)
 * - Será estendida? Não
 * - Interface é convenção para objetos
 */
export interface Header {
  key: string;      // Nome do header: "Content-Type"
  value: string;    // Valor: "application/json"
}

/**
 * ApiTest: Definição de um teste de API
 * 
 * Representa o "formulário" que o usuário preenche
 * Exemplo de teste:
 * {
 *   id: "t1",
 *   name: "Login Endpoint",
 *   url: "https://api.example.com/v1/auth/login",
 *   method: "POST",
 *   headers: [{ key: "Content-Type", value: "application/json" }],
 *   body: '{"username":"test","password":"secret"}',
 *   expectedStatusCode: 200,
 *   maxResponseTime: 500,
 *   lastStatus: "success",
 *   createdAt: "2026-04-10T08:00:00Z",
 *   updatedAt: "2026-04-14T09:00:00Z"
 * }
 */
export interface ApiTest {
  id: string;                    // ID único (ex: "t1", "t2")
  name: string;                  // Nome legível (ex: "Login Endpoint")
  url: string;                   // URL endpoint (ex: "https://...")
  method: HttpMethod;            // GET, POST, etc. (tipado!)
  headers: Header[];             // Headers customizados (array)
  body: string;                  // JSON body (stringify)
  expectedStatusCode: number;    // Qual status code esperado? (200, 201, 404, etc)
  maxResponseTime: number;       // Limite em ms (timeout)
  lastStatus: ExecutionStatus | null;  // Último resultado (ou null se nunca executado)
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp (última atualização)
}

/**
 * Execution: Resultado de uma execução de teste
 * 
 * Quando user clica "executar" em um ApiTest,
 * um Execution é criado com os resultados
 * 
 * Exemplo:
 * {
 *   id: "ex1",
 *   testId: "t1",
 *   testName: "Login Endpoint",
 *   status: "success",
 *   responseTime: 234,
 *   statusCode: 200,
 *   error: null,
 *   executedAt: "2026-04-14T14:30:00Z"
 * }
 */
export interface Execution {
  id: string;                       // ID único da execução
  testId: string;                   // Qual teste foi executado?
  testName: string;                 // Nome do teste (cache/denormalização)
  status: ExecutionStatus;          // Resultado: success/failed/timeout/pending
  responseTime: number;             // Quanto tempo levou (ms)
  statusCode: number | null;        // HTTP response code (pode ser null se erro)
  error: string | null;             // Mensagem de erro (se houver)
  executedAt: string;               // ISO timestamp quando foi executado
}

/**
 * DashboardStats: Estatísticas agregadas para o dashboard
 * 
 * Exemplo:
 * {
 *   totalTests: 42,
 *   successRate: 95.2,
 *   failedLast24h: 2,
 *   avgResponseTime: 187
 * }
 */
export interface DashboardStats {
  totalTests: number;      // Quantos testes foram criados?
  successRate: number;     // Percentual de sucessos (0-100)
  failedLast24h: number;   // Quantos falharam nas últimas 24h?
  avgResponseTime: number; // Tempo médio de resposta (ms)
}

// ========== 3. TIPOS DERIVADOS (Não exportados) ==========

/**
 * Tipos que você pode criar para casos específicos:
 */

// Teste sem ID (para criar novo)
export type CreateTestInput = Omit<ApiTest, "id" | "createdAt" | "updatedAt" | "lastStatus">;

// Teste parcial (para atualizar alguns campos)
export type UpdateTestInput = Partial<Omit<ApiTest, "id" | "createdAt">>;

// Resposta de API (genérica)
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Padrão de Tipos Observado

```typescript
// 1️⃣ ESPECIALIZAÇÕES (tipos primitivos restritos)
type ExecutionStatus = "success" | "failed" | ...

// 2️⃣ ESTRUTURAS (interfaces de dados)
interface ApiTest { ... }
interface Execution { ... }

// 3️⃣ COMPOSIÇÃO (reutilização via union/intersection)
type ApiResponse<T> = { success: boolean; data?: T }

// Resultado: 
// - Código mais seguro
// - Menos bugs
// - Documentação integrada
```

---

## 📊 Análise de mock-data.ts - Dados Simulados

### Estrutura e Padrões

```typescript
// 📄 src/lib/mock-data.ts

import type { ApiTest, Execution, DashboardStats } from "./types";

/**
 * Mock vs Real Data
 * 
 * MOCK DATA (desenvolvimento):
 * ✅ Rápido (sem requisições HTTP)
 * ✅ Previsível (mesmos dados sempre)
 * ✅ Não precisa backend
 * ❌ Dados fictícios
 * 
 * REAL DATA (produção):
 * ✅ Dados reais
 * ❌ Mais lento
 * ❌ Depende de backend estar up
 */

// ========== 1. DADOS DE TESTE ==========

/**
 * mockTests: Array de testes simulados
 * 
 * Tipado como ApiTest[] - garante que cada item
 * tem exatamente as propriedades de ApiTest
 */
export const mockTests: ApiTest[] = [
  {
    id: "t1",
    name: "Auth - Login Endpoint",
    url: "https://api.example.com/v1/auth/login",
    method: "POST",  // TypeScript garante ser um dos 7 valores válidos
    headers: [
      { key: "Content-Type", value: "application/json" }
    ],
    body: '{"username": "test@example.com", "password": "secret"}',
    expectedStatusCode: 200,
    maxResponseTime: 500,
    lastStatus: "success",  // ou null se nunca executado
    createdAt: "2026-04-10T08:00:00Z",
    updatedAt: "2026-04-14T09:00:00Z",
  },
  {
    id: "t2",
    name: "Users - List All",
    url: "https://api.example.com/v1/users",
    method: "GET",  // Sem body em GET
    headers: [
      { key: "Authorization", value: "Bearer {{token}}" }
    ],
    body: "",  // Vazio para GET
    expectedStatusCode: 200,
    maxResponseTime: 300,
    lastStatus: "success",
    createdAt: "2026-04-10T08:10:00Z",
    updatedAt: "2026-04-14T09:05:00Z",
  },
  // ... mais testes
];

// ========== 2. DADOS DE EXECUÇÃO ==========

/**
 * mockExecutions: Histórico de execuções de testes
 * 
 * Cada execução referencia um teste via testId
 * Denormaliza testName para facilitar display
 */
export const mockExecutions: Execution[] = [
  {
    id: "ex1",
    testId: "t1",          // Referência ao teste
    testName: "Auth - Login Endpoint",
    status: "success",     // ✅ Passou
    responseTime: 234,     // 234ms
    statusCode: 200,       // HTTP 200 OK
    error: null,           // Sem erros
    executedAt: "2026-04-14T14:30:00Z",
  },
  {
    id: "ex2",
    testId: "t3",
    testName: "Orders - Create Order",
    status: "failed",      // ❌ Falhou
    responseTime: 156,
    statusCode: 400,       // HTTP 400 Bad Request (inesperado)
    error: "Unexpected status code: 400, expected: 201",
    executedAt: "2026-04-14T14:28:00Z",
  },
  {
    id: "ex3",
    testId: "t4",
    testName: "Products - Get by ID",
    status: "timeout",     // ⏱️ Timeout
    responseTime: 800,     // Excedeu limite (maxResponseTime: 200)
    statusCode: null,      // Não obteve resposta
    error: "Request timeout after 800ms",
    executedAt: "2026-04-14T14:25:00Z",
  },
];

// ========== 3. DADOS AGREGADOS (Dashboard) ==========

/**
 * mockStats: Estatísticas agregadas
 * 
 * Normalmente calculadas do servidor
 * (sum, average, count queries)
 */
export const mockStats: DashboardStats = {
  totalTests: 6,         // 6 testes criados
  successRate: 85.0,     // 85% de sucesso geral
  failedLast24h: 2,      // 2 falharam nas últimas 24h
  avgResponseTime: 187,  // Tempo médio: 187ms
};
```

### Padrão de Denormalização

```typescript
// ❌ NORMALIZADO (requer JOINs)
const mockTests: ApiTest[] = [
  { id: "t1", name: "Login", ... }
];

const mockExecutions: Execution[] = [
  { id: "ex1", testId: "t1", ... }
  // Nota: sem testName, precisa buscar em mockTests
];

// ✅ DENORMALIZADO (mais rápido)
const mockExecutions: Execution[] = [
  { 
    id: "ex1", 
    testId: "t1",
    testName: "Login",  // ← Cópia para evitar JOIN
    ...
  }
];

// Benefício: componente pode renderizar sem dados separados
// Custo: redundância de dados
// Padrão comum em APIs REST
```

---

## 🎨 Análise de Components UI

### Button Component - Exemplo de Componentização

```typescript
// 📄 src/components/ui/Button.tsx

"use client";  // ← Necessário: usa event listeners

import React from "react";

/**
 * ButtonProps: Contrato do componente
 * 
 * Estende HTMLButtonElement para incluir
 * propriedades HTML nativas (disabled, type, etc)
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  children: React.ReactNode;
}

/**
 * VARIANT_STYLES: Record<string, CSSProperties>
 * 
 * O tipo Record permite:
 * ✅ Validação: só as 4 variantes são válidas
 * ✅ Exaustividade: linter avisa se faltar uma
 * ✅ Type-safe: TypeScript sabe a estrutura
 */
const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: "#0B3D2E",  // Verde escuro
    color: "#ffffff",
    border: "1px solid #0B3D2E",
  },
  secondary: {
    backgroundColor: "#ffffff",
    color: "#1C1C1C",
    border: "1px solid #D1D5DB",
  },
  danger: {
    backgroundColor: "#DC2626",  // Vermelho
    color: "#ffffff",
    border: "1px solid #DC2626",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#6B7280",
    border: "1px solid transparent",
  },
};

/**
 * HOVER_STYLES: Estilos ao passar mouse
 * 
 * Partial<CSSProperties> = nem todas as props
 * Permite transições suaves
 */
const HOVER_STYLES: Record<string, Partial<React.CSSProperties>> = {
  primary: { backgroundColor: "#145A32", borderColor: "#145A32" },
  secondary: { backgroundColor: "#F9FAFB", borderColor: "#9CA3AF" },
  danger: { backgroundColor: "#B91C1C", borderColor: "#B91C1C" },
  ghost: { backgroundColor: "#F3F4F6", color: "#374151" },
};

/**
 * Componente Button - Exemplo de componentização avançada
 * 
 * Características:
 * 1. Props extensíveis (extends HTML attributes)
 * 2. Valores padrão
 * 3. Event handlers dinâmicos
 * 4. Estilos condicional
 * 5. Spread operator para props extras
 */
export default function Button({
  variant = "primary",      // valor padrão
  size = "md",              // valor padrão
  children,
  style,
  onMouseEnter,             // callback original do HTML
  onMouseLeave,
  disabled,
  ...props                  // propriedades HTML restantes
}: ButtonProps) {
  
  // Estilos base (aplicados sempre)
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: size === "sm" ? "5px 12px" : "7px 16px",
    fontSize: size === "sm" ? "12px" : "13px",
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background-color 0.12s, border-color 0.12s",
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
    // Sobrescrever estilos base com estilos da variante
    ...VARIANT_STYLES[variant],
    // Sobrescrever com estilos customizados (aceitos via props)
    ...style,
  };

  /**
   * Event handler: onMouseEnter
   * 
   * Padrão: estender handler original sem sobrescrever
   * 1. Aplicar hover styles
   * 2. Chamar handler original se existir
   */
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      // Aplicar estilos de hover
      const hoverStyles = HOVER_STYLES[variant];
      Object.assign((e.currentTarget as HTMLElement).style, hoverStyles);
    }
    // Chamar handler original (se fornecido)
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Voltar aos estilos padrão
    const defaultStyles = VARIANT_STYLES[variant];
    Object.assign((e.currentTarget as HTMLElement).style, defaultStyles);
    onMouseLeave?.(e);
  };

  return (
    <button
      disabled={disabled}
      style={base}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}  // Passar props HTML nativas restantes
    >
      {children}
    </button>
  );
}

// ========== USANDO BUTTON ==========

// Forma 1: Defaults
<Button>Clique</Button>

// Forma 2: Com variant
<Button variant="danger">Deletar</Button>

// Forma 3: Com múltiplas props
<Button 
  variant="primary" 
  size="sm"
  onClick={() => console.log("clicked")}
  disabled={false}
>
  Enviar
</Button>

// Forma 4: Props HTML nativas (via spread)
<Button
  type="submit"        // HTML nativo
  aria-label="Submit"  // Acessibilidade
  data-testid="btn"    // Testing
>
  Enviar
</Button>
```

### DataTable Component - Exemplo de Genéricos

```typescript
// 📄 src/components/ui/DataTable.tsx

"use client";

/**
 * Column<T>: Definição de coluna para tipo genérico T
 * 
 * Uso de generics permite reutilizar para
 * ANY tipo de dado (ApiTest, Execution, etc)
 */
interface Column<T> {
  key: string;                                    // Chave da propriedade (ex: "name")
  header: string;                                 // Cabeçalho legível (ex: "Test Name")
  width?: string;                                 // CSS width (ex: "200px")
  render?: (value: unknown, row: T) => React.ReactNode;  // Renderização customizada
  align?: "left" | "center" | "right";           // Alinhamento
}

/**
 * DataTableProps<T>: Props do componente genérico
 * 
 * T extends Record<string, unknown>:
 * - T deve ser um objeto
 * - Permite indexar propriedades dinamicamente
 */
interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];        // Colunas para tipo T
  data: T[];                   // Dados do tipo T
  emptyMessage?: string;       // Mensagem se vazio
  onRowClick?: (row: T) => void;  // Callback ao clicar
}

/**
 * Componente DataTable genérico
 * 
 * Funciona com QUALQUER tipo de dados!
 */
export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No data available.",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#F9FAFB" }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: "10px 16px" }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={(e) => {
                  if (onRowClick) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#F9FAFB";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: "11px 16px" }}>
                    {col.render
                      ? col.render(row[col.key], row)  // Renderização customizada
                      : (row[col.key] as React.ReactNode)  // Padrão
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ========== USANDO DataTable ==========

import type { ApiTest, Execution } from "@/lib/types";
import { mockTests, mockExecutions } from "@/lib/mock-data";

// USO 1: Com ApiTest[]
const testColumns: Column<ApiTest>[] = [
  { key: "name", header: "Test Name" },
  { key: "method", header: "Method" },
  { key: "url", header: "URL" },
  {
    key: "lastStatus",
    header: "Status",
    render: (value) => (
      <span style={{
        color: value === "success" ? "green" : "red"
      }}>
        {value as string}
      </span>
    )
  }
];

<DataTable<ApiTest>
  columns={testColumns}
  data={mockTests}
  onRowClick={(test) => {
    // test é tipado como ApiTest ✅
    console.log(`Clicou no teste: ${test.name}`);
    router.push(`/tests/${test.id}`);
  }}
/>

// USO 2: Com Execution[]
const executionColumns: Column<Execution>[] = [
  { key: "testName", header: "Test Name" },
  { key: "status", header: "Status" },
  { key: "responseTime", header: "Response Time (ms)" },
];

<DataTable<Execution>
  columns={executionColumns}
  data={mockExecutions}
  onRowClick={(execution) => {
    // execution é tipado como Execution ✅
    console.log(`Clicou em: ${execution.testName}`);
  }}
/>
```

---

## 🏗️ Análise do Layout System

### Root Layout - Estrutura Principal

```typescript
// 📄 src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

/**
 * Metadata: SEO + Social sharing
 * 
 * Estas informações aparece em:
 * - Abas do navegador
 * - Resultados de busca
 * - Social media (OpenGraph)
 */
export const metadata: Metadata = {
  title: {
    default: "API Sentinel",           // Título padrão
    template: "%s | API Sentinel"      // Padrão para subpáginas
  },
  description: "Internal API testing and monitoring platform",
};

// ========== RENDER FUNCTION ==========

/**
 * RootLayout: Componente wrapper de toda a app
 * 
 * Props genéricas de Next.js:
 * - children: ReactNode contendo a página
 * - params?: dinâmicos de URL
 */
export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          
          {/* ===== SIDEBAR (fixo à esquerda) ===== */}
          <Sidebar />
          
          {/* ===== CONTEÚDO PRINCIPAL ===== */}
          <div style={{ 
            marginLeft: "220px",       // Espaço para sidebar
            flex: 1,                   // Ocupar espaço restante
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh"
          }}>
            
            {/* ===== TOPBAR (cabeçalho) ===== */}
            <Topbar />
            
            {/* ===== PÁGINA (conteúdo dinâmico) ===== */}
            <main style={{ 
              flex: 1,                          // Crescer para preencher espaço
              backgroundColor: "#F4F6F6",
              padding: "24px"
            }}>
              {children}  {/* Páginas são renderizadas aqui */}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

// ========== HIERARQUIA ==========
/*
<RootLayout>
  <Sidebar />
  <div>
    <Topbar />
    <main>
      {children}  ← Page component vai aqui
    </main>
  </div>
</RootLayout>
*/
```

### Sidebar Component - Navegação

```typescript
// 📄 src/components/layout/Sidebar.tsx

"use client";  // ← Necessário: usa usePathname (hook)

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * NAV_ITEMS: Estrutura de navegação
 * 
 * Array de objetos com:
 * - href: URL destination
 * - label: Texto legível
 * - icon: Componente SVG
 */
const NAV_ITEMS = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" /* ... */">
        {/* SVG inline */}
      </svg>
    ),
  },
  {
    href: "/tests",
    label: "Tests",
    icon: (/* SVG */)
  },
  {
    href: "/executions",
    label: "Executions",
    icon: (/* SVG */)
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (/* SVG */)
  },
];

/**
 * Sidebar: Navegação fixa à esquerda
 * 
 * Características:
 * 1. Detecta rota ativa (usePathname)
 * 2. Destaca item ativo
 * 3. SVG icons inline
 * 4. Cor temática (verde escuro)
 */
export default function Sidebar() {
  const pathname = usePathname();  // Rota atual

  /**
   * isActive: Verifica se item está ativo
   * 
   * Lógica:
   * - "/" está ativo só em "/"
   * - "/tests" está ativo em "/tests", "/tests/123", etc
   */
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside style={{
      width: "220px",
      backgroundColor: "#0B3D2E",  // Verde temático
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      zIndex: 50,
    }}>
      
      {/* LOGO */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px",
            height: "28px",
            backgroundColor: "#27AE60",  // Verde mais claro
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="16" height="16" /* ... */>
              {/* Logo icon */}
            </svg>
          </div>
          <div>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "13px" }}>
              API SENTINEL
            </div>
          </div>
        </div>
      </div>
      
      {/* NAVEGAÇÃO */}
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              color: isActive(item.href) ? "#27AE60" : "#A0AEA8",
              textDecoration: "none",
              transition: "color 0.2s",
              borderLeft: isActive(item.href) ? "3px solid #27AE60" : "3px solid transparent",
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

---

## 📄 Análise de Páginas

### Page vs Client Pattern

```typescript
// 📄 src/app/tests/page.tsx (Server Component)

import type { Metadata } from "next";
import TestsClient from "@/components/tests/TestsClient";

/**
 * Page (Server): Propósito específico
 * ✅ Define metadata (SEO)
 * ✅ Ponto de entrada
 * ❌ Sem interatividade
 */
export const metadata: Metadata = {
  title: "Tests",  // Será "Tests | API Sentinel"
  description: "Manage and run API tests"
};

/**
 * RenderFunction: Simples e limpa
 * 
 * Server-side:
 * - Sem "use client"
 * - Sem hooks
 * - Sem event handlers
 */
export default function TestsPage() {
  return <TestsClient />;
}

// 📄 src/components/tests/TestsClient.tsx (Client Component)

"use client";  // ← Marca como Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockTests } from "@/lib/mock-data";
import DataTable from "@/components/ui/DataTable";
import type { Column, ApiTest } from "@/lib/types";

/**
 * TestsClient: Componente interativo
 * ✅ Usa hooks (useState)
 * ✅ Event handlers
 * ✅ Gerencia estado
 */
export default function TestsClient() {
  const router = useRouter();
  const [filtro, setFiltro] = useState("");  // Exemplo de estado

  // Colunas tipadas
  const columns: Column<ApiTest>[] = [
    { key: "name", header: "Test Name", width: "250px" },
    { key: "method", header: "Method", width: "100px" },
    { key: "url", header: "URL" },
    {
      key: "lastStatus",
      header: "Status",
      render: (value) => {
        // Renderização customizada
        return <StatusBadge status={value as ExecutionStatus} />;
      }
    }
  ];

  // Filtrar dados
  const testesFiltrados = mockTests.filter(t =>
    t.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Filtrar testes..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <DataTable<ApiTest>
        columns={columns}
        data={testesFiltrados}
        emptyMessage="Nenhum teste encontrado"
        onRowClick={(teste) => {
          // Navegar para detalhe
          router.push(`/tests/${teste.id}`);
        }}
      />
    </div>
  );
}
```

---

## 🔄 Fluxos de Dados Completos

### Fluxo 1: Ver Dashboard

```
1. User acessa "/"
   ↓
2. Next.js renderiza:
   RootLayout (Server)
   └── DashboardPage (Server)
       └── <DashboardClient /> (Client)
   ↓
3. DashboardClient renderiza:
   a. PageHeader ("Dashboard", subtitle)
   b. 4x StatCard (com dados de mockStats)
   c. DataTable (com mockExecutions)
   ↓
4. DataTable<Execution> renderiza:
   - thead com Column<Execution>[]
   - tbody com dados iterados
   ↓
5. User vê:
   ✅ Dashboard com estatísticas
   ✅ Tabela de execuções recentes
```

### Fluxo 2: Criar Novo Teste

```
1. User clica "New Test" → /tests/new
   ↓
2. Next.js renderiza:
   RootLayout
   └── TestsNewPage (Server)
       └── <TestForm mode="create" /> (Client)
   ↓
3. TestForm renderiza:
   - Input para nome
   - Input para URL
   - Select para method
   - Array de headers
   - Textarea para body
   - Inputs para expectedStatusCode, timeout
   ↓
4. User preenche e clica "Create"
   ↓
5. handleSubmit:
   a. e.preventDefault()
   b. Validar dados (validate())
   c. POST /api/tests (em app real)
   d. router.push("/tests") se sucesso
   ↓
6. User redirecionado para /tests
```

### Fluxo 3: Executar Teste

```
1. User clica em teste → /tests/:id
   ↓
2. TestDetail renderiza:
   - Dados do teste (mockTests.find(t => t.id === id))
   - Botão "Execute"
   ↓
3. User clica "Execute"
   ↓
4. handleExecute:
   a. POST /api/tests/:id/execute
   b. Aguardar resposta (simular delay)
   c. Criar Execution com resultado
   ↓
5. Mostra resultado:
   - Status (success/failed/timeout)
   - Response time
   - HTTP status code
   - Erro (se houver)
```

---

## 🎯 Padrões TypeScript Utilizados

### 1. Type Safety em Props

```typescript
// ✅ Padrão: Props interface tipada
interface ComponentProps {
  required: string;
  optional?: number;
  callback: (value: string) => void;
}

function MyComponent({ required, optional = 0, callback }: ComponentProps) {
  // TypeScript garante tipos corretos
}
```

### 2. Generics para Reutilização

```typescript
// ✅ Padrão: Genérico para tipo genérico
interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
}

// Funciona com qualquer T
<DataTable<ApiTest> data={testes} columns={colunas} />
<DataTable<Execution> data={execucoes} columns={outasColunas} />
```

### 3. Union Types para Variações

```typescript
// ✅ Padrão: Discriminated unions
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ExecutionStatus = "success" | "failed" | "timeout" | "pending";

// TypeScript garante valores válidos apenas
const handleStatus = (status: ExecutionStatus) => {
  if (status === "success") { /* ... */ }
  // ❌ if (status === "invalid") { } // Erro!
};
```

### 4. Event Handler Tipagem

```typescript
// ✅ Padrão: Event handlers específicos
const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  const value: string = e.currentTarget.value;
};

const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  e.preventDefault();
};
```

### 5. Optional Properties

```typescript
// ✅ Padrão: Props opcionais com padrões
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";  // opcional
  size?: "sm" | "md";                 // opcional
}

const Button = ({ 
  variant = "primary",  // valor padrão
  size = "md",
  children 
}: ButtonProps) => {
  // ...
};
```

---

## 🚀 Como Estender o Projeto

### Adicionar Novo Tipo de Dado

```typescript
// 1. Definir tipo em types.ts
export interface ApiTestResult {
  testId: string;
  assertions: {
    statusCode: boolean;
    responseTime: boolean;
    headers: Record<string, boolean>;
    body: boolean;
  };
  score: number; // 0-100
}

// 2. Adicionar mock data
export const mockResults: ApiTestResult[] = [
  {
    testId: "t1",
    assertions: {
      statusCode: true,
      responseTime: true,
      headers: { "content-type": true },
      body: false
    },
    score: 75
  }
];

// 3. Criar coluna para DataTable
const resultColumns: Column<ApiTestResult>[] = [
  { key: "testId", header: "Test" },
  {
    key: "score",
    header: "Score",
    render: (value) => <div>{value}%</div>
  }
];

// 4. Renderizar em componente
<DataTable<ApiTestResult>
  columns={resultColumns}
  data={mockResults}
/>
```

### Adicionar Nova Página

```typescript
// 1. Criar arquivo: src/app/reports/page.tsx
import type { Metadata } from "next";
import ReportsClient from "@/components/reports/ReportsClient";

export const metadata: Metadata = {
  title: "Reports"
};

export default function ReportsPage() {
  return <ReportsClient />;
}

// 2. Criar componente: src/components/reports/ReportsClient.tsx
"use client";

import { mockResults } from "@/lib/mock-data";
import DataTable from "@/components/ui/DataTable";
import type { Column, ApiTestResult } from "@/lib/types";

export default function ReportsClient() {
  const columns: Column<ApiTestResult>[] = [
    { key: "testId", header: "Test ID" },
    { key: "score", header: "Score" },
  ];

  return (
    <div>
      <h1>Reports</h1>
      <DataTable
        columns={columns}
        data={mockResults}
      />
    </div>
  );
}

// 3. Adicionar link no Sidebar (NAV_ITEMS)
{
  href: "/reports",
  label: "Reports",
  icon: (/* SVG */)
}
```

### Adicionar API Integration

```typescript
// 1. Criar client API tipado: src/lib/api-client.ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class TestsApi {
  async getAll(): Promise<ApiResponse<ApiTest[]>> {
    const res = await fetch("/api/tests");
    return res.json();
  }

  async getById(id: string): Promise<ApiResponse<ApiTest>> {
    const res = await fetch(`/api/tests/${id}`);
    return res.json();
  }

  async create(test: CreateTestInput): Promise<ApiResponse<ApiTest>> {
    const res = await fetch("/api/tests", {
      method: "POST",
      body: JSON.stringify(test)
    });
    return res.json();
  }
}

export const testsApi = new TestsApi();

// 2. Usar em componentes
const TestsClient = () => {
  const [testes, setTestes] = useState<ApiTest[]>([]);

  useEffect(() => {
    (async () => {
      const response = await testsApi.getAll();
      if (response.success && response.data) {
        setTestes(response.data);
      }
    })();
  }, []);

  return <DataTable columns={columns} data={testes} />;
};
```

---

## 📝 Checklist de Aprendizado

- [ ] Entendo a estrutura de tipos (types.ts)
- [ ] Consigo ler mock-data.ts e entender padrão
- [ ] Sei como componentizar com Props tipadas
- [ ] Entendo generics em DataTable
- [ ] Sei como usar useRouter e usePathname
- [ ] Consigo criar nova página com metadata
- [ ] Entendo Client vs Server Components
- [ ] Consigo adicionar novo tipo de dado
- [ ] Consigo criar novo componente reutilizável
- [ ] Consigo integrar com API real

---

**Parabéns! Você agora tem entendimento profundo do projeto APISentinel.**

Próximo passo: Modificar o projeto adicionando novas features! 🚀
