using DTOs;

namespace Services.Finance;

public class FinancialOperations
{
    // the five methods for financial use
    public decimal soma(decimal n1, decimal n2 )
    {
        return n1 + n2;
    }

    public decimal subtrair(decimal n1, decimal n2)
    {
        return n1 - n2;
    }

    public decimal multiplicar(decimal n1, decimal n2)
    {
        return n1 * n2;
    }

    public decimal SimularPagamento(decimal n1, decimal n2)
    {
        return n1 / n2;
    }

    public decimal Desconto(decimal n1, decimal n2)
    {
        return n1 - (n1 * n2 / 100);
    }

    public int Score(int n1)
    {
        return n1 * 2;
    }

    public async Task<Dictionary<string, decimal>> PostCalcularTudo(decimal n1, decimal n2)
    {
        var resultado = new Dictionary<string, decimal>();
            resultado.Add("somar",soma( n1 , n2));
            resultado.Add("subtrair", subtrair(n1,  n2));
            resultado.Add("multiplicar", multiplicar(n1, n2));
            resultado.Add("SimularPagamento", SimularPagamento( n1, n2));
            resultado.Add("Desconto", Desconto(n1, n2));

            return resultado;
    }
    
    
}