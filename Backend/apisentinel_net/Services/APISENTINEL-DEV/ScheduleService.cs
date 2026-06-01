using DTOs.Dev;
using Interface.Dev;
using Models.Dev;
using Supabase;

namespace Services.Dev.Schedules;

public class ScheduleService : IScheduleService
{
    private readonly Supabase.Client _supabase;

    public ScheduleService(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    public async Task<ResponseScheduleDTO> CreateSchedule(RequestScheduleDTO request)
    {
        // Busca o teste
        var test = await _supabase
            .From<TestsModel>()
            .Where(x => x.Id == request.TestId)
            .Single();

        if (test == null)
        {
            throw new Exception("Test not found.");
        }

        var schedule = new ScheduleModel
        {
            TestId = request.TestId,
            IntervalSeconds = request.IntervalSeconds,
            IsActive = request.IsActive,
            Name = request.Name,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            NextExecutionAt = DateTime.UtcNow.AddSeconds(request.IntervalSeconds)
        };

        var insertedSchedule = await _supabase
            .From<ScheduleModel>()
            .Insert(schedule);

        var createdSchedule = insertedSchedule.Models.First();

        return new ResponseScheduleDTO
        {
            Id = createdSchedule.Id,
            TestId = createdSchedule.TestId,
            IntervalSeconds = createdSchedule.IntervalSeconds,
            IsActive = createdSchedule.IsActive,
            Name = createdSchedule.Name,
            Description = createdSchedule.Description,
            LastExecutedAt = createdSchedule.LastExecutedAt,
            NextExecutionAt = createdSchedule.NextExecutionAt,
            CreatedAt = createdSchedule.CreatedAt,
            UpdatedAt = createdSchedule.UpdatedAt,
            TestName = test.Name
        };
    }

    public async Task<ResponseScheduleDTO> GetScheduleById(long id)
    {
        var schedule = await _supabase
            .From<ScheduleModel>()
            .Where(x => x.Id == id)
            .Single();

        if (schedule == null)
        {
            throw new Exception("Schedule not found.");
        }

        var test = await _supabase
            .From<TestsModel>()
            .Where(x => x.Id == schedule.TestId)
            .Single();

        return new ResponseScheduleDTO
        {
            Id = schedule.Id,
            TestId = schedule.TestId,
            IntervalSeconds = schedule.IntervalSeconds,
            IsActive = schedule.IsActive,
            Name = schedule.Name,
            Description = schedule.Description,
            LastExecutedAt = schedule.LastExecutedAt,
            NextExecutionAt = schedule.NextExecutionAt,
            CreatedAt = schedule.CreatedAt,
            UpdatedAt = schedule.UpdatedAt,
            TestName = test?.Name
        };
    }

    public async Task<List<ResponseScheduleDTO>> GetAllSchedules()
    {
        var schedulesResponse = await _supabase
            .From<ScheduleModel>()
            .Get();

        var testsResponse = await _supabase
            .From<TestsModel>()
            .Get();

        var tests = testsResponse.Models.ToDictionary(t => t.Id, t => t.Name);

        return schedulesResponse.Models.Select(s => new ResponseScheduleDTO
        {
            Id = s.Id,
            TestId = s.TestId,
            IntervalSeconds = s.IntervalSeconds,
            IsActive = s.IsActive,
            Name = s.Name,
            Description = s.Description,
            LastExecutedAt = s.LastExecutedAt,
            NextExecutionAt = s.NextExecutionAt,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt,
            TestName = tests.TryGetValue(s.TestId, out var testName) ? testName : null
        }).ToList();
    }

    public async Task<List<ResponseScheduleDTO>> GetActiveSchedules()
    {
        var schedulesResponse = await _supabase
            .From<ScheduleModel>()
            .Where(x => x.IsActive == true)
            .Get();

        var testsResponse = await _supabase
            .From<TestsModel>()
            .Get();

        var tests = testsResponse.Models.ToDictionary(t => t.Id, t => t.Name);

        return schedulesResponse.Models.Select(s => new ResponseScheduleDTO
        {
            Id = s.Id,
            TestId = s.TestId,
            IntervalSeconds = s.IntervalSeconds,
            IsActive = s.IsActive,
            Name = s.Name,
            Description = s.Description,
            LastExecutedAt = s.LastExecutedAt,
            NextExecutionAt = s.NextExecutionAt,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt,
            TestName = tests.TryGetValue(s.TestId, out var testName) ? testName : null
        }).ToList();
    }

    public async Task<ResponseScheduleDTO> UpdateSchedule(UpdateScheduleDTO request)
    {
        var schedule = await _supabase
            .From<ScheduleModel>()
            .Where(x => x.Id == request.Id)
            .Single();

        if (schedule == null)
        {
            throw new Exception("Schedule not found.");
        }

        schedule.IntervalSeconds = request.IntervalSeconds;
        schedule.IsActive = request.IsActive;
        schedule.Name = request.Name;
        schedule.Description = request.Description;
        schedule.UpdatedAt = DateTime.UtcNow;

        var updated = await _supabase
            .From<ScheduleModel>()
            .Update(schedule);

        var updatedSchedule = updated.Models.First();

        var test = await _supabase
            .From<TestsModel>()
            .Where(x => x.Id == updatedSchedule.TestId)
            .Single();

        return new ResponseScheduleDTO
        {
            Id = updatedSchedule.Id,
            TestId = updatedSchedule.TestId,
            IntervalSeconds = updatedSchedule.IntervalSeconds,
            IsActive = updatedSchedule.IsActive,
            Name = updatedSchedule.Name,
            Description = updatedSchedule.Description,
            LastExecutedAt = updatedSchedule.LastExecutedAt,
            NextExecutionAt = updatedSchedule.NextExecutionAt,
            CreatedAt = updatedSchedule.CreatedAt,
            UpdatedAt = updatedSchedule.UpdatedAt,
            TestName = test?.Name
        };
    }

    public async Task<bool> DeleteSchedule(long id)
    {
        var schedule = await _supabase
            .From<ScheduleModel>()
            .Where(x => x.Id == id)
            .Single();

        if (schedule == null)
        {
            throw new Exception("Schedule not found.");
        }

        await _supabase
            .From<ScheduleModel>()
            .Delete(schedule);

        return true;
    }

    public async Task<bool> ToggleSchedule(long id, bool isActive)
    {
        var schedule = await _supabase
            .From<ScheduleModel>()
            .Where(x => x.Id == id)
            .Single();

        if (schedule == null)
        {
            throw new Exception("Schedule not found.");
        }

        schedule.IsActive = isActive;
        schedule.UpdatedAt = DateTime.UtcNow;

        await _supabase
            .From<ScheduleModel>()
            .Update(schedule);

        return true;
    }
}
