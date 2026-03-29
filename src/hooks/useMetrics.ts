import useSWR from 'swr';
import apiClient from '@/lib/api-client';

const fetcher = (url: string) => apiClient(url);

export function useMetrics(workspaceId: string) {
    const { data, error, mutate } = useSWR(
        workspaceId ? `/api/metrics?workspace_id=${workspaceId}` : null,
        fetcher
    );

    return {
        metrics: data?.metrics || [],
        count: data?.count || 0,
        loading: !data && !error,
        error,
        mutate
    };
}
