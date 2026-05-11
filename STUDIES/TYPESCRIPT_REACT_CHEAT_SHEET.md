# 💡 TypeScript + React: Cheat Sheet Prático

## Exemplos Prontos para Copiar, Colar e Usar

**Nível:** Intermediário  
**Uso:** Referência rápida para snippets  
**Tempo:** 30-45 minutos para explorar

---

## 🚀 Índice Rápido

1. [Setup Inicial](#setup-inicial)
2. [Tipos Essenciais](#tipos-essenciais)
3. [Components Comuns](#components-comuns)
4. [Hooks Úteis](#hooks-úteis)
5. [Padrões de Formulário](#padrões-de-formulário)
6. [Padrões de API](#padrões-de-api)
7. [Erros Comuns e Soluções](#erros-comuns-e-soluções)
8. [Atalhos de Produtividade](#atalhos-de-produtividade)

---

## 📦 Setup Inicial

### Criar novo projeto Next.js com TypeScript

```bash
# ✅ Usar template oficial
npx create-next-app@latest my-app --typescript

# ✅ Ou clonar projeto existente
git clone <repo>
cd Frontend
npm install

# ✅ Rodar em desenvolvimento
npm run dev
# Acessa http://localhost:3000
```

### Estrutura de pastas recomendada

```
src/
├── app/                      # Pages (App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── feature/
│   │   └── page.tsx
│   └── feature/[id]/
│       └── page.tsx
├── components/               # Components reutilizáveis
│   ├── ui/                  # Componentes base (Button, Input, etc)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── feature/             # Componentes específicos de feature
│   │   ├── FeatureForm.tsx
│   │   └── FeatureList.tsx
│   └── layout/              # Componentes de layout
│       ├── Header.tsx
│       └── Sidebar.tsx
├── lib/                      # Utilitários
│   ├── types.ts             # Type definitions
│   ├── api.ts               # API client
│   ├── utils.ts             # Helper functions
│   └── hooks.ts             # Custom hooks
└── styles/                   # CSS global
    └── globals.css
```

---

## 🎯 Tipos Essenciais

### Tipos Primitivos Mais Usados

```typescript
// String
const nome: string = "João";
const mensagem: `Olá, ${string}!` = `Olá, João!`;  // Template literal type

// Number
const idade: number = 30;
const taxa: number = 0.15;

// Boolean
const ativo: boolean = true;

// Array
const numeros: number[] = [1, 2, 3];
const strings: Array<string> = ["a", "b"];
const misto: (string | number)[] = ["texto", 42];

// Tuple (tamanho e tipos fixos)
const coordenada: [number, number] = [10, 20];
const resposta: [status: number, dados: string] = [200, '{"ok": true}'];

// Any (EVITAR!)
const qualquerCoisa: any = "pode ser qualquer coisa";

// Unknown (alternativa segura)
const desconhecido: unknown = JSON.parse('{}');
// Precisa fazer type guard antes de usar
if (typeof desconhecido === 'object') {
  // agora é seguro
}

// Null e Undefined
const vazio: null = null;
const naoDefinido: undefined = undefined;

// Never (tipo que nunca retorna)
function lancaErro(): never {
  throw new Error("sempre lança");
}
```

### Tipos de Dados Complexos

```typescript
// Union Type (uma de várias opções)
type Status = "pending" | "success" | "error";
const status: Status = "success";  // ✅
// const status: Status = "invalid"; // ❌ Erro

// Intersection Type (combinação de tipos)
type Admin = { isAdmin: true } & { permissions: string[] };
const admin: Admin = {
  isAdmin: true,
  permissions: ["read", "write", "delete"]
};

// Record (mapa tipado)
type ColorScheme = Record<"light" | "dark", { bg: string; text: string }>;
const colors: ColorScheme = {
  light: { bg: "#fff", text: "#000" },
  dark: { bg: "#000", text: "#fff" }
};

// Readonly (imutável)
type ImmutableArray = readonly string[];
const arr: ImmutableArray = ["a", "b"];
// arr[0] = "c"; // ❌ Erro - readonly

// Optional Properties
type Usuario = {
  nome: string;
  email?: string;         // pode ser undefined
  telefone?: string | null;  // pode ser string, null, ou undefined
};

// Conditional Type (tipo baseado em condição)
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">;  // true
type B = IsString<123>;      // false

// Mapped Type (criar novos tipos a partir de existentes)
type ReadonlyVersion<T> = {
  readonly [K in keyof T]: T[K];
};

type User = { id: number; name: string };
type ReadonlyUser = ReadonlyVersion<User>;
// É igual a: { readonly id: number; readonly name: string }
```

### Interface vs Type - Exemplos Práticos

```typescript
// ========== INTERFACE ==========
// ✅ Use para: objetos que serão implementados/estendidos
// ✅ Permite declaração múltipla (merge)
// ✅ Melhor para contratos

interface Animal {
  nome: string;
  idade: number;
}

interface Animal {  // ✅ Merge automático
  som: () => string;
}

interface Cachorro extends Animal {  // ✅ Extensão simples
  raca: string;
}

// ========== TYPE ==========
// ✅ Use para: dados, unions, tuples, primitivos
// ✅ Mais flexível
// ❌ Não permite declaração múltipla

type Numero = number;
type StringOuNumero = string | number;
type Tupla = [string, number];

type Gato = {
  nome: string;
  idade: number;
} & { som: () => string };  // ✅ Intersection

// ========== PRÁTICA NO PROJETO ==========

// Dados que vêm de API
interface ApiTest {
  id: string;
  name: string;
}

// Variações especializadas
type CreateTestInput = Omit<ApiTest, "id">;
type UpdateTestInput = Partial<ApiTest>;

// Union de tipos
type TestData = ApiTest | CreateTestInput | UpdateTestInput;

// Callback
type OnTestSelect = (test: ApiTest) => void;
```

---

## 🎨 Components Comuns

### Componente Button Reutilizável

```typescript
// 📄 src/components/ui/Button.tsx

"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-black hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
};

const sizeStyles = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantStyles[variant]} ${sizeStyles[size]} rounded transition`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}

// ========== USO ==========
<Button variant="primary" size="md" onClick={() => console.log("clicado")}>
  Enviar
</Button>
```

### Componente Input Tipado

```typescript
// 📄 src/components/ui/Input.tsx

"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
      {helperText && <span className="text-sm text-gray-500">{helperText}</span>}
    </div>
  );
}

// ========== USO ==========
<Input
  type="email"
  label="Email"
  placeholder="seu@email.com"
  error={errors.email}
  helperText="Usaremos para enviar notificações"
/>
```

### Componente Card Simples

```typescript
// 📄 src/components/ui/Card.tsx

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`border rounded-lg p-4 shadow-sm ${className}`}>
      {title && <h3 className="font-bold mb-3">{title}</h3>}
      {children}
    </div>
  );
}

// ========== USO ==========
<Card title="Informações">
  <p>Conteúdo do card</p>
</Card>
```

### Componente Loading Skeleton

```typescript
// 📄 src/components/ui/Skeleton.tsx

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function Skeleton({
  width = "100%",
  height = "1rem",
  className = ""
}: SkeletonProps) {
  return (
    <div
      style={{ width, height }}
      className={`bg-gray-300 rounded animate-pulse ${className}`}
    />
  );
}

// ========== USO ==========
<Skeleton width="200px" height="20px" />
```

---

## 🎣 Hooks Úteis

### Hook Customizado: useAsync

```typescript
// 📄 src/lib/hooks.ts

import { useState, useEffect } from "react";

interface UseAsyncOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => Promise<void>;
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(options.initialData ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fn();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    execute();
  }, deps);

  return { data, loading, error, retry: execute };
}

