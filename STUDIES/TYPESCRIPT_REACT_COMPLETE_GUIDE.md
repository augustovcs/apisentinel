# 📚 Guia Completo de TypeScript + React + Next.js

## Uma Aula Avançada e Didática com Referência no Projeto APISentinel

**Versão:** 1.0  
**Data:** Maio 2026  
**Nível:** Intermediário a Avançado  
**Tempo de leitura:** ~2-3 horas

---

## 📖 ÍNDICE

1. [Introdução](#introdução)
2. [O que é TypeScript?](#o-que-é-typescript)
3. [TypeScript vs JavaScript](#typescript-vs-javascript)
4. [Tipos Primitivos e Avançados](#tipos-primitivos-e-avançados)
5. [Interfaces e Types](#interfaces-e-types)
6. [Genéricos](#genéricos)
7. [React com TypeScript](#react-com-typescript)
8. [Next.js 16 Fundamentals](#nextjs-16-fundamentals)
9. [Análise do Projeto APISentinel](#análise-do-projeto-apisentinel)
10. [Padrões e Best Practices](#padrões-e-best-practices)
11. [Exemplos Práticos Detalhados](#exemplos-práticos-detalhados)

---

## 🎯 Introdução

Você está aprendendo com um **projeto real de produção**: **APISentinel**, uma plataforma de testes e monitoramento de APIs construída com:

- **React 19.2.4** - biblioteca UI moderna
- **TypeScript 5** - superset tipado de JavaScript
- **Next.js 16.2.3** - framework fullstack para React
- **Tailwind CSS 4** - framework de CSS utilitário

Este guia usa exemplos reais do projeto para ensinar conceitos TypeScript avançados.

---

## 🔍 O que é TypeScript?

### Definição Essencial

TypeScript é um **superset tipado** de JavaScript que compila para JavaScript puro. Ele adiciona:

- ✅ Sistema de tipos estático
- ✅ Detecção de erros em tempo de compilação
- ✅ Melhor autocompletar e documentação de código
- ✅ Refatorações mais seguras
- ✅ Documentação viva através de tipos

### Fluxo de Compilação

```
TypeScript (.ts/.tsx)
         ↓
    [Compilador TS]
         ↓
JavaScript (.js)
         ↓
    [Motor JS]
         ↓
    Execução no navegador/servidor
```

### Problema que TypeScript Resolve

```javascript
// ❌ JavaScript - erro descoberto em RUNTIME
function somar(a, b) {
  return a + b;
}

somar("10", 5); // "105" ❌ Concatenou ao invés de somar!
```

```typescript
// ✅ TypeScript - erro descoberto em COMPILE TIME
function somar(a: number, b: number): number {
  return a + b;
}

somar("10", 5); // ❌ Erro! Tipo 'string' não é compatível com 'number'
```

---

## 📊 TypeScript vs JavaScript

| Aspecto | JavaScript | TypeScript |
|---------|-----------|-----------|
| **Tipagem** | Dinâmica | Estática |
| **Detecção de erros** | Runtime | Compilação |
| **Documentação** | Comentários | Tipos (vivos) |
| **Refatoração** | Perigosa | Segura |
| **Autocompletar** | Limitado | Excelente |
| **Curva de aprendizado** | Fácil | Média |
| **Tempo de desenvolvimento** | Rápido inicial | Mais lento, mas menos bugs |

---

## 🎪 Tipos Primitivos e Avançados

### 1. Tipos Primitivos Básicos

```typescript
// ✅ String
const nome: string = "APISentinel";
const url: string = `https://api.example.com/v1/users`;

// ✅ Number
const porta: number = 3000;
const timeout: number = 500; // em ms
const percentualSucesso: number = 95.5;

// ✅ Boolean
const ativo: boolean = true;
const testeExecutado: boolean = false;

// ✅ null e undefined
const vazio: null = null;
const naoDefinido: undefined = undefined;

// ✅ any (⚠️ evitar! - desativa type-checking)
const algo: any = "qualquer coisa";

// ✅ unknown (alternativa segura a 'any')
const resposta: unknown = await fetch('/api');
// Precisa fazer type guard antes de usar:
if (typeof resposta === 'string') {
  console.log(resposta.toUpperCase());
}
```

### 2. Arrays e Tuplas

```typescript
// ✅ Array de strings
const metodos: string[] = ["GET", "POST", "PUT"];
const metodosAlt: Array<string> = ["GET", "POST"]; // Alternativa

// ✅ Array de números
const portas: number[] = [3000, 5000, 8080];

// ✅ Array de objetos
interface Teste {
  id: string;
  nome: string;
}
const testes: Teste[] = [
  { id: "1", nome: "Login" },
  { id: "2", nome: "Logout" }
];

// ✅ Tupla - array com tamanho e tipos fixos
type HttpResponse = [statusCode: number, body: string];
const resposta: HttpResponse = [200, '{"sucesso": true}'];

// ✅ Array readonly
const metododosSegura: readonly string[] = ["GET", "POST"];
// metododosSegura.push("DELETE"); // ❌ Erro!

// ✅ Array com múltiplos tipos (Union)
type Valor = string | number | boolean;
const valores: Valor[] = ["texto", 42, true];
```

### 3. Union Types

Um tipo que pode ser **um de vários tipos**.

```typescript
// Exemplo do projeto: ExecutionStatus pode ser um desses valores
type ExecutionStatus = "success" | "failed" | "timeout" | "pending";

// Função que aceita union type
function tratarExecucao(status: ExecutionStatus) {
  if (status === "success") {
    console.log("✅ Teste passou!");
  } else if (status === "failed") {
    console.log("❌ Teste falhou!");
  } else if (status === "timeout") {
    console.log("⏱️ Teste expirou!");
  }
}

tratarExecucao("success"); // ✅ OK
tratarExecucao("invalido"); // ❌ Erro em compilação
```

### 4. Intersection Types

Combinar múltiplos tipos em um.

```typescript
// Combine dois tipos
type Administrador = Pessoa & { permissoes: string[] };

interface Pessoa {
  nome: string;
  idade: number;
}

const admin: Administrador = {
  nome: "João",
  idade: 30,
  permissoes: ["ler", "escrever", "deletar"]
};
```

### 5. Tipos Literais

Tipos que podem ser apenas valores específicos.

```typescript
// HttpMethod é um tipo literal
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

// Variant é literal
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

function criarBotao(variant: ButtonVariant) {
  // TypeScript sabe que variant é um desses 4 valores
  const estilos: Record<ButtonVariant, string> = {
    primary: "bg-green-800",
    secondary: "bg-white",
    danger: "bg-red-600",
    ghost: "bg-transparent"
  };
  return estilos[variant];
}
```

### 6. Record Type

Mapear chaves para valores.

```typescript
// Criar um objeto onde as chaves são variantes de botão
const estilos: Record<ButtonVariant, React.CSSProperties> = {
  primary: { backgroundColor: "#0B3D2E", color: "#ffffff" },
  secondary: { backgroundColor: "#ffffff", color: "#1C1C1C" },
  danger: { backgroundColor: "#DC2626", color: "#ffffff" },
  ghost: { backgroundColor: "transparent", color: "#6B7280" }
};

// Usar
const estiloPrimario = estilos["primary"];
```

### 7. Conditional Types

Tipos que dependem de condições.

```typescript
// Se T é string, retorna number. Senão, retorna boolean
type ToNumber<T> = T extends string ? number : boolean;

type A = ToNumber<"hello">; // number
type B = ToNumber<123>; // boolean

// Exemplo prático: Infer (extrair tipo de uma função)
type RetornoFuncao<T> = T extends (...args: any[]) => infer R ? R : never;

function buscarUsuario(id: number): { id: number; nome: string } {
  return { id, nome: "João" };
}

type ResultadoBusca = RetornoFuncao<typeof buscarUsuario>;
// ResultadoBusca = { id: number; nome: string }
```

---

## 🎨 Interfaces e Types

### Diferenças: Interface vs Type

```typescript
// ========== INTERFACE ==========
// ✅ Extensível (pode ser "aberta")
// ✅ Declaração múltipla (merge automático)
// ✅ Melhor para objetos e classes
// ❌ Não pode descrever primitivos

interface Usuario {
  id: string;
  nome: string;
}

// Expandir interface existente
interface Usuario {
  email: string; // ✅ Adiciona novo campo automaticamente
}

// ========== TYPE ==========
// ✅ Pode descrever qualquer coisa (primitivos, unions, tuplas)
// ✅ Mais flexível
// ❌ Não é extensível da mesma forma

type UsuarioType = {
  id: string;
  nome: string;
  email: string;
};

// Para expandir, precisa fazer intersection
type UsuarioComAdmin = UsuarioType & { admin: boolean };
```

### Exemplo Real do Projeto: Types

```typescript
// 📄 src/lib/types.ts

// ✅ Union literal (tipo especializado)
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export type ExecutionStatus = "success" | "failed" | "timeout" | "pending";

// ✅ Interface para objeto estruturado
export interface Header {
  key: string;      // Chave do header (ex: "Content-Type")
  value: string;    // Valor do header (ex: "application/json")
}

// ✅ Interface mais complexa
export interface ApiTest {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;        // ← Usa tipo especializado
  headers: Header[];          // ← Array de objetos
  body: string;
  expectedStatusCode: number;
  maxResponseTime: number;    // em millisegundos
  lastStatus: ExecutionStatus | null;  // ← Union com null
  createdAt: string;
  updatedAt: string;
}

// ✅ Outra interface
export interface Execution {
  id: string;
  testId: string;
  testName: string;
  status: ExecutionStatus;
  responseTime: number;
  statusCode: number | null;   // ← Pode ser número ou null
  error: string | null;
  executedAt: string;
}

// ✅ Interface para dados agregados
export interface DashboardStats {
  totalTests: number;
  successRate: number;         // percentual
  failedLast24h: number;
  avgResponseTime: number;     // em ms
}
```

### Exemplo Real do Projeto: Props de Component

```typescript
// 📄 src/components/ui/Button.tsx

// ✅ Estender HTMLAttributes do HTML nativo
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  children: React.ReactNode;
}

// ✅ Usar Record para mapear variantes aos estilos
const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: "#0B3D2E",
    color: "#ffffff",
    border: "1px solid #0B3D2E",
  },
  secondary: {
    backgroundColor: "#ffffff",
    color: "#1C1C1C",
    border: "1px solid #D1D5DB",
  },
  danger: {
    backgroundColor: "#DC2626",
    color: "#ffffff",
    border: "1px solid #DC2626",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#6B7280",
    border: "1px solid transparent",
  },
};

// ✅ Componente funcional com tipos
export default function Button({ 
  variant = "primary",    // valor padrão
  size = "md",
  children, 
  style, 
  onMouseEnter, 
  onMouseLeave, 
  disabled, 
  ...props 
}: ButtonProps) {
  // ...componente
}
```

---

## 🔮 Genéricos

Genéricos permitem **escrever código reutilizável** que funciona com qualquer tipo.

### Introdução a Genéricos

```typescript
// ❌ SEM GENÉRICO - tipo específico (não reutilizável)
function retornarPrimeiro(array: string[]): string {
  return array[0];
}

// ✅ COM GENÉRICO - funciona com qualquer tipo
function retornarPrimeiro<T>(array: T[]): T {
  return array[0];
}

// Usar com diferentes tipos
const primeiraString = retornarPrimeiro(["oi", "mundo"]); // tipo: string
const primeiroNumero = retornarPrimeiro([1, 2, 3]); // tipo: number

// TypeScript infere automaticamente o tipo!
```

### Genéricos Restritos

```typescript
// Apenas objetos com propriedade 'id'
function obterPorId<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// ✅ Funciona
const teste = obterPorId([
  { id: "1", nome: "Teste A" },
  { id: "2", nome: "Teste B" }
], "1");

// ❌ Erro - objeto não tem propriedade 'id'
obterPorId([{ nome: "inválido" }], "1");
```

### Exemplo Real: DataTable Genérico

```typescript
// 📄 src/components/ui/DataTable.tsx

// ✅ Genérico que funciona com QUALQUER tipo de dado
interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;  // ← T aqui!
  align?: "left" | "center" | "right";
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];    // ← Array de colunas tipadas para T
  data: T[];               // ← Array de dados do tipo T
  emptyMessage?: string;
  onRowClick?: (row: T) => void;  // ← Callback com tipo T
}

// ✅ Componente genérico - funciona com QUALQUER tipo de dado
export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No data available.",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div>
      <table>
        <thead>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td>{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} onClick={() => onRowClick?.(row)}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
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

// ✅ USANDO O COMPONENT COM DIFERENTES TIPOS

// Tipo 1: Executions
import type { Execution } from "@/lib/types";

const executionColumns: Column<Execution>[] = [
  { key: "testName", header: "Test Name" },
  { key: "status", header: "Status", render: (value) => <StatusBadge status={value as ExecutionStatus} /> },
  { key: "responseTime", header: "Time (ms)" },
];

<DataTable<Execution> 
  columns={executionColumns} 
  data={mockExecutions}
  onRowClick={(execution) => {
    // execution é tipado como Execution
    console.log(execution.testName);
  }}
/>

// Tipo 2: ApiTests
import type { ApiTest } from "@/lib/types";

const testColumns: Column<ApiTest>[] = [
  { key: "name", header: "Test Name" },
  { key: "method", header: "Method", render: (value) => <MethodBadge method={value as HttpMethod} /> },
  { key: "url", header: "URL" },
];

<DataTable<ApiTest>
  columns={testColumns}
  data={mockTests}
  onRowClick={(test) => {
    // test é tipado como ApiTest
    console.log(test.url);
  }}
/>
```

### Multiplos Genéricos

```typescript
// Função com 2 genéricos independentes
function mapear<T, U>(array: T[], transformacao: (item: T) => U): U[] {
  return array.map(transformacao);
}

const numeros = [1, 2, 3];
const strings = mapear(numeros, num => `número: ${num}`);
// strings: string[]
```

---

## ⚛️ React com TypeScript

### Component Funcional Tipado

```typescript
// ✅ Padrão moderno: Arrow function com tipos explícitos

interface Props {
  nome: string;
  idade?: number;  // opcional (?)
  ativo: boolean;
}

// Forma 1: Type annotation na função
const Usuario: React.FC<Props> = (props) => {
  return <div>{props.nome}</div>;
};

// Forma 2: Desestruturação (preferível)
const Usuario = ({ nome, idade = 18, ativo }: Props) => {
  return (
    <div>
      <h1>{nome}</h1>
      <p>Idade: {idade}</p>
      <p>{ativo ? "Ativo" : "Inativo"}</p>
    </div>
  );
};
```

### React Hooks com TypeScript

#### useState

```typescript
// ✅ Tipo inferido automaticamente
const [contador, setContador] = useState(0);  // número

// ✅ Tipo explícito para inferência melhor
const [nome, setNome] = useState<string>(""); // string
const [ativo, setAtivo] = useState<boolean>(false);

// ✅ Com tipos complexos
interface Usuario {
  id: string;
  nome: string;
}

const [usuario, setUsuario] = useState<Usuario | null>(null);

// Usar
setUsuario({ id: "1", nome: "João" }); // ✅
setUsuario(null); // ✅
setUsuario({ id: "1" }); // ❌ Erro - 'nome' é obrigatório
```

#### useEffect

```typescript
// ✅ sem retorno
useEffect(() => {
  console.log("componente montado");
}, []);

// ✅ com cleanup
useEffect(() => {
  const handleResize = () => console.log("redimensionado");
  window.addEventListener("resize", handleResize);
  
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

// ✅ com dependências tipadas
const [id, setId] = useState<string>("");

useEffect(() => {
  console.log("id mudou:", id);
}, [id]);  // TypeScript valida que 'id' existe no escopo
```

#### useCallback

```typescript
// ✅ Função com tipos de parâmetro e retorno
const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
  console.log("clicado");
}, []);

const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  console.log("novo valor:", e.currentTarget.value);
}, []);
```

#### useContext

```typescript
// Criar context com tipo
interface Theme {
  modo: "claro" | "escuro";
  cor: string;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

// Provider
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>({ modo: "claro", cor: "#000" });
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook customizado com tipo garantido
function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
}

// Usar
const { modo, cor } = useTheme(); // ✅ Tipado!
```

### Event Handlers Tipados

```typescript
// Diferentes tipos de eventos React
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  e.preventDefault();
};

const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  const valor: string = e.currentTarget.value;
};

const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
  e.preventDefault();
  // formulário foi submetido
};

const handleFoco: React.FocusEventHandler<HTMLInputElement> = (e) => {
  console.log("input focado");
};
```

### Exemplo Real: TestForm Component

```typescript
// 📄 src/components/tests/TestForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { HttpMethod, Header } from "@/lib/types";

interface TestFormProps {
  initialValues?: {
    name: string;
    url: string;
    method: HttpMethod;
    headers: Header[];
    body: string;
    expectedStatusCode: number;
    maxResponseTime: number;
  };
  mode: "create" | "edit";
}

const DEFAULT_VALUES = {
  name: "",
  url: "",
  method: "GET" as HttpMethod,
  headers: [{ key: "", value: "" }],
  body: "",
  expectedStatusCode: 200,
  maxResponseTime: 500,
};

export default function TestForm({ initialValues, mode }: TestFormProps) {
  const router = useRouter();
  const init = initialValues ?? DEFAULT_VALUES;

  // ✅ Estados tipados
  const [name, setName] = useState<string>(init.name);
  const [url, setUrl] = useState<string>(init.url);
  const [method, setMethod] = useState<HttpMethod>(init.method);
  const [headers, setHeaders] = useState<Header[]>(init.headers);
  const [body, setBody] = useState<string>(init.body);
  const [expectedStatusCode, setExpectedStatusCode] = useState<number>(init.expectedStatusCode);
  const [maxResponseTime, setMaxResponseTime] = useState<number>(init.maxResponseTime);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Função de validação tipada
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    
    if (!name.trim()) e.name = "Name is required.";
    if (!url.trim()) e.url = "URL is required.";
    else if (!/^https?:\/\/.+/.test(url.trim())) {
      e.url = "Must be a valid HTTP/HTTPS URL.";
    }
    
    if (expectedStatusCode < 100 || expectedStatusCode > 599) {
      e.expectedStatusCode = "Must be between 100–599.";
    }
    if (maxResponseTime < 1) {
      e.maxResponseTime = "Must be ≥ 1ms.";
    }
    
    return e;
  };

  // ✅ Handler de submit tipado
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // POST/PUT para API
    console.log({
      name, url, method, headers, body,
      expectedStatusCode, maxResponseTime
    });

    alert(`Test ${mode === "create" ? "created" : "updated"} successfully!`);
    router.push("/tests");
  };

  // ✅ Funções de manipulação de headers
  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (i: number) => {
    setHeaders(headers.filter((_, idx) => idx !== i));
  };

  const updateHeader = (i: number, field: "key" | "value", val: string) => {
    const next = [...headers];
    next[i][field] = val;
    setHeaders(next);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
    </form>
  );
}
```

---

## 🚀 Next.js 16 Fundamentals

### O que é Next.js?

Next.js é um **framework fullstack** para React que fornece:

- ✅ **App Router** - roteamento de arquivos baseado em diretório
- ✅ **Server Components** - componentes executados no servidor
- ✅ **Client Components** - componentes no navegador (com "use client")
- ✅ **API Routes** - endpoints HTTP fáceis de criar
- ✅ **Static & Dynamic rendering** - otimizações automáticas
- ✅ **Image optimization** - compressão automática de imagens

### Estrutura do Projeto APISentinel

```
Frontend/
├── src/
│   ├── app/                    # Páginas (App Router)
│   │   ├── layout.tsx          # Layout raiz
│   │   ├── page.tsx            # Página home (/)
│   │   ├── globals.css         # CSS global
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Página /dashboard
│   │   ├── tests/
│   │   │   ├── page.tsx        # Lista de testes
│   │   │   ├── [id]/
│   │   │   │   └── edit/page.tsx  # Editar teste
│   │   │   └── new/
│   │   │       └── page.tsx    # Criar novo teste
│   │   ├── executions/
│   │   │   └── page.tsx        # Lista de execuções
│   │   └── settings/
│   │       └── page.tsx        # Configurações
│   ├── components/             # Componentes reutilizáveis
│   │   ├── dashboard/          # Componentes de dashboard
│   │   ├── tests/              # Componentes de testes
│   │   ├── layout/             # Componentes de layout
│   │   └── ui/                 # UI components genéricos
│   └── lib/                    # Utilitários
│       ├── types.ts            # Definições de tipos
│       └── mock-data.ts        # Dados simulados
├── public/                     # Arquivos estáticos
├── package.json
├── tsconfig.json              # Configuração TypeScript
└── next.config.ts             # Configuração Next.js
```

### App Router - Roteamento Baseado em Arquivos

```typescript
// REGRA: A estrutura de pastas = URLs

