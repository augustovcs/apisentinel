using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
//a
namespace Models
{
    [Table("users_test")]
    public class PessoaModel : BaseModel
    {
        [PrimaryKey("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Nome { get; set; }

        [Column("cpf")]
        public int CPF { get; set; }
        
        [Column ("email")]
        public string Email { get; set; }
        
        [Column("phone")]
        public int Telefone { get; set; }
        
        [Column("renda_mensal")]
        public int RendaMensal { get; set; }
        
        [Column("created_at")]
        public DateTime CriadoEm { get; set; }

    
    }
}
