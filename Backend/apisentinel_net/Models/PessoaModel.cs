using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
//a
namespace Models
{
    [Table("users_test")]
    public class PessoaModel : BaseModel
    {
        [PrimaryKey("id", false)]
        public int Id { get; set; }

        [Column("cpf")]
        public int Cpf { get; set; }

        [Column("pagamento")]
        public int Pagamento { get; set; }

    
    }
}
