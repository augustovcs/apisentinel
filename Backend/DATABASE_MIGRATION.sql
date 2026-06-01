-- ============================================
-- APISentinel - Database Migration Script
-- ============================================
-- Execute este script no seu banco de dados Supabase
-- para criar as tabelas necessárias para as novas funcionalidades

-- ============================================
-- 1. Tabela: schedules
-- Descrição: Agendamentos de testes para execução recorrente
-- ============================================
CREATE TABLE IF NOT EXISTS public.schedules (
  id BIGSERIAL PRIMARY KEY,
  test_id BIGINT NOT NULL,
  interval_seconds INTEGER NOT NULL CHECK (interval_seconds > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  next_execution_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name VARCHAR(255),
  description TEXT,
  
  -- Foreign key constraint
  CONSTRAINT fk_schedules_test_id 
    FOREIGN KEY (test_id) 
    REFERENCES public.tests(id) 
    ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_schedules_test_id ON public.schedules(test_id);
CREATE INDEX IF NOT EXISTS idx_schedules_is_active ON public.schedules(is_active);
CREATE INDEX IF NOT EXISTS idx_schedules_created_at ON public.schedules(created_at DESC);

-- RLS Policy (Row Level Security) - Opcional, se usar autenticação
-- ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. Tabela: execution_logs
-- Descrição: Logs detalhados de cada execução de teste
-- ============================================
CREATE TABLE IF NOT EXISTS public.execution_logs (
  id BIGSERIAL PRIMARY KEY,
  execution_id BIGINT NOT NULL,
  test_id BIGINT NOT NULL,
  schedule_id BIGINT,
  status VARCHAR(50) NOT NULL CHECK (status IN ('processing', 'success', 'failed', 'timeout')),
  message TEXT,
  response_time INTEGER,
  status_code INTEGER,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  test_name VARCHAR(255),
  url TEXT,
  method VARCHAR(10),
  
  -- Foreign key constraints
  CONSTRAINT fk_execution_logs_execution_id 
    FOREIGN KEY (execution_id) 
    REFERENCES public.executions(id) 
    ON DELETE CASCADE,
  CONSTRAINT fk_execution_logs_test_id 
    FOREIGN KEY (test_id) 
    REFERENCES public.tests(id) 
    ON DELETE CASCADE,
  CONSTRAINT fk_execution_logs_schedule_id 
    FOREIGN KEY (schedule_id) 
    REFERENCES public.schedules(id) 
    ON DELETE SET NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_execution_logs_test_id ON public.execution_logs(test_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_schedule_id ON public.execution_logs(schedule_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_status ON public.execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_execution_logs_created_at ON public.execution_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_execution_logs_execution_id ON public.execution_logs(execution_id);

-- Índice composto para queries com múltiplos filtros
CREATE INDEX IF NOT EXISTS idx_execution_logs_test_status_date 
  ON public.execution_logs(test_id, status, created_at DESC);

-- RLS Policy (Row Level Security) - Opcional, se usar autenticação
-- ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Views para Analytics (Opcional)
-- ============================================

-- View: Resumo de Execuções
CREATE OR REPLACE VIEW public.v_execution_summary AS
SELECT
  COUNT(*) as total_executions,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_executions,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_executions,
  COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_executions,
  ROUND(AVG(CAST(response_time AS NUMERIC)), 2) as avg_response_time,
  ROUND(
    COUNT(CASE WHEN status = 'success' THEN 1 END)::NUMERIC / COUNT(*) * 100,
    2
  ) as success_rate,
  MAX(created_at) as last_execution
FROM public.execution_logs;

-- View: Execuções por Status (últimas 24h)
CREATE OR REPLACE VIEW public.v_executions_by_status_24h AS
SELECT
  status,
  COUNT(*) as count,
  ROUND(AVG(CAST(response_time AS NUMERIC)), 2) as avg_response_time
FROM public.execution_logs
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY status
ORDER BY count DESC;

-- View: Top 10 Testes mais executados
CREATE OR REPLACE VIEW public.v_top_tests AS
SELECT
  test_name,
  COUNT(*) as execution_count,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as success_count,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
  ROUND(AVG(CAST(response_time AS NUMERIC)), 2) as avg_response_time
FROM public.execution_logs
GROUP BY test_name
ORDER BY execution_count DESC
LIMIT 10;

-- View: Tendência diária (últimos 30 dias)
CREATE OR REPLACE VIEW public.v_execution_trend_30d AS
SELECT
  DATE(created_at) as execution_date,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as success_count,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
  COUNT(CASE WHEN status = 'timeout' THEN 1 END) as timeout_count,
  ROUND(AVG(CAST(response_time AS NUMERIC)), 2) as avg_response_time,
  COUNT(*) as total_executions
FROM public.execution_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY execution_date DESC;

-- ============================================
-- 4. Triggers (Opcional - para atualizar timestamps)
-- ============================================

-- Trigger para atualizar updated_at em schedules
CREATE OR REPLACE FUNCTION update_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schedules_updated_at
BEFORE UPDATE ON public.schedules
FOR EACH ROW
EXECUTE FUNCTION update_schedules_updated_at();

-- Trigger para atualizar updated_at em execution_logs
CREATE OR REPLACE FUNCTION update_execution_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_execution_logs_updated_at
BEFORE UPDATE ON public.execution_logs
FOR EACH ROW
EXECUTE FUNCTION update_execution_logs_updated_at();

-- ============================================
-- 5. Grants (Se necessário para permissões)
-- ============================================

-- Uncomment if you need to grant permissions to a specific role
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedules TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.execution_logs TO authenticated;

-- ============================================
-- Fim da Migração
-- ============================================
-- Se tudo correu bem, as tabelas estão prontas para uso!
-- Faça um SELECT nas views para validar os dados:
-- SELECT * FROM v_execution_summary;
-- SELECT * FROM v_executions_by_status_24h;
-- SELECT * FROM v_top_tests;
-- SELECT * FROM v_execution_trend_30d;
