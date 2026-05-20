using General.DTOs;
using Interface.general;
using Interface.key;
using Models;
using Supabase;

namespace apisentinel_net.Services;

public class GeneralConfigsService : IGeneralConfigsService
{
    private readonly Supabase.Client _supabase;

    private readonly IApiKeyGeneratorService _apiKeyGenerator;

    public GeneralConfigsService(
        Supabase.Client supabase,
        IApiKeyGeneratorService apiKeyGenerator)
    {
        _supabase = supabase;
        _apiKeyGenerator = apiKeyGenerator;
    }

    public async Task<GeneralConfigsDTO> GetConfigsAsync()
    {
        var response = await _supabase
            .From<GeneralConfigsModel>()
            .Where(x => x.Id == 1)
            .Single();

        if (response == null)
        {
            throw new Exception(
                "configuração não encontrada"
            );
        }

        return new GeneralConfigsDTO
        {
            Id = response.Id,
            plataform_name = response.plataform_name,
            default_timeout = response.default_timeout,
            timezone = response.timezone,
            alert_email = response.alert_email,
            api_key = response.api_key,
            rate_limit = response.rate_limit
        };
    }

    public async Task<GeneralConfigsDTO>
        UpdateConfigsAsync(RequestGeneralConfigsDTO proprietes)
    {
        var config = await _supabase
            .From<GeneralConfigsModel>()
            .Where(x => x.Id == 1)
            .Single();

        if (config == null)
        {
            throw new Exception(
                "configuração não encontrada"
            );
        }

        // platform name
        if (!string.IsNullOrWhiteSpace(
                proprietes.plataform_name))
        {
            config.plataform_name =
                proprietes.plataform_name;
        }

        if (!string.IsNullOrWhiteSpace(proprietes.timezone))
        {
            TimeZoneInfo? tz = null;

            // Tenta IANA (Linux/macOS) e Windows ID
            try { tz = TimeZoneInfo.FindSystemTimeZoneById(proprietes.timezone); }
            catch (TimeZoneNotFoundException)
            {
                // Tenta converter Windows → IANA ou vice-versa (.NET 6+)
                if (!TimeZoneInfo.TryConvertWindowsIdToIanaId(proprietes.timezone, out var ianaId) ||
                    !TimeZoneInfo.TryFindSystemTimeZoneById(ianaId, out tz))
                {
                    throw new Exception("timezone inválida");
                }
            }

            config.timezone = tz.Id; // salva o ID já validado
        }
            
        

        // timeout
        if (proprietes.default_timeout.HasValue)
        {
            if (proprietes.default_timeout < 0)
            {
                throw new Exception(
                    "timeout inválido"
                );
            }

            config.default_timeout =
                proprietes.default_timeout.Value;
        }

        // email
        if (!string.IsNullOrWhiteSpace(
                proprietes.alert_email))
        {
            try
            {
                var email = new System.Net.Mail.MailAddress(
                    proprietes.alert_email
                );

                config.alert_email =
                    proprietes.alert_email;
            }
            catch
            {
                throw new Exception(
                    "email inválido"
                );
            }
        }

        // regenerate api key
        if (proprietes.GenerateNewApiKey == true)
        {
            config.api_key =
                _apiKeyGenerator.GenerateApiKey();
        }

        // rate limit
        if (proprietes.rate_limit.HasValue)
        {
            if (proprietes.rate_limit < 0)
            {
                throw new Exception(
                    "rate limit inválido"
                );
            }

            config.rate_limit =
                proprietes.rate_limit.Value;
        }

        // salva no banco
        await config.Update<GeneralConfigsModel>();

        return new GeneralConfigsDTO
        {
            Id = config.Id,
            plataform_name = config.plataform_name,
            default_timeout = config.default_timeout,
            timezone = config.timezone,
            alert_email = config.alert_email,
            api_key = config.api_key,
            rate_limit = config.rate_limit
        };
    }

    public async Task<string> RegenerateApiKey()
    {
        var config = await _supabase
            .From<GeneralConfigsModel>()
            .Where(x => x.Id == 1)
            .Single();

        if (config == null)
        {
            throw new Exception(
                "configuração não encontrada"
            );
        }

        config.api_key =
            _apiKeyGenerator.GenerateApiKey();

        await config.Update<GeneralConfigsModel>();

        return config.api_key;
    }
}