src/app/
├── page.tsx              →  /
├── tests/
│   └── page.tsx          →  /tests
├── tests/[id]/
│   └── page.tsx          →  /tests/:id (dinâmico)
└── tests/[id]/edit/
    └── page.tsx          →  /tests/:id/edit

// ✅ Parâmetro dinâmico [id]
export default function TestDetail({ params }: { params: { id: string } }) {
  return <h1>Teste ID: {params.id}</h1>;
}
```

### Server Components vs Client Components

```typescript
// ========== SERVER COMPONENT ==========
// Por padrão, componentes Next.js são Server Components
// ✅ Executam no servidor
// ✅ Acessam bancos de dados diretamente
// ✅ Informações sensíveis (tokens, senhas)
// ❌ Não podem usar hooks (useState, useEffect)
// ❌ Não podem usar event handlers do navegador

// 📄 app/page.tsx
export default function Home() {
  // ❌ Não pode usar: useState, useEffect, etc
  return <h1>Página de servidor</h1>;
}

// ========== CLIENT COMPONENT ==========
// Marcar com "use client" para tornar componente de cliente
// ✅ Executam no navegador
// ✅ Podem usar hooks (useState, useEffect, etc)
// ✅ Podem usar event handlers
// ❌ Não acessam bancos dados diretamente
// ❌ Não usam informações sensíveis

