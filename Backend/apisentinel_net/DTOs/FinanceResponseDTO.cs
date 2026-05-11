using Models;

namespace DTOs;

public record ClienteResponse(
    Guid Id,
    string nome,
    string CPF,
    string Email,
    string Telefone,
    string RendaMensal,
    DateTime CriadoEm
){

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

