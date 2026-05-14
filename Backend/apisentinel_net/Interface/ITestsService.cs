using DTOs.Dev;


namespace Interface.Dev;

public interface ITestsService
{
    
    public Task<List<TestsDTO>> GetTestsFull();
    public Task<TestsDTO> GetTestsById(int id);


}