"use client";  // ← Diretiva obrigatória!

import { useState } from "react";

export default function DashboardClient() {
  const [contador, setContador] = useState(0);  // ✅ Funciona
  
  const handleClick = () => {  // ✅ Event handler funciona
    setContador(contador + 1);
  };
  
  return (
    <div>
      <p>Contador: {contador}</p>
      <button onClick={handleClick}>+1</button>
    </div>
  );
}
```

### Layout Hierarchy

```typescript
// 📄 src/app/layout.tsx (Layout raiz)
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: { default: "API Sentinel", template: "%s | API Sentinel" },
  description: "Internal API testing and monitoring platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div style={{ flex: 1 }}>
            <Topbar />
            <main style={{ padding: "24px" }}>
              {children}  {/* Páginas renderizadas aqui */}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

// 📄 src/app/tests/page.tsx
import TestsClient from "@/components/tests/TestsClient";

export const metadata = { title: "Tests" };

export default function TestsPage() {
  return <TestsClient />;
}
```

### Metadata API

```typescript
import type { Metadata } from "next";

// ✅ Configurar meta tags
export const metadata: Metadata = {
  title: "Dashboard | API Sentinel",
  description: "Sistema-wide overview of API test health",
  keywords: ["api", "testing", "monitoring"],
  authors: [{ name: "Engineering Team" }],
  openGraph: {
    type: "website",
    url: "https://sentinel.example.com",
    title: "API Sentinel",
    description: "API testing platform",
    images: [{ url: "https://sentinel.example.com/og.png" }],
  },
};

