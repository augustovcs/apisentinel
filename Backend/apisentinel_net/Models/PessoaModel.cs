using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
//a
namespace Models
{
    [Table("users_test")]
    public class Cliente : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }

        [Column("Nome")]
        public string Nome { get; set; }

        [Column("CPF")]
        public string CPF { get; set; }
        
        [Column (columnName:"Email")]
        public string Email { get; set; }
        
        [Column(columnName:"Telefone")]
        public string Telefone { get; set; }
        
        [Column(columnName:"Rendamensal")]
        public string RendaMensal { get; set; }
        
        [Column(columnName:"Criado_em")]
        public DateTime CriadoEm { get; set; }

    
    }
}
