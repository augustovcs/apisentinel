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


    /*
     * Cria um novo usuário de forma assíncrona no banco de dados.
     * Este método é a abordagem RECOMENDADA para criar usuários em cenários com alta concorrência.
     * 
     * Parâmetros:
     * - user: Objeto PessoaDTO contendo os dados do usuário a ser criado (CPF, pagamento, etc.)
     * 
     * Retorno:
     * - Uma tarefa assíncrona que é concluída quando o usuário é salvo no banco de dados
     * 
     * Funcionamento:
     * 1. Recebe um PessoaDTO com os dados do novo usuário
     * 2. Adiciona o objeto à coleção Users do DbContext (apenas na memória)
     * 3. Executa await _context.SaveChangesAsync() para persistir os dados no banco de forma assíncrona
     * 
     * Vantagens:
     * - Não bloqueia a thread enquanto aguarda o banco de dados
     * - Melhor performance em aplicações web com muitas requisições simultâneas
     * - Segue as boas práticas de desenvolvimento assíncrono
     * 
     * Quando usar:
     * - Em controllers e endpoints da API
     * - Quando você pode aguardar de forma assíncrona (async/await)
     * - Em cenários com alta concorrência
     */
     
    public async Task CreateUser(PessoaDTO user)
    {
        _context.Users.Add(user);

        await _context.SaveChangesAsync();
    
    }


    /*
     * Cria um novo usuário de forma síncrona e retorna os dados criados.
     * Este método é uma variação mais simples que retorna o objeto do usuário após a criação.
     * 
     * Parâmetros:
     * - user2: Objeto PessoaDTO contendo os dados do usuário a ser criado
     * 
     * Retorno:
     * - O objeto PessoaDTO do usuário que foi criado no banco de dados
     * 
     * Funcionamento:
     * 1. Recebe um PessoaDTO com os dados do novo usuário
     * 2. Adiciona o objeto à coleção Users do DbContext (apenas na memória)
     * 3. Executa _context.SaveChanges() para persistir os dados no banco de forma SÍNCRONA (bloqueante)
     * 4. Retorna o mesmo objeto PessoaDTO que foi passado como parâmetro
     * 
     * Desvantagens:
     * - SaveChanges() é síncrono e bloqueia a thread enquanto aguarda o banco de dados
     * - Pode causar problemas de performance em aplicações com alta concorrência
     * - Não segue as boas práticas atuais de desenvolvimento assíncrono em C# .NET
     * 
     * Quando usar:
     * - EVITAR! Preferir CreateUser() que é assíncrono
     * - Apenas em cenários onde você absolutamente precisa de código síncrono
     */

    public PessoaDTO CreateUser2(PessoaDTO user2)
    {

        _context.Users.Add(user2);
        _context.SaveChanges(); 

        return user2;

    }

    /*
     * Cria um novo usuário com mapeamento de dados entre propriedades.
     * Este método demonstra como transformar/mapear os dados de entrada antes de persistir.
     * 
     * Parâmetros:
     * - user2: Objeto PessoaDTO contendo os dados brutos que serão mapeados
     * 
     * Retorno:
     * - Um novo PessoaDTO criado com os dados mapeados persistido no banco de dados
     * 
     * Funcionamento:
     * 1. Recebe um PessoaDTO com dados que podem estar em formato diferente ou incompleto
     * 2. Cria um NOVO objeto PessoaDTO chamado 'init' realizando transformação de dados:
     *    - CPF: copia direto do objeto de entrada
     *    - Id: recebe o valor de 'user2.pagamento' (transformação/mapeamento)
     *    - pagamento: copia direto do objeto de entrada
     * 3. Persiste o objeto transformado no banco de dados
     * 4. Retorna o objeto mapeado
     * 
     * ⚠️ OBSERVAÇÃO IMPORTANTE - Possível Bug:
     * A atribuição 'Id = user2.pagamento' parece ser um mapeamento incorreto.
     * Normalmente um ID deve ser um identificador único (GUID/int), mas está recebendo o valor de 'pagamento'.
     * REVISAR ESTE MAPEAMENTO COM O TIME!
     * 
     * Quando usar:
     * - Quando você precisa validar, transformar ou normalizar dados ANTES de salvar
     * - Para implementar lógica de mapeamento (como DTO para Entity)
     * - Para garantir que dados no banco estejam em formato consistente
     */
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

