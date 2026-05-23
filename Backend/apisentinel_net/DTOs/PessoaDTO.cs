// ─────────────────────────────────────────────
// DTOs/PessoaDTO.cs
// ─────────────────────────────────────────────
namespace DTOs;
 
public class PessoaDTO
{
    /// <example>1</example>
    public int Id { get; set; }
 
    /// <example>12345678900</example>
    public long CPF { get; set; }
 
    /// <example>1500</example>
    public int pagamento { get; set; }
}