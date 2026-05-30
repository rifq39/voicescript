import { useCallback, useEffect, useState } from 'react';
import { getReporters, type Reporter } from '../api';

export function useReporters() {
  const [data, setData] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    getReporters()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}
