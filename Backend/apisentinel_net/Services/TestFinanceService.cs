using DTOs;
using Interface;
using Models;

namespace Services.Finance;

using System.Diagnostics.CodeAnalysis;
using System.Xml.XPath;
using Supabase;

public class ClienteService : IFinanceService
{
    public readonly Supabase.Client _supabase;

    public ClienteService(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    public decimal somar(decimal n1, decimal n2)
    {

        //nao foi implementado o metodo ainda
        throw new NotImplementedException();

    }


    public async Task<ClienteResponse> CriarAsync(CriarClienteRequest request)
    {

        var cliente = new PessoaModel
        {
            
            Nome = request.nome,
            CPF = request.CPF,
            Email = request.Email,
            Telefone = request.Telefone,
            RendaMensal = request.RendaMensal,
            CriadoEm = DateTime.Now
            
        };

        await _supabase.From<PessoaModel>()
        .Insert(cliente);

        
        //MAPEADO PRA FACILITAR O RETURN NE PRORRAAAAAAAAAAA
        return ClienteResponse.FromEntity(cliente);
        
    }



}
    
