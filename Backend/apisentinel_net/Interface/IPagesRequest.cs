using DTOs.Dev;

namespace Interface.Dev;

/// <summary>
/// Interface for page-level multi-query requests.
/// Use this service to compose data from multiple tables/schemas
/// (for example: dashboard aggregates or paginated views that require
/// joining/compiling results from different sources).
/// This interface exposes read-only methods (GET-only) to retrieve
/// already-assembled DTOs for the API surface.
/// </summary>
public interface IPagesRequest
{
    /// <summary>
    /// Builds and returns the main dashboard payload combining
    /// tests, executions and other aggregated metrics.
    /// </summary>
    Task<DashboardMainDTO> GetDashboardMainAsync();
}
