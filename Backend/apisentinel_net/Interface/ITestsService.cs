using DTOs.Dev;


namespace Interface.Dev;

public interface ITestsService
{
    
    public Task<List<TestsDTO>> GetTestsFull();

}