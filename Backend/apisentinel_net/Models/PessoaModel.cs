using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
//a
namespace Models
{
    [Table("users_test")]
    public class PessoaModel : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }

        [Column("name")]
        public string Nome { get; set; }

        [Column("cpf")]
        public string CPF { get; set; }
        
        [Column ("email")]
        public string Email { get; set; }
        
        [Column("phone")]
        public string Telefone { get; set; }
        
        [Column("renda_mensal")]
        public string RendaMensal { get; set; }
        
        [Column("created_at")]
        public DateTime CriadoEm { get; set; }

    
    }
}
