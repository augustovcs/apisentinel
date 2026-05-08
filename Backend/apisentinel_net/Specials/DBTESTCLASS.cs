using System;
using Microsoft.Data.SqlClient;
using System.Configuration;

namespace Specials.DB.TestingClass;

class DBTestClass
{

    private readonly IConfiguration _configuration;

    public DBTestClass(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void ConnDBTesting()
    {

        //string connectionString = "Server=localhost;Database=SEU_BANCO;Trusted_Connection=True;TrustServerCertificate=True;";

        var connectionStringBuilder = _configuration.GetConnectionString("DefaultConnection");

        try
        {
            using (SqlConnection connection = new SqlConnection(connectionStringBuilder))
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