namespace DTOs;

public record CriarClienteRequest(
    
    string nome,
    int CPF,
    string Email,
    int RendaMensal,
    int Telefone
    
    
    );


