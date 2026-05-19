using System.Security.Cryptography;
using Interface.key;
namespace Services.GeneralConfigs;

public class ApiKeyGeneratorService : IApiKeyGeneratorService
{
    public string GenerateApiKey()
    {
        const string prefix = "sk-sentinel-";

        // gera bytes aleatórios seguros
        byte[] randomBytes = RandomNumberGenerator.GetBytes(16);

        // transforma em texto hexadecimal
        string randomString = Convert
            .ToHexString(randomBytes)
            .ToLower();

        // monta chave final
        return $"{prefix}{randomString}";
    }
}