// ========== USO ==========

interface Usuario {
  id: string;
  nome: string;
}

const { data: usuarios, loading, error } = useAsync<Usuario[]>(
  async () => {
    const res = await fetch("/api/usuarios");
    return res.json();
  },
  [],
  {
    onSuccess: (dados) => console.log("Carregado:", dados),
    onError: (erro) => console.error("Erro:", erro)
  }
);

if (loading) return <div>Carregando...</div>;
if (error) return <div>Erro: {error.message}</div>;
if (!usuarios) return <div>Sem dados</div>;

return (
  <ul>
    {usuarios.map((u) => (
      <li key={u.id}>{u.nome}</li>
    ))}
  </ul>
);
```

### Hook Customizado: useForm

```typescript
// 📄 src/lib/hooks.ts

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Record<string, string>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Limpar erro ao editar
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar
    if (validate) {
      const newErrors = validate(values);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    // Submeter
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setFieldError,
    handleSubmit,
    resetForm
  };
}

// ========== USO ==========

interface LoginForm {
  email: string;
  password: string;
}

const form = useForm<LoginForm>({
  initialValues: { email: "", password: "" },
  validate: (values) => {
    const errors: Record<string, string> = {};
    if (!values.email) errors.email = "Email é obrigatório";
    if (!values.password) errors.password = "Senha é obrigatória";
    return errors;
  },
  onSubmit: async (values) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(values)
    });
    if (!res.ok) throw new Error("Login falhou");
  }
});

