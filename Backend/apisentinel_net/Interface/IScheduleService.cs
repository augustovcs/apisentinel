using DTOs.Dev;

namespace Interface.Dev;

public interface IScheduleService
{
    Task<ResponseScheduleDTO> CreateSchedule(RequestScheduleDTO request);
    Task<ResponseScheduleDTO> GetScheduleById(long id);
    Task<List<ResponseScheduleDTO>> GetAllSchedules();
    Task<List<ResponseScheduleDTO>> GetActiveSchedules();
    Task<ResponseScheduleDTO> UpdateSchedule(UpdateScheduleDTO request);
    Task<bool> DeleteSchedule(long id);
    Task<bool> ToggleSchedule(long id, bool isActive);
}