export default function Page() {
  return <div>Conteúdo...</div>;
}
```

### Dynamic Routes com Parâmetros

```typescript
// 📄 app/tests/[id]/page.tsx

interface Params {
  id: string;
}

export default function TestDetail({ params }: { params: Params }) {
  return <h1>Teste #{params.id}</h1>;
}

// URLs suportadas:
// /tests/1     → params.id = "1"
// /tests/xyz   → params.id = "xyz"
// /tests/123/edit/   → ❌ Não match
```

### Múltiplos Segmentos Dinâmicos

```typescript
// 📄 app/tests/[id]/edit/page.tsx

interface Params {
  id: string;
}

export default function EditTest({ params }: { params: Params }) {
  return <h1>Editando Teste #{params.id}</h1>;
}

// URLs:
// /tests/123/edit → params.id = "123"
```

### Importações com Alias

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // @ aponta para src/
    }
  }
}

// Usar em qualquer arquivo:
import type { ApiTest } from "@/lib/types";        // ✅
import Button from "@/components/ui/Button";       // ✅
import { mockData } from "@/lib/mock-data";        // ✅

// SEM ALIAS (evitar):
import type { ApiTest } from "../../../lib/types"; // ❌
```

---

## 📊 Análise do Projeto APISentinel

### O que o Projeto Faz?

