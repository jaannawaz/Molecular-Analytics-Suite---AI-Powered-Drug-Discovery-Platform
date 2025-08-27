import { useForm } from "react-hook-form";
import { useState } from "react";

type FormValues = { smiles: string };

interface MoleculeInputProps {
  onSubmit: (smiles: string) => void;
}

export default function MoleculeInput({ onSubmit }: MoleculeInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    defaultValues: { smiles: "CC(=O)Oc1ccccc1C(=O)O" }
  });

  const currentSmiles = watch("smiles");

  const handleFormSubmit = async (values: FormValues) => {
    if (!values.smiles.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values.smiles);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.5rem' }}>⚗️</span>
          Enter SMILES String
        </h2>
        <p>
          Input a SMILES (Simplified Molecular Input Line Entry System) string to analyze molecular properties
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-group">
          <label htmlFor="smiles" className="form-label">
            SMILES String
          </label>
          <div style={{ position: 'relative' }}>
            <input
              {...register("smiles", { 
                required: "SMILES string is required",
                minLength: { value: 1, message: "SMILES cannot be empty" },
                pattern: {
                  value: /^[A-Za-z0-9\[\]()=#+\-\\/@\.]+$/,
                  message: "Invalid characters in SMILES string"
                }
              })}
              id="smiles"
              placeholder="e.g., CCO (ethanol) or CC(=O)Oc1ccccc1C(=O)O (aspirin)"
              className={`form-input ${errors.smiles ? 'error' : ''}`}
              disabled={isSubmitting}
            />
            {currentSmiles && (
              <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem', color: '#999' }}>
                {currentSmiles.length} chars
              </div>
            )}
          </div>
          {errors.smiles && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.25rem' }}>⚠️</span>
              {errors.smiles.message}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={isSubmitting || !!errors.smiles}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner" style={{ width: '1.25rem', height: '1.25rem', borderColor: 'white', borderTopColor: 'transparent' }}></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>🔬</span>
                <span>Analyze Molecule</span>
              </>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
            <span>💡</span>
            <span>Try the examples below or paste your own SMILES</span>
          </div>
        </div>
      </form>

      {/* Quick Info */}
      <div style={{ background: 'linear-gradient(135deg, #e0f2fe, #f3e5f5)', border: '1px solid #e1bee7', borderRadius: '12px', padding: '1rem', marginTop: '1.5rem' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>📚</span>
          About SMILES
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.5' }}>
          SMILES is a chemical notation that describes molecular structure using ASCII characters. 
          Common patterns: <code style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '0.125rem 0.25rem', borderRadius: '3px' }}>C</code> (carbon), 
          <code style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '0.125rem 0.25rem', borderRadius: '3px' }}>O</code> (oxygen), 
          <code style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '0.125rem 0.25rem', borderRadius: '3px' }}>c1ccccc1</code> (benzene ring), 
          <code style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '0.125rem 0.25rem', borderRadius: '3px' }}>=</code> (double bond).
        </p>
      </div>
    </div>
  );
} 