namespace DTOs;

public record CriarClienteRequest(
    string nome,
    string CPF,
    string Email,
    string RendaMensal,
    string Telefone
    
    );