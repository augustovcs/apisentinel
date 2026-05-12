using apisentinel_net.Migrations;
using DTOs;
using Microsoft.EntityFrameworkCore;
using DBConn;


namespace Services.UserService;

public class UserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }


    public async Task CreateUser(PessoaDTO user)
    {
        _context.Users.Add(user);

        await _context.SaveChangesAsync();
    
    }


    public PessoaDTO CreateUser2(PessoaDTO user2)
    {

        _context.Users.Add(user2);
        _context.SaveChanges(); 

        return user2;

    }

    public PessoaDTO CreateUser3(PessoaDTO user2)
    {
        
        var init = new PessoaDTO
        {
             CPF = user2.CPF,
             Id = user2.pagamento,
             pagamento = user2.pagamento
        };

        _context.Users.Add(init);
        _context.SaveChanges(); 

        return init;
    }


    public async Task<List<PessoaDTO>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }
}

