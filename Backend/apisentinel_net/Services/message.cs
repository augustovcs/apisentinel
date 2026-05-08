using DTOs;
namespace Services.Consorcio;

public class Consorcio
{
    private List<PessoaDTO> augusto = new List<PessoaDTO>();
    public  void Gerarconsorcio()
    {
        augusto.Add(new PessoaDTO
        {
            Id = 90919292,
            CPF = 123,
            pagamento = 400
        });
        
    }
}