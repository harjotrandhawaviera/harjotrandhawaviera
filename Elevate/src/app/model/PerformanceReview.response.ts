
export interface PerformanceReviewResponse {
    id?: number,
    job_id?: number,
    name?: string,
    address?: string,
    time_period?: number,
    project_hours?: number,
    total_shifts?: number,
    rating?: number,
    comment?: string,
    status?: string,
    pictures?: {
        id?: number,
        original_filename?: string,
        mime?: string,
        size?: string,
        url?: string
    }
}
