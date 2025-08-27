import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParse, useAnalyze } from "./hooks/useApi";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function MolecularAnalysis() {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>("");
  
  const parse = useParse();
  const analyze = useAnalyze();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { smiles: "CCO" }
  });

  const handleAnalyze = async (data: { smiles: string }) => {
    try {
      setError("");
      setStep('loading');
      
      // Parse the molecule first
      const parseResult = await parse.mutateAsync({ smiles: data.smiles });
      
      // Get full analysis
      const analysisResult = await analyze.mutateAsync({ smiles: data.smiles });
      
      setResults({
        molecule: parseResult,
        pdb: analysisResult.pdb_block,
        admet: analysisResult.admet
      });
      setStep('results');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to analyze molecule");
      setStep('input');
    }
  };

  const examples = [
    { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O', desc: 'Pain reliever' },
    { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', desc: 'Stimulant' },
    { name: 'Ibuprofen', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', desc: 'Anti-inflammatory' },
    { name: 'Ethanol', smiles: 'CCO', desc: 'Simple alcohol' }
  ];

  return (
    <div className="container">
      {/* Hero */}
      <div className="hero">
        <h1>🧬 Molecular Analytics Suite</h1>
        <p>Advanced SMILES analysis powered by RDKit and AI agents</p>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="progress-steps">
          <div className={`step ${step === 'input' ? 'active' : (step === 'loading' || step === 'results') ? 'completed' : ''}`}>
            <div className="step-icon">⌨️</div>
            <span>Input</span>
          </div>
          <div className={`step-connector ${step !== 'input' ? 'completed' : ''}`}></div>
          <div className={`step ${step === 'loading' ? 'active' : step === 'results' ? 'completed' : ''}`}>
            <div className="step-icon">🧠</div>
            <span>Analysis</span>
          </div>
          <div className={`step-connector ${step === 'results' ? 'completed' : ''}`}></div>
          <div className={`step ${step === 'results' ? 'active' : ''}`}>
            <div className="step-icon">📊</div>
            <span>Results</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          <strong>❌ Analysis Failed:</strong> {error}
        </div>
      )}

      {/* Input Form */}
      {step === 'input' && (
        <div className="card">
          <h2>🔬 Enter SMILES String</h2>
          <p style={{ marginBottom: '24px', color: '#6b7280' }}>
            Input a SMILES string to analyze molecular properties
          </p>
          
          <form onSubmit={handleSubmit(handleAnalyze)}>
            <div className="form-group">
              <label className="form-label">SMILES String</label>
              <input
                {...register("smiles", { required: "SMILES is required" })}
                className={`form-input ${errors.smiles ? 'error' : ''}`}
                placeholder="e.g., CCO (ethanol)"
              />
              {errors.smiles && (
                <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
                  ⚠️ {errors.smiles.message}
                </p>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary">
              🔬 Analyze Molecule
            </button>
          </form>

          {/* Examples */}
          <div style={{ marginTop: '32px' }}>
            <h3>🧪 Try Examples</h3>
            <div className="examples-grid">
              {examples.map((ex, i) => (
                <div 
                  key={i} 
                  className="example-card"
                  onClick={() => handleAnalyze({ smiles: ex.smiles })}
                >
                  <div className="example-name">{ex.name}</div>
                  <div className="example-description">{ex.desc}</div>
                  <div className="example-smiles">{ex.smiles}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {step === 'loading' && (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 24px' }}></div>
          <h3>Analyzing Molecule...</h3>
          <p>AI agents are processing your SMILES string</p>
        </div>
      )}

      {/* Results */}
      {step === 'results' && results && (
        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>🧬 Analysis Results</h2>
              <button 
                className="btn" 
                onClick={() => { setStep('input'); setResults(null); }}
                style={{ background: '#f3f4f6', color: '#374151' }}
              >
                New Analysis
              </button>
            </div>

            <div className="grid grid-2">
              <div>
                <h3>Basic Properties</h3>
                <div style={{ marginTop: '16px' }}>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                    <strong>SMILES:</strong> <code>{results.molecule.smiles}</code>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                    <strong>Formula:</strong> <span style={{ color: '#4f46e5', fontWeight: '600' }}>{results.molecule.formula}</span>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                    <strong>Weight:</strong> <span style={{ color: '#7c3aed', fontWeight: '600' }}>{results.molecule.weight} g/mol</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3>Key Descriptors</h3>
                <div style={{ marginTop: '16px' }}>
                  {['logp', 'hbd', 'hba', 'tpsa', 'lipinski_violations'].map(key => (
                    <div key={key} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{key.replace(/_/g, ' ').toUpperCase()}</span>
                      <strong className={`descriptor-value ${
                        key === 'lipinski_violations' ? (results.molecule.descriptors[key] === 0 ? 'good' : 'warning') : 
                        key === 'logp' ? (results.molecule.descriptors[key] <= 5 ? 'good' : 'bad') : ''
                      }`}>
                        {Number(results.molecule.descriptors[key]).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* All Descriptors */}
          <div className="card">
            <h3>📊 All Molecular Descriptors</h3>
            <div className="grid grid-3" style={{ marginTop: '16px' }}>
              {Object.entries(results.molecule.descriptors).map(([key, value]) => (
                <div key={key} className="descriptor-card">
                  <div className="descriptor-label">{key.replace(/_/g, ' ')}</div>
                  <div className="descriptor-value">{Number(value).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Structure Info */}
          {results.pdb && (
            <div className="card">
              <h3>🧪 3D Structure Generated</h3>
              <div className="success-message">
                                 ✅ 3D molecular structure successfully generated ({results.pdb.split('\n').filter((line: string) => line.startsWith('HETATM')).length} atoms)
              </div>
            </div>
          )}

          {/* ADMET Results */}
          {results.admet && results.admet.length > 0 && (
            <div className="card">
              <h3>🧬 ADMET Predictions</h3>
              <div style={{ marginTop: '16px' }}>
                {results.admet.map((pred: any, i: number) => (
                  <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{pred.property}</span>
                    <strong>{pred.value} {pred.unit || ''}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MolecularAnalysis />
    </QueryClientProvider>
  );
} 