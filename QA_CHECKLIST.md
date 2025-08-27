# QA Checklist
- [ ] Backend /api/health returns ok
- [ ] /api/parse with aspirin SMILES returns formula & MW
- [ ] /api/conformer returns a PDB block (visualizes in 3Dmol)
- [ ] /api/admet returns predictions (mock if admet-ai missing)
- [ ] /api/analyze stitches parse+conformer+admet
- [ ] Frontend loads and renders viewer + results
- [ ] Animations are present and non-intrusive
- [ ] Error toasts appear on invalid SMILES 