return (
  <form onSubmit={form.handleSubmit}>
    <Input
      type="email"
      value={form.values.email}
      onChange={(e) => form.setValue("email", e.target.value)}
      error={form.errors.email}
    />
    <Input
      type="password"
      value={form.values.password}
      onChange={(e) => form.setValue("password", e.target.value)}
      error={form.errors.password}
    />
    <Button type="submit" isLoading={form.isSubmitting}>
      Entrar
    </Button>
  </form>
);
```

### Hook Customizado: useDebounce

```typescript
// 📄 src/lib/hooks.ts

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ========== USO ==========

const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearchTerm) {
    // Fazer busca apenas após 500ms sem digitação
    fetch(`/api/search?q=${debouncedSearchTerm}`);
  }
}, [debouncedSearchTerm]);

return (
  <input
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Buscar..."
  />
);
```

### Hook Customizado: useLocalStorage

```typescript
// 📄 src/lib/hooks.ts

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// ========== USO ==========

const [tema, setTema] = useLocalStorage<"light" | "dark">("tema", "light");

return (
  <button onClick={() => setTema(tema === "light" ? "dark" : "light")}>
    Tema atual: {tema}
  </button>
);
```

---

## 📋 Padrões de Formulário

### Formulário Simples com Validação

```typescript
// 📄 src/components/ContactForm.tsx

"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Mensagem é obrigatória";
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Enviar dados
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      }
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }
  };

  if (submitted) {
    return <div className="text-green-600">Mensagem enviada com sucesso!</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <div>
        <label className="block text-sm font-semibold mb-1">Mensagem</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.message ? "border-red-500" : "border-gray-300"
          }`}
          rows={4}
        />
        {errors.message && (
          <span className="text-sm text-red-500">{errors.message}</span>
        )}
      </div>

      <Button type="submit" variant="primary">
        Enviar
      </Button>
    </form>
  );
}
```

### Formulário com Array Dinâmico

```typescript
// 📄 src/components/DynamicForm.tsx

interface ItemForm {
  id: string;
  name: string;
  value: string;
}

export default function DynamicForm() {
  const [items, setItems] = useState<ItemForm[]>([
    { id: "1", name: "Item 1", value: "" }
  ]);

  const addItem = () => {
    const newId = Math.random().toString();
    setItems([...items, { id: newId, name: `Item ${items.length + 1}`, value: "" }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: "name" | "value", newValue: string) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, [field]: newValue } : item
    ));
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2">
          <Input
            value={item.name}
            onChange={(e) => updateItem(item.id, "name", e.target.value)}
            placeholder="Nome"
          />
          <Input
            value={item.value}
            onChange={(e) => updateItem(item.id, "value", e.target.value)}
            placeholder="Valor"
          />
          <Button
            variant="danger"
            onClick={() => removeItem(item.id)}
          >
            Remover
          </Button>
        </div>
      ))}

      <Button onClick={addItem} variant="secondary">
        + Adicionar Item
      </Button>
    </div>
  );
}
```

---

## 🌐 Padrões de API

### API Client Tipado

```typescript
// 📄 src/lib/api.ts

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number = 30000;  // 30 segundos

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

    try {
      const response = await fetch(url, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: `HTTP ${response.status}`
          }
        };
      }

      const data: T = await response.json();
      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: {
              code: "TIMEOUT",
              message: "Requisição expirou"
            }
          };
        }

        return {
          success: false,
          error: {
            code: "NETWORK_ERROR",
            message: error.message
          }
        };
      }

      return {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: "Erro desconhecido"
        }
      };
    }
  }

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PATCH", body });
  }
}

export const api = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000");

// ========== USO ==========

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

// GET
const response = await api.get<Usuario>("/api/usuarios/1");
if (response.success && response.data) {
  console.log(response.data.nome);
}

// POST
const createResponse = await api.post<Usuario>("/api/usuarios", {
  nome: "João",
  email: "joao@example.com"
});

// PUT
const updateResponse = await api.put<Usuario>("/api/usuarios/1", {
  nome: "João Silva"
});

// DELETE
await api.delete("/api/usuarios/1");
```

### Usando API Client em Componente

```typescript
// 📄 src/components/UsuariosList.tsx

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get<Usuario[]>("/api/usuarios");

        if (response.success && response.data) {
          setUsuarios(response.data);
        } else {
          setError(response.error?.message || "Erro ao carregar usuários");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-600">Erro: {error}</div>;

  return (
    <ul>
      {usuarios.map((usuario) => (
        <li key={usuario.id}>
          {usuario.nome} - {usuario.email}
        </li>
      ))}
    </ul>
  );
}
```

---

## ⚠️ Erros Comuns e Soluções

### Erro 1: "Cannot find module"

