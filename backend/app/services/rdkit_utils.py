class RDKitUtils:
    @staticmethod
    def sanitize_smiles(smiles: str) -> str:
        """Sanitize and canonicalize a SMILES string."""
        from rdkit import Chem
        if not smiles or not smiles.strip():
            raise ValueError("Empty SMILES string provided")
        
        mol = Chem.MolFromSmiles(smiles.strip())
        if mol is None:
            raise ValueError(f"Invalid SMILES: {smiles}")
        
        try:
            Chem.SanitizeMol(mol)
        except Exception as e:
            raise ValueError(f"Failed to sanitize molecule: {str(e)}")
        
        return Chem.MolToSmiles(mol)

    @staticmethod
    def mol_summary(smiles: str) -> dict:
        """Get comprehensive molecular summary including descriptors."""
        from rdkit import Chem
        from rdkit.Chem import Descriptors, rdMolDescriptors, Crippen, Lipinski
        
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            raise ValueError(f"Invalid SMILES: {smiles}")
        
        # Basic properties
        formula = rdMolDescriptors.CalcMolFormula(mol)
        mw = Descriptors.MolWt(mol)
        
        # InChI and InChI Key
        inchi_str = ""
        inchikey = ""
        try:
            from rdkit.Chem import inchi
            inchi_str = inchi.MolToInchi(mol)
            inchikey = inchi.InchiToInchiKey(inchi_str)
        except Exception:
            # InChI not available in some RDKit builds
            pass
        
        # Calculate comprehensive descriptors with compatibility checks
        descriptors = {
            # Basic molecular properties
            "heavy_atom_count": mol.GetNumHeavyAtoms(),
            "atom_count": mol.GetNumAtoms(),
            "bond_count": mol.GetNumBonds(),
            "ring_count": rdMolDescriptors.CalcNumRings(mol),
            "aromatic_ring_count": rdMolDescriptors.CalcNumAromaticRings(mol),
            
            # Lipinski Rule of Five descriptors
            "logp": Crippen.MolLogP(mol),
            "hbd": Lipinski.NumHDonors(mol),  # Hydrogen bond donors
            "hba": Lipinski.NumHAcceptors(mol),  # Hydrogen bond acceptors
            "rotatable_bonds": rdMolDescriptors.CalcNumRotatableBonds(mol),
            
            # Additional drug-like properties
            "tpsa": rdMolDescriptors.CalcTPSA(mol),  # Topological polar surface area
            "formal_charge": Chem.rdmolops.GetFormalCharge(mol),
            "molar_refractivity": Crippen.MolMR(mol),
        }
        
        # Add optional descriptors that may not be available in all RDKit versions
        try:
            descriptors["fraction_sp3"] = rdMolDescriptors.CalcFractionCsp3(mol)
        except AttributeError:
            descriptors["fraction_sp3"] = 0.0  # Default value if not available
        
        try:
            descriptors["bertz_ct"] = rdMolDescriptors.BertzCT(mol)
        except (AttributeError, ValueError):
            descriptors["bertz_ct"] = 0.0
            
        try:
            descriptors["balaban_j"] = rdMolDescriptors.BalabanJ(mol)
        except (AttributeError, ValueError):
            descriptors["balaban_j"] = 0.0
        
        # Additional descriptor with compatibility check
        try:
            descriptors["slogp"] = Descriptors.SlogP_VSA0(mol) if hasattr(Descriptors, 'SlogP_VSA0') else 0.0
        except (AttributeError, ValueError):
            descriptors["slogp"] = 0.0
        
        # Add Lipinski violations count
        violations = 0
        if mw > 500: violations += 1
        if descriptors["logp"] > 5: violations += 1
        if descriptors["hbd"] > 5: violations += 1
        if descriptors["hba"] > 10: violations += 1
        descriptors["lipinski_violations"] = violations
        
        return {
            "formula": formula, 
            "weight": round(mw, 2), 
            "inchi": inchi_str, 
            "inchikey": inchikey,
            "descriptors": descriptors
        }

    @staticmethod
    def embed_conformer(smiles: str, forcefield: str = "UFF") -> str:
        """Generate 3D conformer and return as PDB block."""
        from rdkit import Chem
        from rdkit.Chem import AllChem
        
        base = Chem.MolFromSmiles(smiles)
        if base is None:
            raise ValueError(f"Invalid SMILES: {smiles}")
        
        mol = Chem.AddHs(base)
        
        # Embed molecule with ETKDG algorithm
        result = AllChem.EmbedMolecule(mol, AllChem.ETKDG())
        if result != 0:
            raise ValueError("Failed to generate 3D conformer")
        
        # Optimize with specified force field
        if forcefield.upper() == "MMFF":
            if AllChem.MMFFHasAllMoleculeParams(mol):
                AllChem.MMFFOptimizeMolecule(mol)
            else:
                # Fallback to UFF if MMFF parameters not available
                AllChem.UFFOptimizeMolecule(mol)
        else:
            AllChem.UFFOptimizeMolecule(mol)
        
        return Chem.MolToPDBBlock(mol) 