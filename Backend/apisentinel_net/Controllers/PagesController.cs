using Interface.Dev;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace Controllers.Development;

[ApiController]
[Route("pages")]
public class PagesController : ControllerBase
{
    private readonly IPagesRequest _pages;

    public PagesController(IPagesRequest pages)
    {
        _pages = pages;
    }

    /// <summary>
    /// Returns the dashboard payload combining tests and executions.
    /// </summary>
    [HttpGet("dashboard-main")]
    public async Task<IActionResult> GetDashboardMain()
     => Ok(await _pages.GetDashboardMainAsync());
   
}
