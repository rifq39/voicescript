import { useCallback, useState } from 'react';
import { assignReporter } from '../api';

export function useAssignReporter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (jobId: number, reporterId: number) => {
    setLoading(true);
    setError(null);
    try {
      return await assignReporter(jobId, reporterId);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}
