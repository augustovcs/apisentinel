using apisentinel_net.DTOs;
using apisentinel_net.Interface;
using General.DTOs;
using Models;
using Supabase;
    
    
namespace apisentinel_net.Services;

public class GeneralConfigsService : IGeneralConfigsService
{
    public readonly Supabase.Client _supabase;

    public GeneralConfigsService(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    public async Task<GeneralConfigsDTO> GetConfigsAsync()
    {
        var response = await _supabase
            .From<GeneralConfigsModel>()
            .Where(x => x.Id == 1)
            .Single();

        var request = new GeneralConfigsDTO()
        {
            Id = response.Id,
            alert_email = response.alert_email,
            api_key = response.api_key,
            default_timeout = response.default_timeout,
            plataform_name = response.plataform_name,
            rate_limit = response.rate_limit
        };

        return request;
    }

    public async Task<GeneralConfigsModel>
        UpdateConfigsAsync(RequestGeneralConfigsDTO proprietes)
    {
        var config = await GetConfigsAsync();

        switch (proprietes)
        {
            case { plataform_name: not null }:
                config.plataform_name = proprietes.plataform_name;
                break;
        }
        
        
    };





}