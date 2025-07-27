'use client'

import { PredictionResultType } from "@/lib/types";
import { fetchUserPredictions } from "@/utils/helpers/stroke-predictions";
import { useState, useEffect } from "react";

type UserPredictionsState = {
  data: [];
  loading: boolean;
  error: string | null;
  message: string;
};

export function useUserPredictions() {
  const [state, setState] = useState<UserPredictionsState>({
    data: [],
    loading: true,
    error: null,
    message: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPredictions = async () => {
      try {
        const result = await fetchUserPredictions();
        
        if (!isMounted) return;

        if (result.success && result.data) {
          setState({
            data: result.data,
            loading: false,
            error: null,
            message: result.message || "Predictions loaded successfully",
          });
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: result.message || "Failed to fetch predictions",
            message: result.message || "Failed to fetch predictions",
          }));
        }
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          message: errorMessage,
        }));
      }
    };

    fetchPredictions();

    return () => {
      isMounted = false;
    };
  }, []); 

  return {
    predictions: state.data,
    loading: state.loading,
    error: state.error,
    message: state.message,
    isEmpty: state.data.length === 0,
  };
}