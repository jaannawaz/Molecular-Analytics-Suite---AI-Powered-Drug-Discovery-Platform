import { useState } from "react";
import MoleculeInput from "../components/MoleculeInput";
import MoleculeViewer3D from "../components/MoleculeViewer3D";
import AdmetResults from "../components/AdmetResults";
import { useAnalyze, useParse } from "../hooks/useApi";

interface MoleculeData {
  smiles: string;
  formula: string;
  weight: number;
  inchi: string;
  inchikey: string;
  descriptors: Record<string, number>;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'input' | 'parsing' | 'results'>('input');
  const [moleculeData, setMoleculeData] = useState<MoleculeData | null>(null);
  const [pdb, setPdb] = useState<string>("");
  const [admet, setAdmet] = useState<any[] | null>(null);
  const [error, setError] = useState<string>("");
  
  const parse = useParse();
  const analyze = useAnalyze();

  const handleSmilesSubmit = async (smiles: string) => {
    try {
      setError("");
      setCurrentStep('parsing');
      
      // First parse the molecule
      const parseResult = await parse.mutateAsync({ smiles });
      setMoleculeData(parseResult);
      
      // Then get full analysis
      const analysisResult = await analyze.mutateAsync({ smiles });
      setPdb(analysisResult.pdb_block);
      setAdmet(analysisResult.admet);
      
      setCurrentStep('results');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to analyze molecule");
      setCurrentStep('input');
    }
  };

  const resetAnalysis = () => {
    setCurrentStep('input');
    setMoleculeData(null);
    setPdb("");
    setAdmet(null);
    setError("");
  };

  const getDescriptorColor = (key: string, value: number) => {
    switch (key) {
      case 'lipinski_violations':
        return value === 0 ? 'good' : value <= 1 ? 'warning' : 'bad';
      case 'logp':
        return value <= 5 ? 'good' : 'bad';
      case 'hbd':
        return value <= 5 ? 'good' : 'bad';
      case 'hba':
        return value <= 10 ? 'good' : 'bad';
      case 'tpsa':
        return value <= 140 ? 'good' : 'warning';
      default:
        return '';
    }
  };

