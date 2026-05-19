using General.DTOs;

namespace Interface.general;

public interface IGeneralConfigsService
{
    Task<GeneralConfigsDTO> GetConfigsAsync();

    Task<GeneralConfigsDTO> UpdateConfigsAsync(
        RequestGeneralConfigsDTO proprietes
    );

    Task<string> RegenerateApiKey();
}