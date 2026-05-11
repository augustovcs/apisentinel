using DTOs;
using Interface;
using Models;

namespace Services.Finance;
using Supabase;

public class ClienteService
{
    public readonly Supabase.Client _supabase;

    public ClienteService(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    public async Task<ClienteResponse> CriarAsync(CriarClienteRequest request)
    {
        var cliente = new Cliente
        {
            Id = Guid.NewGuid(),
            nome = request.nome,
            CPF = request.CPF,
            Email = request.Email,
            Telefone = request.Telefone,
            RendaMensal = request.RendaMensal,
            CriadoEm = DateTime.UtcNow
        };
        await _supabase.From<Cliente>().Insert(cliente);

        return new ClienteResponse(
            cliente.Id,
            cliente.nome,
            cliente.CPF,
            cliente.Email,
            cliente.Telefone,
            cliente.RendaMensal,
            cliente.CriadoEm
        );
    }



}
    