```typescript
// ❌ Errado - caminhos relativos confusos
import { Button } from "../../../components/ui/Button";

// ✅ Correto - usar alias
import { Button } from "@/components/ui/Button";

// Verificar tsconfig.json:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Erro 2: "Property does not exist"

```typescript
// ❌ Errado - TypeScript não sabe o tipo
const handleChange = (e: any) => {
  console.log(e.target.value);  // ❌ 'any' não tem validação
};

// ✅ Correto - tipo específico
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.currentTarget.value);  // ✅ Tipado!
};
```

### Erro 3: "Cannot use client hook"

```typescript
// ❌ Errado - usando useState sem "use client"
export default function MyComponent() {
  const [count, setCount] = useState(0);  // ❌ Erro!
  return <div>{count}</div>;
}

// ✅ Correto
"use client";

import { useState } from "react";

export default function MyComponent() {
  const [count, setCount] = useState(0);  // ✅ Ok!
  return <div>{count}</div>;
}
```

### Erro 4: "Type is not assignable"

```typescript
// ❌ Errado - tipo não matches
type Status = "success" | "error";
const status: Status = "pending";  // ❌ 'pending' não é Status

// ✅ Correto
type Status = "success" | "error" | "pending";
const status: Status = "pending";  // ✅ Ok!

// ✅ Ou adicionar na union
const status: Status | "pending" = "pending";  // ✅ Ok!
```

### Erro 5: "Null or undefined" reference

```typescript
// ❌ Errado - pode ser null
const usuario: Usuario | null = null;
console.log(usuario.nome);  // ❌ Error: possibly null

// ✅ Correto - validar primeiro
if (usuario !== null) {
  console.log(usuario.nome);  // ✅ Ok!
}

// ✅ Ou usar optional chaining
console.log(usuario?.nome);  // ✅ Ok! (undefined se null)

// ✅ Ou usar nullish coalescing
console.log(usuario?.nome ?? "Sem nome");  // ✅ Ok!
```

---

## ⚡ Atalhos de Produtividade

### Snippets VS Code

```json
// 📄 .vscode/snippets.json

{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "\"use client\";",
      "",
      "interface ${1:ComponentName}Props {",
      "  children?: React.ReactNode;",
      "}",
      "",
      "export default function ${1:ComponentName}({ children }: ${1:ComponentName}Props) {",
      "  return <div>{children}</div>;",
      "}"
    ]
  },

  "TypeScript Interface": {
    "prefix": "tsi",
    "body": [
      "interface ${1:InterfaceName} {",
      "  ${2:property}: ${3:type};",
      "}"
    ]
  },

  "useEffect Hook": {
    "prefix": "uef",
    "body": [
      "useEffect(() => {",
      "  ${1:// effect}",
      "}, [${2:deps}]);"
    ]
  },

  "useState Hook": {
    "prefix": "ust",
    "body": [
      "const [${1:state}, set${1/(.*)/${1|capitalize}/}] = useState<${2:type}>(${3:initialValue});"
    ]
  }
}
```

### Comandos Úteis do Terminal

```bash
# Criar novo projeto Next.js
npx create-next-app@latest my-app --typescript

# Rodar em desenvolvimento
npm run dev
# Acessa http://localhost:3000

# Build para produção
npm run build

# Checar erros TypeScript
npx tsc --noEmit

# Formatar código (Prettier)
npm run format

# Lint (ESLint)
npm run lint

# Limpar cache e reinstalar
rm -rf node_modules .next
npm install

# Analisar bundle
npm run build && npm run analyze
```

### Regras de Ouro

```typescript
// 1️⃣ Sempre tipar props
interface ButtonProps { variant: string }  // ✅ Ok
interface ButtonProps { variant: "primary" | "secondary" }  // ✅ Melhor!

// 2️⃣ Evitar 'any' a todo custo
const x: any = "pode ser qualquer coisa";  // ❌ Nunca
const x: unknown = "pode ser qualquer coisa";  // ✅ Melhor

// 3️⃣ Usar const assertions para valores literais
const METHODS = ["GET", "POST"] as const;  // ✅ "GET" | "POST"
type Method = typeof METHODS[number];  // type Method = "GET" | "POST"

// 4️⃣ Importar types separadamente
import type { User } from "@/types";  // ✅ Removed em build
import { userService } from "@/services";  // ❌ Mantém em build

// 5️⃣ Usar readonly para dados imutáveis
const config: readonly string[] = ["a", "b"];  // ✅ Não pode modificar
const config: string[] = ["a", "b"];  // ❌ Pode modificar
```

---

**Você agora tem um cheat sheet completo para referência rápida!** 🎉

Use-o sempre que precisar lembrar sintaxe ou padrões específicos.
