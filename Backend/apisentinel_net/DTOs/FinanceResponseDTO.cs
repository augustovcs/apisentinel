namespace DTOs;

public record ClienteResponse(
    Guid Id,
    string nome,
    string CPF,
    string Email,
    string Telefone,
    string RendaMensal,
    DateTime CriadoEm
);