using System.Formats.Asn1;
using Services.Consorcio;
using DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Controllers.Development;

[ApiController]
[Route("[controller]")]
public class PessoaController : ControllerBase
{

    public readonly Consorcio _consorcio;
    public PessoaController(Consorcio consorcio)
    {
        _consorcio = consorcio;
    }


    [HttpGet("/Pessoa")]
    public async Task<IActionResult> search()
    {
        
        var gerarAlgo = await _consorcio.GetConsorcio();

        return Ok(gerarAlgo);
    }


    [HttpPost("/postconsorcio")]
    public IActionResult PostConsorcio([FromBody]PessoaDTO pessoa)
    {

        var SendPost = _consorcio.PostConsorcio(pessoa.Id, pessoa.CPF, pessoa.pagamento);


        return Ok(SendPost);
    }

}
