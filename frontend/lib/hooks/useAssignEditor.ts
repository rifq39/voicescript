import { useCallback, useState } from 'react';
import { assignEditor } from '../api';

export function useAssignEditor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (jobId: number, editorId: number) => {
    setLoading(true);
    setError(null);
    try {
      return await assignEditor(jobId, editorId);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}
