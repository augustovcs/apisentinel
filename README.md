# ApiSentinel

> ApiSentinel é uma plataforma self-hosted para monitoramento e automação de APIs, com execução de testes, histórico completo de execuções e dashboard em tempo real.

---

## 📌 Visão geral

Este projeto oferece um painel web para criar, editar e executar testes de API, visualizar histórico de execuções e inspecionar detalhes completos de cada request/response.

O backend é implementado em C# com ASP.NET Core e integra Supabase + SQL Server para persistência. O frontend é uma aplicação Next.js em TypeScript com React, usando React Query e componentes customizados.

---

## ✨ Principais recursos

- Criação e edição de testes de API
- Execução manual de testes com persistência do resultado
- Busca e filtros na página de execuções
- Painel de detalhes ao clicar em uma execução, mostrando headers, body e resultado
- Dashboard com métricas e lista de execuções recentes
- Integração com Supabase e SQL Server
- API REST documentada via Swagger

---

## 🏗️ Estrutura do projeto

```
APISentinel/
├── Backend/
│   └── apisentinel_net/           # Backend ASP.NET Core
│       ├── Controllers/           # Endpoints HTTP
│       ├── Services/              # Lógica de negócio
│       │   └── APISENTINEL-DEV/    # Serviços de testes e execuções
│       ├── DTOs/                  # Data Transfer Objects
│       ├── Models/                # Modelos de domínio e banco
│       ├── DbContext/             # EF Core DbContext e migrations
│       ├── Configurations/        # Swagger e configurações
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       └── Program.cs             # Configuração de serviços e pipeline
├── Frontend/                      # Next.js frontend em TypeScript
│   ├── src/
│   │   ├── app/                   # Rotas e páginas do Next.js
│   │   │   └── dashboard/         # Dashboard, testes e execuções
│   │   ├── app/services/          # Chamadas para o backend
│   │   ├── components/            # Componentes UI reutilizáveis
│   │   └── lib/                   # Tipos e utilitários
│   ├── package.json
│   └── tsconfig.json
├── Configs/                       # Configurações extras
├── Frontend/README.md             # Documentação do frontend
└── STUDIES/                       # Anotações e estudos do projeto
```

---

## 📡 Backend API

### Testes

- `POST /tests/create-tests` — cria um novo teste
- `PATCH /tests/update/{id}` — atualiza um teste existente
- `GET /tests/get-tests-full` — lista todos os testes
- `GET /tests/{id}` — obtém um teste por ID
- `DELETE /tests/delete/{id}` — apaga um teste

### Execuções

- `GET /executions/get-executions-full` — lista execuções com métricas
- `POST /executions/run-execution` — executa um teste e salva o resultado
- `GET /executions/{id}` — detalha uma execução específica

### Dashboard

- `GET /pages/dashboard-main` — payload principal para o dashboard

### Documentação

O Swagger fica disponível em modo desenvolvimento com:

- `http://localhost:5199/swagger`

---

## 💻 Tech stack

- Backend: `ASP.NET Core` + `C#`
- Frontend: `Next.js` + `React` + `TypeScript`
- Estado/consulta: `@tanstack/react-query`
- Banco de dados: `SQL Server` via Entity Framework Core
- Integração adicional: `Supabase.Client`
- Estilo: `Tailwind CSS`

---

## ⚙️ Configurações de ambiente

O backend usa as variáveis abaixo no `appsettings.Development.json` ou via variáveis de ambiente:

- `SupabaseUrl`
- `SupabaseKey`
- `ConnectionStrings:DefaultConnection`

O frontend espera o backend em `http://localhost:5199` para as chamadas de execução. Ajuste `Frontend/src/app/services/executionsService.ts` caso a porta seja diferente.

---

## 🚀 Como executar

### Backend

```bash
cd Backend/apisentinel_net
dotnet restore
dotnet build
dotnet run
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

### Acessos

- Frontend: `http://localhost:3000`
- Swagger backend: `http://localhost:5199/swagger`

---

## 📁 Páginas principais

- `/dashboard` — visão geral do dashboard
- `/dashboard/tests` — gerenciamento de testes de API
- `/dashboard/executions` — histórico de execuções com busca, filtros e detalhes
- `/dashboard/settings` — configurações da aplicação (se disponíveis)

---

## 🧩 Onde estender

- Backend: `Backend/apisentinel_net/Services/APISENTINEL-DEV/`
- Frontend: `Frontend/src/app/services/` e `Frontend/src/components/`
- Novas rotas: `Frontend/src/app/dashboard/`

---

## 🛠️ Observações

- A pasta `Configs/` contém configurações auxiliares
- A pasta `STUDIES/` contém documentação de aprendizado e notas de projeto

---

## 📄 Licença

MIT © augustovcs
