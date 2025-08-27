from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    ParseRequest, MoleculeSummary, ConformerRequest, ConformerResponse,
    AdmetRequest, AdmetResponse, AnalyzeRequest, AdmetPrediction
)
from ..services.rdkit_utils import RDKitUtils
from ..services.admet_ai_client import ADMETClient
from ..agents.parser_agent import parser_agent
from ..agents.conformer_agent import conformer_agent
from ..agents.admet_agent import admet_agent
from ..agents.render_agent import render_agent

router = APIRouter(prefix="/api", tags=["molecules"])

@router.get("/health")
def health():
    return {
        "message": "Agno Molecular Analytics API is running",
        "status": "healthy",
        "agents": {
            "parser": "ParserAgent - RDKit molecular parsing with 17+ descriptors",
            "conformer": "ConformerAgent - 3D structure generation with UFF/MMFF",
            "admet": "ADMETAgent - ADMET property predictions",
            "render": "RenderAgent - Analysis payload formatting"
        },
        "endpoints": [
            "/api/health",
            "/api/parse", 
            "/api/conformer",
            "/api/admet",
            "/api/analyze",
            "/api/render"
        ]
    }

@router.post("/parse", response_model=MoleculeSummary)
def parse(req: ParseRequest):
    """Parse and validate a SMILES string using the ParserAgent or fallback to direct RDKit."""
    if not req.smiles:
        raise HTTPException(400, "SMILES required")
    
    try:
        # Try ParserAgent first
        result = parser_agent.run(req.smiles)
        
        if "error" in result:
            raise Exception(result["error"])
        
        return MoleculeSummary(
            smiles=result["smiles"],
            formula=result["formula"],
            weight=result["weight"],
            inchi=result["inchi"],
            inchikey=result["inchikey"],
            descriptors=result["descriptors"]
        )
    except Exception as agent_error:
        # Fallback to direct RDKit operations
        try:
            sanitized_smiles = RDKitUtils.sanitize_smiles(req.smiles)
            meta = RDKitUtils.mol_summary(sanitized_smiles)
            
            return MoleculeSummary(
                smiles=sanitized_smiles,
                formula=meta["formula"],
                weight=meta["weight"],
                inchi=meta["inchi"],
                inchikey=meta["inchikey"],
                descriptors=meta["descriptors"]
            )
        except Exception as rdkit_error:
            raise HTTPException(400, f"Failed to parse SMILES (Agent: {str(agent_error)}, RDKit: {str(rdkit_error)})")

@router.post("/conformer", response_model=ConformerResponse)
def conformer(req: ConformerRequest):
    """Generate 3D conformer using the ConformerAgent or fallback to direct RDKit."""
    try:
        # Try ConformerAgent first
        result = conformer_agent.run(f"Generate 3D conformer for SMILES: {req.smiles} using {req.forcefield} force field")
        
        if "error" in result:
            raise Exception(result["error"])
        
        return ConformerResponse(
            pdb_block=result.get("pdb_block", ""),
            status=result.get("status", "ok")
        )
    except Exception as agent_error:
        # Fallback to direct RDKit operations
        try:
            pdb = RDKitUtils.embed_conformer(req.smiles, req.forcefield)
            return ConformerResponse(pdb_block=pdb, status="ok")
        except Exception as rdkit_error:
            raise HTTPException(400, f"Failed to generate conformer (Agent: {str(agent_error)}, RDKit: {str(rdkit_error)})")

@router.post("/admet", response_model=AdmetResponse)
def admet(req: AdmetRequest):
    """Predict ADMET properties using the ADMETAgent or fallback to direct ADMET-AI."""
    try:
        # Try ADMETAgent first
        result = admet_agent.run(f"Predict ADMET properties for SMILES: {req.smiles}")
        
        if "error" in result:
            raise Exception(result["error"])
        
        # Convert predictions to the expected format
        predictions = []
        for pred in result.get("predictions", []):
            predictions.append(AdmetPrediction(
                property=pred["property"],
                value=pred["value"],
                probability=pred.get("confidence", 0.0)
            ))
        
        return AdmetResponse(predictions=predictions)
    except Exception as agent_error:
        # Fallback to direct ADMET-AI operations
        try:
            preds = ADMETClient.predict(req.smiles)
            out = [AdmetPrediction(**p) for p in preds]
            return AdmetResponse(predictions=out)
        except Exception as admet_error:
            raise HTTPException(400, f"Failed to predict ADMET properties (Agent: {str(agent_error)}, ADMET-AI: {str(admet_error)})")

@router.post("/analyze")
def analyze(req: AnalyzeRequest):
    """Comprehensive molecular analysis using all four agents: Parser, Conformer, ADMET, and Render."""
    try:
        # Step 1: Parse molecule using ParserAgent
        molecular_result = parser_agent.run(req.smiles)
        
        # Step 2: Generate 3D conformer using ConformerAgent
        conformer_result = conformer_agent.run(f"Generate 3D conformer for SMILES: {req.smiles} using UFF force field")
        
        # Step 3: Predict ADMET properties using ADMETAgent
        admet_result = admet_agent.run(f"Predict ADMET properties for SMILES: {req.smiles}")
        
        # Step 4: Format payload using RenderAgent
        render_result = render_agent.run(f"Format analysis results for molecular_data: {molecular_result}, conformer_data: {conformer_result}, admet_data: {admet_result}")
        
        # If render agent worked, return the structured payload
        if render_result and not render_result.get("error"):
            return render_result
        
        # Fallback: return basic structure if render agent fails
        return {
            "molecule": molecular_result if not molecular_result.get("error") else {
                "smiles": req.smiles,
                "formula": "",
                "weight": 0.0,
                "inchi": "",
                "inchikey": "",
                "descriptors": {},
                "error": molecular_result.get("error", "Parser failed")
            },
            "pdb_block": conformer_result.get("pdb_block", "") if not conformer_result.get("error") else "",
            "admet": admet_result.get("predictions", []) if not admet_result.get("error") else [],
            "analysis_status": {
                "parser": "success" if not molecular_result.get("error") else "failed",
                "conformer": "success" if not conformer_result.get("error") else "failed", 
                "admet": "success" if not admet_result.get("error") else "failed",
                "render": "failed" if render_result.get("error") else "success"
            }
        }
        
    except Exception as e:
        raise HTTPException(400, f"Complete analysis failed: {str(e)}")

@router.post("/render")
def render_analysis(molecular_data: dict, conformer_data: dict, admet_data: dict):
    """Format analysis results using the RenderAgent."""
    try:
        result = render_agent.run(f"Format analysis results for molecular_data: {molecular_data}, conformer_data: {conformer_data}, admet_data: {admet_data}")
        
        if "error" in result:
            raise HTTPException(400, result["error"])
        
        return result
    except Exception as e:
        raise HTTPException(400, f"Failed to render analysis: {str(e)}") 