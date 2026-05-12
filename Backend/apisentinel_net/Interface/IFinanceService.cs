using DTOs;

namespace Interface;

public interface IFinanceService
{
    public Task<ClienteResponse> CriarAsync(CriarClienteRequest request);


}