import { useState, useEffect } from "react";

export function useFetch(fetchFunction, params = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función de fetch 
  const fetchData = async (signal) => {
    setLoading(true);
    try {
      const result = await fetchFunction(params, { signal });
      setData(result);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchFunction, JSON.stringify(params)]);

  return { data, loading, error };
}
