'use client';

import { useState, useEffect, useCallback } from 'react';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await global.fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (url) {
      fetch();
    }
  }, [url, fetch]);

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch };
}

// Hook pour POST/PUT/DELETE
export function useMutation(method = 'POST') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (url, payload) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await global.fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [method]
  );

  return { mutate, loading, error };
}
