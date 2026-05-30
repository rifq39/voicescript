import { useCallback, useEffect, useState } from 'react';
import { suggestReporters, type Reporter } from '../api';

export function useSuggestReporters(jobId: number) {
  const [data, setData] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    suggestReporters(jobId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [jobId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}
