using Models;

namespace DTOs;

public record ClienteResponse(
    int Id,
    string nome,
    int CPF,
    string Email,
    int Telefone,
    int RendaMensal,
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



