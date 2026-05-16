using DTOs.Dev;


namespace Interface.Dev;

public interface ITestsService
{
    
    public Task<List<TestsDTO>> GetTestsFull();
    public Task<TestsDTO> GetTestsById(int id);
    public Task<TestsDTO> CreateTest(RequestTestsDTO request);
    public Task<TestsDTO> PatchUpdateTest(RequestTestsDTO request);

}