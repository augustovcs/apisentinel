using DTOs;
using Microsoft.VisualBasic;
namespace Services.Consorcio;

using System.Numerics;
using Models;
using Supabase;

public class Consorcio
{

    public readonly Supabase.Client _supabase;

    public Consorcio(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    private  List<PessoaDTO> augusto = new List<PessoaDTO>();

   /* public async Task<List<PessoaDTO>> GetConsorcio()
    {
    
        var response = await _supabase
        .From<PessoaModel>()
        .Get();

        return response.Models.Select(x => new PessoaDTO
        {
            Id = x.Id,
            CPF = x.Cpf,
            pagamento = x.Pagamento
        }).ToList();
     
    }
    */

    public List<PessoaDTO> PostConsorcio(int id_code, long cpf_code, int pag)
    {
        

        augusto.Add(
            new PessoaDTO
            {
                Id = id_code,
                CPF = cpf_code,
                pagamento = pag

            }
        );

        Console.WriteLine($"Adicionado a lista: {cpf_code}");

        return augusto;
    }

    public static Dictionary<string, int> Lara()
    {
        return null;
    }

}