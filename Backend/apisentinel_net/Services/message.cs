using DTOs;
using Microsoft.VisualBasic;
namespace Services.Consorcio;


public class Consorcio
{

    Random random_num = new Random();

    private  List<PessoaDTO> augusto = new List<PessoaDTO>();
    public  List<PessoaDTO> Gerarconsorcio()
    {

        foreach(var pessoa in augusto){
            Console.WriteLine($"Nome: {pessoa.Id}");
            Console.WriteLine($"Idade: {pessoa.CPF}");
            Console.WriteLine("----------------");
        }

        return augusto;
    }

    public List<PessoaDTO> PostConsorcio(int id_code, int cpf_code, int pag)
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

}