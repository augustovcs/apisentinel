using DTOs.Dev;

namespace Interface.Dev;

public interface IExecutionsService
{
    public Task<List<ResponseExecutionDTO>> GetExecutionsFull();
    public Task<ResponseExecutionDTO> GetExecutionById(int id);
    public Task<ResponseExecutionDTO> CreateExecution(RequestExecutionDTO request);
    public Task<ResponseExecutionDTO> PatchUpdateExecution(RequestExecutionDTO request);
    public Task<bool> DeleteExecutionById(int id);

}