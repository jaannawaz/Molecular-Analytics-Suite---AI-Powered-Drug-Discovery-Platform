# Product Requirements Document (PDR)
## 1. Overview
Build a web app to accept molecular input (SMILES / MOL / SDF), parse and standardize molecules, generate 3D conformers, visualize them, and return ADMET predictions. Backend uses FastAPI with Agno agents and RDKit. Frontend uses React + TypeScript with framer-motion animations and 3Dmol.js for visualization.

## 2. Goals
- Input: SMILES text + file upload (phase 2).
- Agents: ParserAgent (RDKit), ConformerAgent (RDKit 3D), ADMETAgent (admet-ai or stub), RenderAgent (format payloads).
- Visualization: 3Dmol.js.
- API: /api/parse, /api/conformer, /api/admet, /api/analyze, /api/health.
- Clean, modular code with docs and tests.

## 3. Non-Goals (v1)
- User accounts/auth
- DB persistence (beyond simple in-memory caching)
- Batch jobs/queues

## 4. Users & Use Cases
- Computational chemists: quick ADMET checks
- Bioinformatics/medchem students: learn pipeline
- Researchers: light-weight triage before heavy docking

## 5. Functional Requirements
- Validate/sanitize SMILES; compute formula, MW, basic descriptors.
- Generate at least one optimized 3D conformer (PDB block).
- Predict ADMET endpoints via pluggable service (admet-ai when available; fallback mock for dev).
- Visualize 3D structure in-browser with controls (zoom/rotate).
- Animated UI (cards, transitions) with framer-motion.
- Return structured JSON for all endpoints.

## 6. System Design
- Frontend: React + TS + React Query + Axios + 3Dmol.js; Vite tooling.
- Backend: FastAPI + Agno; RDKit for chemistry; ADMET-AI lib if installed.
- Agents: Agno agents exposing RDKit/ADMET tools.
- Optional: Docker compose later.

## 7. API Spec (v1)
- GET /api/health -> {status: 'ok'}
- POST /api/parse {smiles} -> {smiles, formula, weight, inchi?, inchikey?, descriptors{}}
- POST /api/conformer {smiles, forcefield='UFF'} -> {pdb_block, status}
- POST /api/admet {smiles} -> {predictions: [{property, value, probability?, unit?}]}
- POST /api/analyze {smiles} -> {molecule, pdb_block, admet}

## 8. Quality Targets
- P95 end-to-end (parse+conformer+admet) < 5s for small molecules on dev machine.
- Basic unit test coverage for API smoke.

## 9. Privacy & Safety
- No data retention beyond process memory for v1.
- Input validation and error handling for invalid molecules.

## 10. Milestones
- M0 Docs: PRD + README
- M1 Backend API + Agents (parse/conformer/admet/mock)
- M2 Frontend UI + 3D viewer
- M3 Integration, polish, tests, packaging 