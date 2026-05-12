using DTOs;
using Microsoft.EntityFrameworkCore;

namespace DBConn;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {

    }

    public DbSet<PessoaDTO> Users { get; set; }
    
}