**APISentinel** é uma plataforma interna para:

- 🧪 **Criar testes de APIs** - definir endpoints para testar
- 🚀 **Executar testes** - disparar testes e monitorar
- 📊 **Visualizar resultados** - dashboard com estatísticas
- ⚙️ **Configurações** - gerenciar settings do sistema

### Arquitetura em Camadas

```
Navegação (Sidebar, Topbar)
         ↓
      Pages (Roteamento)
         ↓
   Components (UI)
         ↓
    Hooks & State
         ↓
    Types & Interfaces
         ↓
   Mock Data (API)
```

### Fluxo de Dados Real

```
1. User abre /tests
   ↓
2. TestsPage renderiza <TestsClient />
   ↓
3. TestsClient carrega mockTests (simulando API)
   ↓
4. TestsClient renderiza <DataTable> passando dados
   ↓
5. DataTable renderiza linhas com status badges
   ↓
6. User clica em uma linha (onRowClick)
   ↓
7. useRouter.push() navega para /tests/:id
```

### Tipagem em Cascata

```typescript
// 1️⃣ NÍVEL: Types (src/lib/types.ts)
export interface ApiTest {
  id: string;
  name: string;
  method: HttpMethod;
  // ...
}

// 2️⃣ NÍVEL: Mock Data (src/lib/mock-data.ts)
export const mockTests: ApiTest[] = [
  { id: "1", name: "Login", method: "POST", /* ... */ },
  // ...
];

// 3️⃣ NÍVEL: Component Props (src/components/tests/TestsClient.tsx)
interface Column<ApiTest> {
  key: keyof ApiTest;  // ← Só propriedades de ApiTest!
  header: string;
}

// 4️⃣ NÍVEL: Componente (src/components/ui/DataTable.tsx)
function DataTable<T extends Record<string, unknown>>({
  columns: Column<T>[],  // ← Tipado genéricamente
  data: T[],
}: DataTableProps<T>) {
  // render
}
```

### Padrão: Componentes "Page" vs "Client"

O projeto usa um padrão interessante:

```typescript
// 📄 src/app/dashboard/page.tsx (Server)
// Propósito: Definir metadata, ser um ponto de entrada

import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardClient />;
}

// 📄 src/components/dashboard/DashboardClient.tsx (Client)
// Propósito: Renderizar UI com interatividade

"use client";

export default function DashboardClient() {
  // ... componente interativo
}
```

**Por que?** Separar preocupações:
- Page = servidor (metadata, layout)
- Client = navegador (estado, eventos)

---

## ✨ Padrões e Best Practices

### 1. Type Safety em Eventos

```typescript
// ❌ Evitar: 'any' perde informações de tipo
const handleChange = (e: any) => {
  console.log(e.target.value);
};

// ✅ Usar: Tipo específico do evento
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const valor: string = e.currentTarget.value;
  console.log(valor);  // ✅ TypeScript sabe que é string
};

// ✅ Usar: Type alias para reutilizar
type InputChangeHandler = React.ChangeEventHandler<HTMLInputElement>;
const handleChange: InputChangeHandler = (e) => {
  console.log(e.currentTarget.value);
};
```

### 2. Funções Anônimas e Arrow Functions

