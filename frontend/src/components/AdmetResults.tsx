interface AdmetResultsProps {
  data: Array<{ 
    property: string; 
    value: number | string; 
    probability?: number; 
    unit?: string;
  }> | null;
}

export default function AdmetResults({ data }: AdmetResultsProps) {
  if (!data || data.length === 0) return null;

  const getPropertyIcon = (property: string) => {
    const icons: Record<string, string> = {
      'solubility': '💧',
      'permeability': '🔬',
      'absorption': '📈',
      'distribution': '🌐',
      'metabolism': '⚗️',
      'excretion': '🔄',
      'toxicity': '⚠️',
      'bioavailability': '📊',
      'clearance': '🔄',
      'half_life': '⏰'
    };
    
    const key = Object.keys(icons).find(k => 
      property.toLowerCase().includes(k)
    );
    return key ? icons[key] : '🧪';
  };

  const getValueColor = (property: string, value: number | string) => {
    // Simple heuristics for coloring based on property type
    if (typeof value === 'string') return '';
    
    const prop = property.toLowerCase();
    if (prop.includes('toxicity') || prop.includes('toxic')) {
      return value > 0.5 ? 'bad' : 'good';
    }
    if (prop.includes('solubility') || prop.includes('permeability')) {
      return value > 0.7 ? 'good' : value > 0.3 ? 'warning' : 'bad';
    }
    return '';
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', fontSize: '1.25rem', fontWeight: '700' }}>
            <span style={{ marginRight: '0.75rem' }}>🧬</span>
            ADMET Predictions
          </h3>
          <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>
            {data.length} properties
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((prediction, index) => (
          <div
            key={index}
            style={{ 
              background: 'linear-gradient(135deg, #f8f9fa, #ffffff)', 
              borderRadius: '12px', 
              padding: '1rem', 
              border: '1px solid #e5e7eb',
              transition: 'box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{getPropertyIcon(prediction.property)}</span>
                <div>
                  <h4 style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                    {prediction.property.replace(/_/g, ' ')}
                  </h4>
                  {prediction.probability && (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', marginRight: '0.5rem' }}>Confidence:</span>
                      <div style={{ width: '4rem', height: '0.5rem', background: '#e5e7eb', borderRadius: '0.25rem', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', 
                            width: `${prediction.probability * 100}%`,
                            transition: 'width 0.3s'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                        {(prediction.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <span className={`descriptor-value ${getValueColor(prediction.property, prediction.value)}`} style={{ fontSize: '1.125rem', fontWeight: '700' }}>
                  {typeof prediction.value === 'number' 
                    ? prediction.value.toFixed(3) 
                    : String(prediction.value)
                  }
                </span>
                {prediction.unit && (
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.25rem' }}>
                    {prediction.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1rem', border: '1px solid #bfdbfe', marginTop: '1.5rem' }}>
        <h4 style={{ fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>ℹ️</span>
          About ADMET
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: '1.5' }}>
          <strong>ADMET</strong> stands for Absorption, Distribution, Metabolism, Excretion, and Toxicity - 
          key pharmacokinetic and safety properties that determine how a drug behaves in the human body.
        </p>
      </div>
    </div>
  );
} 