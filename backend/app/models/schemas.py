from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Union

class ParseRequest(BaseModel):
    smiles: Optional[str] = None
    filename: Optional[str] = None

class MoleculeSummary(BaseModel):
    smiles: str
    formula: str
    weight: float
    inchi: str = ""
    inchikey: str = ""
    descriptors: Dict[str, float] = {}

class ConformerRequest(BaseModel):
    smiles: str
    forcefield: str = Field(default="UFF")

class ConformerResponse(BaseModel):
    pdb_block: str
    status: str = "ok"

class AdmetRequest(BaseModel):
    smiles: str

class AdmetPrediction(BaseModel):
    property: str
    value: Union[float, str]
    unit: Optional[str] = None
    probability: Optional[float] = None

class AdmetResponse(BaseModel):
    predictions: List[AdmetPrediction]

class AnalyzeRequest(BaseModel):
    smiles: str 