```typescript
// 1️⃣ FUNÇÃO NOMEADA
function somar(a: number, b: number): number {
  return a + b;
}

// 2️⃣ ARROW FUNCTION
const somar = (a: number, b: number): number => {
  return a + b;
};

// 3️⃣ ARROW FUNCTION IMPLÍCITA (corpo único)
const somar = (a: number, b: number): number => a + b;

// 4️⃣ FUNÇÃO ANÔNIMA (callback)
const numeros = [1, 2, 3];
const dobrados = numeros.map((num) => num * 2);  // ✅ Type inferido

// 5️⃣ FUNÇÃO ANÔNIMA COM MÚLTIPLAS LINHAS
const processar = (valor: number): string => {
  const dobro = valor * 2;
  const texto = `Resultado: ${dobro}`;
  return texto;
};

// 6️⃣ FUNÇÃO DE HIGHER ORDER (retorna outra função)
const criarMultiplicador = (fator: number) => {
  return (numero: number): number => numero * fator;
};

const multiplicarPor3 = criarMultiplicador(3);
console.log(multiplicarPor3(10));  // 30
```

### 3. Optional Chaining & Nullish Coalescing

```typescript
interface Usuario {
  nome: string;
  endereco?: {
    rua?: string;
    cidade?: string;
  };
}

const usuario: Usuario = { nome: "João" };

// ❌ Sem verificação - erro se endereco é undefined
console.log(usuario.endereco.rua);  // ❌ Erro!

// ✅ Optional chaining (?.)
console.log(usuario.endereco?.rua);  // undefined (seguro)

// ✅ Nullish coalescing (??)
const cidade = usuario.endereco?.cidade ?? "Desconhecida";
console.log(cidade);  // "Desconhecida"

// ✅ Ambos juntos
const descricao = usuario.endereco?.rua ?? "Sem endereço";
```

### 4. Destructuring com Tipos

```typescript
// String destructuring
const [primeiro, segundo] = ["oi", "mundo"];
const [a, b, ...resto] = [1, 2, 3, 4, 5];

// Object destructuring
interface Pessoa {
  nome: string;
  idade: number;
  email?: string;
}

const pessoa: Pessoa = { nome: "Ana", idade: 30 };

// Forma 1: Simples
const { nome, idade } = pessoa;

// Forma 2: Renomear
const { nome: nomeCompleto, idade: anos } = pessoa;

// Forma 3: Valores padrão
const { email = "nao@fornecido.com" } = pessoa;

// Forma 4: Nested destructuring
interface Usuario {
  perfil: {
    nome: string;
    configuracoes: {
      tema: "claro" | "escuro";
    };
  };
}

const usuario: Usuario = {
  perfil: {
    nome: "João",
    configuracoes: { tema: "claro" }
  }
};

const { perfil: { configuracoes: { tema } } } = usuario;
console.log(tema);  // "claro"
```

### 5. Spread Operator

```typescript
// Array spread
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const combinado = [...array1, ...array2];  // [1, 2, 3, 4, 5, 6]

// Object spread (criar cópia com modificações)
const usuario = { id: "1", nome: "João", ativo: true };

// ✅ Criar novo objeto sem mutar original
const usuarioAtualizado = {
  ...usuario,
  nome: "João Silva",  // Sobrescreve 'nome'
};

// Array de objetos spread
const headers: Header[] = [
  { key: "Content-Type", value: "application/json" },
  { key: "Authorization", value: "Bearer token" }
];

// ✅ Adicionar novo header
const novoHeaders = [
  ...headers,
  { key: "X-Custom", value: "valor" }
];

// ✅ Remover um header
const semAutorizacao = headers.filter(h => h.key !== "Authorization");
```

### 6. Tipagem de Callbacks

```typescript
// Callback simples
type OnClick = () => void;
type OnChange = (valor: string) => void;
type OnSuccess = (dados: any) => void;

// Callback com evento
type OnClickButton = (e: React.MouseEvent<HTMLButtonElement>) => void;

// Callback com retorno
type Validador = (valor: string) => boolean;

const validarEmail: Validador = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

console.log(validarEmail("teste@gmail.com"));  // true
```

### 7. Type Guards

```typescript
// 1️⃣ typeof guard
function processar(valor: string | number) {
  if (typeof valor === "string") {
    console.log(valor.toUpperCase());  // ✅ string
  } else {
    console.log(valor.toFixed(2));  // ✅ number
  }
}

// 2️⃣ instanceof guard
class Erro extends Error {}

try {
  // ...
} catch (e) {
  if (e instanceof Erro) {
    console.log(e.message);  // ✅ Erro
  }
}

// 3️⃣ Property check
interface Carro {
  rodas: number;
}

interface Bicicleta {
  pedais: number;
}

function verificar(veículo: Carro | Bicicleta) {
  if ("rodas" in veículo) {
    console.log("É um carro");
  } else {
    console.log("É uma bicicleta");
  }
}

// 4️⃣ Custom type guard (function predicate)
type ExecutionStatus = "success" | "failed" | "timeout";

function ehSucesso(status: any): status is "success" {
  return status === "success";
}

const status: ExecutionStatus = "success";
if (ehSucesso(status)) {
  console.log("✅ Sucesso!");
}
```

### 8. Objetos Imutáveis

```typescript
// ❌ Mutação (evitar)
const usuario = { nome: "João", idade: 30 };
usuario.nome = "Maria";  // Modifica original

// ✅ Immutabilidade com spread
const usuarioAtualizado = { ...usuario, nome: "Maria" };
console.log(usuario.nome);  // "João" (original mantido)
console.log(usuarioAtualizado.nome);  // "Maria" (cópia)

// ❌ Mutação em array
const numeros = [1, 2, 3];
numeros.push(4);  // Modifica original

// ✅ Array imutável
const numerosNovos = [...numeros, 4];  // [1, 2, 3, 4]
const semUltimo = numeros.slice(0, -1);  // [1, 2]
const mapeado = numeros.map(n => n * 2);  // [2, 4, 6]

// ✅ Padrão em React
const [items, setItems] = useState<Header[]>([{ key: "", value: "" }]);

// Adicionar item imutavelmente
const addItem = () => {
  setItems([...items, { key: "", value: "" }]);
};

// Remover item
const removeItem = (index: number) => {
  setItems(items.filter((_, i) => i !== index));
};

// Atualizar item
const updateItem = (index: number, field: "key" | "value", val: string) => {
  const updated = [...items];
  updated[index][field] = val;
  setItems(updated);
};
```

