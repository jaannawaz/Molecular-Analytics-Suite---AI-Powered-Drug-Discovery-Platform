import { useMutation } from "@tanstack/react-query";
import { api } from "../api/client";

// Parse molecule using the parser agent
export function useParse() {
  return useMutation<
    {
      smiles: string;
      formula: string;
      weight: number;
      inchi: string;
      inchikey: string;
      descriptors: Record<string, number>;
    },
    Error,
    { smiles: string }
  >({
    mutationFn: (payload) => api.post("/api/parse", payload).then((r) => r.data),
  });
}

// Full molecular analysis
export function useAnalyze() {
  return useMutation<
    { 
      molecule: {
        smiles: string;
        formula: string;
        weight: number;
        inchi: string;
        inchikey: string;
        descriptors: Record<string, number>;
      };
      pdb_block: string;
      admet: any[];
    },
    Error,
    { smiles: string }
  >({
    mutationFn: (payload) => api.post("/api/analyze", payload).then((r) => r.data),
  });
}

// Generate 3D conformer
export function useConformer() {
  return useMutation<
    { pdb_block: string; status: string },
    Error,
    { smiles: string; forcefield?: string }
  >({
    mutationFn: (payload) => api.post("/api/conformer", payload).then((r) => r.data),
  });
}

// ADMET predictions
export function useAdmet() {
  return useMutation<
    { predictions: Array<{ property: string; value: number | string; unit?: string; probability?: number }> },
    Error,
    { smiles: string }
  >({
    mutationFn: (payload) => api.post("/api/admet", payload).then((r) => r.data),
  });
} 