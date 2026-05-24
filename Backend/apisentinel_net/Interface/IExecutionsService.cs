using DTOs.Dev;

public interface IExecutionsService
{
    public Task<List<ExecutionDTO>> GetExecutionsFull();
    public Task<ExecutionDTO> GetExecutionById(int id);
    public Task<ExecutionDTO> CreateExecution(RequestTestsDTO request);
    public Task<ExecutionDTO> PatchUpdateExecution(RequestUpdateTestsDTO request);
    public Task<bool> DeleteExecutionById(int id);

}