---

## 🔧 Exemplos Práticos Detalhados

### Exemplo 1: Form Validation Tipado

```typescript
// Criar um sistema de validação reutilizável

interface ValidationRule<T> {
  validate: (valor: T) => boolean;
  message: string;
}

interface ValidatorConfig<T extends Record<string, any>> {
  [K in keyof T]?: ValidationRule<T[K]>[];
}

// Tipo utilitário para erros
type ValidationErrors<T extends Record<string, any>> = {
  [K in keyof T]?: string;
};

// Função de validação genérica
function validarFormulario<T extends Record<string, any>>(
  dados: T,
  config: ValidatorConfig<T>
): ValidationErrors<T> {
  const erros: ValidationErrors<T> = {};

  for (const campo in config) {
    const regras = config[campo as keyof T];
    if (!regras) continue;

    for (const regra of regras) {
      if (!regra.validate(dados[campo])) {
        erros[campo as keyof T] = regra.message;
        break;  // Para na primeira regra quebrada
      }
    }
  }

  return erros;
}

// ========== USO ==========

interface FormularioTeste {
  nome: string;
  url: string;
  timeout: number;
}

const validadores: ValidatorConfig<FormularioTeste> = {
  nome: [
    {
      validate: (v) => v.trim().length > 0,
      message: "Nome é obrigatório",
    },
    {
      validate: (v) => v.length <= 100,
      message: "Nome máximo 100 caracteres",
    },
  ],
  url: [
    {
      validate: (v) => /^https?:\/\/.+/.test(v),
      message: "URL inválida",
    },
  ],
  timeout: [
    {
      validate: (v) => v > 0,
      message: "Timeout deve ser positivo",
    },
    {
      validate: (v) => v <= 30000,
      message: "Timeout máximo 30000ms",
    },
  ],
};

const formulario: FormularioTeste = {
  nome: "",
  url: "api.example.com",
  timeout: 5000,
};

const erros = validarFormulario(formulario, validadores);
// erros = {
//   nome: "Nome é obrigatório",
//   url: "URL inválida"
// }
```

### Exemplo 2: API Client Tipado

```typescript
// Simular um cliente HTTP tipado

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ✅ Método genérico que retorna tipo específico
  async request<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        method: config.method,
        headers: config.headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      const data: T = await response.json();

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : `HTTP ${response.status}`,
        statusCode: response.status,
      };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Unknown error",
        statusCode: 0,
      };
    }
  }

  // Conveniência: GET
  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // Conveniência: POST
  post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body });
  }
}

// ========== USO ==========

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

const client = new ApiClient("https://api.example.com");

// ✅ Retorna ApiResponse<Usuario>
const response = await client.get<Usuario>("/usuarios/1");

if (response.success && response.data) {
  console.log(response.data.nome);  // ✅ Tipado como string
  console.log(response.data.email); // ✅ Tipado como string
} else {
  console.error(response.error);
}

// ✅ POST também é tipado
const novoUsuario: Usuario = { id: "2", nome: "Ana", email: "ana@..." };
const createResponse = await client.post<Usuario>("/usuarios", novoUsuario);
```

### Exemplo 3: Hook Customizado Tipado

```typescript
// Hook para gerenciar estado com validação

interface UseValidatedStateOptions<T> {
  initialValue: T;
  validate?: (valor: T) => boolean;
  onError?: (mensagem: string) => void;
}

interface UseValidatedStateReturn<T> {
  valor: T;
  setValue: (novo: T) => boolean;  // Retorna true se válido
  erro: string | null;
  limparErro: () => void;
}

function useValidatedState<T>({
  initialValue,
  validate,
  onError,
}: UseValidatedStateOptions<T>): UseValidatedStateReturn<T> {
  const [valor, setValor] = useState<T>(initialValue);
  const [erro, setErro] = useState<string | null>(null);

  const setValue = (novo: T): boolean => {
    if (validate && !validate(novo)) {
      const mensagem = "Validação falhou";
      setErro(mensagem);
      onError?.(mensagem);
      return false;
    }

    setValor(novo);
    setErro(null);
    return true;
  };

  const limparErro = () => setErro(null);

  return { valor, setValue, erro, limparErro };
}

// ========== USO ==========

function FormularioDeTeste() {
  const nome = useValidatedState<string>({
    initialValue: "",
    validate: (v) => v.trim().length > 0,
    onError: (msg) => console.error(msg),
  });

  const timeout = useValidatedState<number>({
    initialValue: 5000,
    validate: (v) => v > 0 && v <= 30000,
    onError: (msg) => alert(msg),
  });

  const handleSubmit = () => {
    const nomeValido = nome.setValue(nome.valor);
    const timeoutValido = timeout.setValue(timeout.valor);

    if (nomeValido && timeoutValido) {
      console.log("Formulário válido!");
    }
  };

  return (
    <div>
      <input
        value={nome.valor}
        onChange={(e) => nome.setValue(e.target.value)}
      />
      {nome.erro && <span style={{ color: "red" }}>{nome.erro}</span>}

      <input
        type="number"
        value={timeout.valor}
        onChange={(e) => timeout.setValue(Number(e.target.value))}
      />

      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
}
```

