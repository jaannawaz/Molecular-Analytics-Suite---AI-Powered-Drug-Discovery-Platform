import { useEffect, useRef } from "react";
declare global { interface Window { $3Dmol: any } }

export default function MoleculeViewer3D({ pdb }: { pdb: string }) {
  const el = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!el.current || !window.$3Dmol || !pdb) return;
    const viewer = window.$3Dmol.createViewer(el.current, { backgroundColor: "white" });
    viewer.addModel(pdb, "pdb");
    viewer.setStyle({}, { stick: {} });
    viewer.zoomTo();
    viewer.render();
    return () => viewer.clear();
  }, [pdb]);

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '0.5rem' }}>🧪</span>
        3D Molecular Structure
      </h3>
      <div 
        ref={el} 
        style={{ 
          width: "100%", 
          height: "420px", 
          border: "1px solid #e5e7eb", 
          borderRadius: "8px",
          background: "white"
        }} 
      />
      <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
        Interactive 3D structure - drag to rotate, scroll to zoom
      </p>
    </div>
  );
} 