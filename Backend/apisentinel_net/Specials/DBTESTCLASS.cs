using System;
using Microsoft.Data.SqlClient;

namespace Specials.DB.TestingClass;

class DBTestClass
{
    public void Dbtesting()
    {
        string connectionString = "Server=localhost;Database=SEU_BANCO;Trusted_Connection=True;TrustServerCertificate=True;";

        try
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                Console.WriteLine("Conexão com o banco realizada com sucesso!");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Erro ao conectar no banco:");
            Console.WriteLine(ex.Message);
        }
    }
}