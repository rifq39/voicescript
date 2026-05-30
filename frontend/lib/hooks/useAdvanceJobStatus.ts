import { useCallback, useState } from 'react';
import { advanceJobStatus } from '../api';

export function useAdvanceJobStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (jobId: number) => {
    setLoading(true);
    setError(null);
    try {
      return await advanceJobStatus(jobId);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}
