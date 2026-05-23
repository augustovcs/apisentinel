// ─────────────────────────────────────────────
// DTOs/FinanceResponseDTO.cs
// ─────────────────────────────────────────────
using Models;
 
namespace DTOs;
 
public record ClienteResponse(
    /// <example>1</example>
    int Id,
 
    /// <example>João Silva</example>
    string nome,
 
    /// <example>12345678900</example>
    int CPF,
 
    /// <example>joao.silva@email.com</example>
    string Email,
 
    /// <example>11999990000</example>
    int Telefone,
 
    /// <example>5000</example>
    int RendaMensal,
 
    /// <example>2024-01-15T10:30:00</example>
    DateTime CriadoEm
)
{
    public static ClienteResponse FromEntity(PessoaModel cliente)
    {
        return new ClienteResponse(
            cliente.Id,
            cliente.Nome,
            cliente.CPF,
            cliente.Email,
            cliente.Telefone,
            cliente.RendaMensal,
            cliente.CriadoEm = DateTime.Now
        );
    }
}