  const formatDescriptorName = (key: string) => {
    const names: Record<string, string> = {
      heavy_atom_count: 'Heavy Atoms',
      atom_count: 'Total Atoms',
      bond_count: 'Bonds',
      ring_count: 'Rings',
      aromatic_ring_count: 'Aromatic Rings',
      logp: 'LogP',
      hbd: 'H-Bond Donors',
      hba: 'H-Bond Acceptors',
      rotatable_bonds: 'Rotatable Bonds',
      tpsa: 'TPSA (Ų)',
      formal_charge: 'Formal Charge',
      molar_refractivity: 'Molar Refractivity',
      fraction_sp3: 'Fraction Csp3',
      bertz_ct: 'Bertz CT',
      balaban_j: 'Balaban J',
      slogp: 'SLogP',
      lipinski_violations: 'Lipinski Violations'
    };
    return names[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div className="hero">
        <h1>Molecular Parser Agent</h1>
        <p>
          Advanced SMILES analysis powered by RDKit and AI. Parse molecular structures, 
          calculate comprehensive descriptors, and explore chemical properties with precision.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="progress-steps">
          {[
            { id: 'input', label: 'Input SMILES', icon: '⌨️' },
            { id: 'parsing', label: 'Parsing', icon: '🧠' },
            { id: 'results', label: 'Results', icon: '📊' }
          ].map((step, index) => (
            <div key={step.id}>
              <div className={`step ${currentStep === step.id ? 'active' : 
                index < ['input', 'parsing', 'results'].indexOf(currentStep) ? 'completed' : ''}`}>
                <div className="step-icon">
                  <span>{step.icon}</span>
                </div>
                <span>{step.label}</span>
              </div>
              {index < 2 && (
                <div className={`step-connector ${
                  index < ['input', 'parsing', 'results'].indexOf(currentStep) ? 'completed' : ''
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <strong>❌ Analysis Failed:</strong> {error}
        </div>
      )}

      {/* Input Section */}
      {currentStep === 'input' && (
        <div>
          <MoleculeInput onSubmit={handleSmilesSubmit} />
          
          {/* Example Molecules */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>
              <span style={{ marginRight: '0.5rem' }}>🧪</span>
              Try These Examples
            </h3>
            <div className="examples-grid">
              {[
                { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O', description: 'Pain reliever' },
                { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', description: 'Stimulant' },
                { name: 'Ibuprofen', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', description: 'Anti-inflammatory' },
                { name: 'Ethanol', smiles: 'CCO', description: 'Simple alcohol' },
                { name: 'Benzene', smiles: 'c1ccccc1', description: 'Aromatic hydrocarbon' },
                { name: 'Glucose', smiles: 'C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O)O)O)O)O', description: 'Simple sugar' }
              ].map((example) => (
                <div
                  key={example.name}
                  className="example-card"
                  onClick={() => handleSmilesSubmit(example.smiles)}
                >
                  <div className="example-name">{example.name}</div>
                  <div className="example-description">{example.description}</div>
                  <div className="example-smiles">
                    {example.smiles.length > 30 ? `${example.smiles.substring(0, 30)}...` : example.smiles}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Parsing Section */}
      {currentStep === 'parsing' && (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 1.5rem' }}></div>
            <h3 style={{ marginBottom: '0.5rem' }}>Analyzing Molecule...</h3>
            <p>Our AI agent is parsing the SMILES string and calculating molecular descriptors</p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {currentStep === 'results' && moleculeData && (
        <div>
          {/* Molecule Summary */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.75rem' }}>🧬</span>
                Molecular Analysis Results
              </h2>
              <button onClick={resetAnalysis} className="btn">
                New Analysis
              </button>
            </div>
            
            <div className="grid grid-2">
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Basic Properties</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '500' }}>SMILES</span>
                    <code style={{ background: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                      {moleculeData.smiles}
                    </code>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '500' }}>Formula</span>
                    <span style={{ fontWeight: '700', color: '#667eea' }}>{moleculeData.formula}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '500' }}>Molecular Weight</span>
                    <span style={{ fontWeight: '700', color: '#764ba2' }}>{moleculeData.weight} g/mol</span>
                  </div>
                  {moleculeData.inchikey && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <span style={{ fontWeight: '500' }}>InChI Key</span>
                      <code style={{ background: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {moleculeData.inchikey.substring(0, 14)}...
                      </code>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Drug-like Properties</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['lipinski_violations', 'logp', 'hbd', 'hba', 'tpsa'].map((key) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <span style={{ fontWeight: '500' }}>{formatDescriptorName(key)}</span>
                      <span className={`descriptor-value ${getDescriptorColor(key, moleculeData.descriptors[key])}`}>
                        {typeof moleculeData.descriptors[key] === 'number' 
                          ? moleculeData.descriptors[key].toFixed(2) 
                          : moleculeData.descriptors[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Complete Descriptors */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>
              <span style={{ marginRight: '0.5rem' }}>📊</span>
              Complete Molecular Descriptors
            </h3>
            <div className="grid grid-3">
              {Object.entries(moleculeData.descriptors).map(([key, value]) => (
                <div key={key} className="descriptor-card">
                  <div className="descriptor-label">{formatDescriptorName(key)}</div>
                  <div className={`descriptor-value ${getDescriptorColor(key, value)}`}>
                    {typeof value === 'number' ? value.toFixed(2) : value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Structure and ADMET */}
          <div className="grid grid-2">
            {pdb && <MoleculeViewer3D pdb={pdb} />}
            <AdmetResults data={admet} />
          </div>
        </div>
      )}
    </div>
  );
} 