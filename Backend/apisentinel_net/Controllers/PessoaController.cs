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
    [HttpGet("/Pessoa")]
    public ActionResult<List<PessoaDTO>> search()
    {
        var maoru = new Consorcio();
        var gerarAlgo = maoru.Gerarconsorcio();

        return Ok(gerarAlgo);
    }

}
