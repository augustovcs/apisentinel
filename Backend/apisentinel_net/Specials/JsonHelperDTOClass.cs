using System.Text.Json;

public static class JsonHelper
{
    public static object Normalize(object value)
    {
        if (value is JsonElement element)
        {
            return ConvertElement(element);
        }

        return value;
    }

    private static object ConvertElement(JsonElement element)
    {
        return element.ValueKind switch
        {
            JsonValueKind.String => element.GetString(),
            JsonValueKind.Number => element.GetDecimal(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Object => element.EnumerateObject()
                .ToDictionary(
                    p => p.Name,
                    p => ConvertElement(p.Value)
                ),
            JsonValueKind.Array => element.EnumerateArray()
                .Select(ConvertElement)
                .ToList(),
            JsonValueKind.Null => null,
            _ => element.ToString()
        };
    }
}