### Exemplo 4: Padrão Render Function (Children as Function)

```typescript
// Padrão avançado de React: passar uma função como filho

interface RenderFunctionProps<T> {
  children: (dados: T, carregando: boolean) => React.ReactNode;
  data: T;
  carregando: boolean;
}

function DataRenderer<T>({ 
  children, 
  data, 
  carregando 
}: RenderFunctionProps<T>) {
  return <>{children(data, carregando)}</>;
}

// ========== USO ==========

interface Stats {
  total: number;
  sucesso: number;
  falha: number;
}

const stats: Stats = { total: 100, sucesso: 95, falha: 5 };

<DataRenderer<Stats> data={stats} carregando={false}>
  {(dados, carregando) => (
    <div>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <p>Total: {dados.total}</p>
          <p>Sucesso: {dados.sucesso}</p>
          <p>Falha: {dados.falha}</p>
        </>
      )}
    </div>
  )}
</DataRenderer>
```

### Exemplo 5: Composição com HOC (Higher-Order Component)

```typescript
// Pattern avançado: envolver componentes com funcionalidade extra

interface WithLoadingProps {
  carregando: boolean;
  erro: string | null;
}

function withLoading<P extends WithLoadingProps>(
  Component: React.ComponentType<P>
) {
  return function LoadingComponent(props: P) {
    if (props.carregando) {
      return <div>Carregando...</div>;
    }

    if (props.erro) {
      return <div style={{ color: "red" }}>Erro: {props.erro}</div>;
    }

    return <Component {...props} />;
  };
}

// ========== USO ==========

interface ListaTestes
  extends WithLoadingProps {
  testes: ApiTest[];
}

const ListaTestesComponent = ({ testes }: ListaTestes) => (
  <ul>
    {testes.map((t) => <li key={t.id}>{t.name}</li>)}
  </ul>
);

const ListaTestesComLoading = withLoading(ListaTestesComponent);

// Usar
<ListaTestesComLoading
  testes={[]}
  carregando={true}
  erro={null}
/>
```

### Exemplo 6: Async/Await com TypeScript

```typescript
// Função assíncrona tipada

async function buscarTeste(id: string): Promise<ApiTest> {
  // Simular delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Retornar dados tipados
  return {
    id,
    name: "Teste de exemplo",
    url: "https://api.example.com/test",
    method: "GET",
    headers: [],
    body: "",
    expectedStatusCode: 200,
    maxResponseTime: 500,
    lastStatus: "success",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ✅ Usar com await
const teste = await buscarTeste("1");
console.log(teste.name);  // ✅ Tipado!

// ✅ Usar com .then()
buscarTeste("1").then((teste) => {
  console.log(teste.name);
});

// ✅ Tratar erros
try {
  const teste = await buscarTeste("1");
  console.log(teste);
} catch (erro) {
  if (erro instanceof Error) {
    console.error(erro.message);
  }
}

// ========== EM REACT (useEffect) ==========

function ComponenteTeste() {
  const [teste, setTeste] = useState<ApiTest | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setCarregando(true);
        const dados = await buscarTeste("1");
        setTeste(dados);
        setErro(null);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro desconhecido");
        setTeste(null);
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  if (carregando) return <div>Carregando...</div>;
  if (erro) return <div>Erro: {erro}</div>;
  if (!teste) return <div>Nenhum teste</div>;

  return <div>{teste.name}</div>;
}
```

---

## 📋 Resumo de Conceitos-Chave

### TypeScript

| Conceito | O que é | Exemplo |
|----------|---------|---------|
| **Tipos Primitivos** | Tipos básicos da linguagem | `string`, `number`, `boolean` |
| **Union Types** | Múltiplas opções de tipo | `"success" \| "failed"` |
| **Interfaces** | Contrato de objeto | `interface ApiTest { ... }` |
| **Genéricos** | Tipos reutilizáveis | `<T extends Record<...>>` |
| **Type Guards** | Validações de tipo | `typeof`, `instanceof` |
| **Optional Properties** | Propriedades que podem não existir | `email?: string` |

### React + TypeScript

| Conceito | O que é | Exemplo |
|----------|---------|---------|
| **FC (Functional Component)** | Componente de função | `const Comp: React.FC<Props> = ...` |
| **Props** | Propriedades do componente | `interface MyProps { nome: string }` |
| **useState** | Hook de estado | `const [count, setCount] = useState(0)` |
| **Event Handlers** | Eventos tipados | `onClickHandler: React.MouseEventHandler` |
| **useCallback** | Memoizar funções | `useCallback(() => {...}, [deps])` |

### Next.js

| Conceito | O que é | Exemplo |
|----------|---------|---------|
| **App Router** | Roteamento por pasta | `app/tests/page.tsx` → `/tests` |
| **Server Component** | Renderiza no servidor | Sem "use client" |
| **Client Component** | Renderiza no navegador | Com "use client" no topo |
| **Metadata** | Meta tags HTML | `export const metadata = { ... }` |
| **Dynamic Routes** | URLs parametrizadas | `[id]/page.tsx` |

---

## 🎓 Próximos Passos para Aprofundamento

1. **Estado Global** - Aprender sobre Context API avançada
2. **Performance** - useMemo, useCallback e React.memo
3. **Testing** - Testes com Jest e React Testing Library
4. **API Integration** - Conectar com backend real
5. **Deployment** - Publicar aplicação Next.js

---

## 📚 Referências e Documentações

- [TypeScript Official Docs](https://www.typescriptlang.org/docs/)
- [React TypeScript Docs](https://react-typescript-cheatsheet.netlify.app/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Advanced TypeScript Patterns](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

---

**Desenvolvido com ❤️ para educação em TypeScript e React moderno**

**Projeto: APISentinel - Plataforma de Testes de APIs**
