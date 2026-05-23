// ─────────────────────────────────────────────
// DTOs/FinanceRequestDTO.cs
// ─────────────────────────────────────────────
namespace DTOs;
 
public record CriarClienteRequest(
    /// <example>João Silva</example>
    string nome,
 
    /// <example>12345678900</example>
    int CPF,
 
    /// <example>joao.silva@email.com</example>
    string Email,
 
    /// <example>5000</example>
    int RendaMensal,
 
    /// <example>11999990000</example>
    int Telefone
);