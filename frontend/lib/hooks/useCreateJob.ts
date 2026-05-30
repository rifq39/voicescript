import { useCallback, useState } from 'react';
import { createJob } from '../api';

export function useCreateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (data: { caseName: string; duration: number; locationType: string; city?: string }) => {
      setLoading(true);
      setError(null);
      try {
        return await createJob(data);
      } catch (e) {
        setError(e as Error);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { mutate, loading, error };
}
