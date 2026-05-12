using DTOs;
using Microsoft.EntityFrameworkCore;

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

    public async Task<List<PessoaDTO>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }
}

