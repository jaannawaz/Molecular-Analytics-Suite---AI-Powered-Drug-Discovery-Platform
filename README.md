#  Molecular Analytics Suite - AI-Powered Drug Discovery Platform

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-green.svg)](https://fastapi.tiangolo.com/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-lightgrey.svg)](https://flask.palletsprojects.com/)
[![RDKit](https://img.shields.io/badge/RDKit-2023.09%2B-orange.svg)](https://www.rdkit.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **A comprehensive molecular analysis platform featuring AI-powered agents, interactive 3D visualization, and advanced ADMET predictions for drug discovery and chemical research.**

![Molecular Analytics Suite](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

##  Features

###  **Core Analysis Capabilities**
- **Molecular Parsing**: Complete SMILES analysis with 17+ molecular descriptors
- **3D Structure Generation**: Automated conformer generation using UFF/MMFF force fields
- **ADMET Predictions**: Comprehensive drug-like property analysis
- **Interactive 3D Visualization**: Real-time molecular structure viewing with 3Dmol.js

###  **AI-Powered Agent Architecture**
- **ParserAgent**: RDKit-based molecular parsing and descriptor calculation
- **ConformerAgent**: 3D structure generation with multiple force field support
- **ADMETAgent**: Advanced ADMET property predictions using admet-ai
- **RenderAgent**: Intelligent payload formatting and analysis structuring

###  **Multi-Format File Support**
- **SMILES Input**: Direct molecular notation input
- **File Upload**: Support for SDF, PDB, MOL, XYZ formats
- **Drag & Drop**: Modern file upload interface
- **Direct PDB Visualization**: Immediate 3D rendering of uploaded structures

###  **Interactive Web Interface**
- **Real-time Analysis**: Live molecular property calculation
- **3D Molecular Viewer**: Interactive structure visualization with multiple rendering styles
- **Responsive Design**: Modern, clean UI optimized for research workflows
- **Progress Tracking**: Visual feedback for analysis pipeline stages

##  Quick Start

### Prerequisites
- Python 3.8+
- Git

###  Installation

1. **Clone the Repository**
`ash
git clone https://github.com/jaannawaz/Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform.git
cd Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform
`

2. **Backend Setup**
`ash
cd backend
python -m pip install --upgrade pip
pip install -e .
pip install rdkit admet-ai  # Optional: for enhanced functionality
`

3. **Frontend Setup**
`ash
cd flask_frontend
pip install -r requirements.txt
`

4. **Environment Configuration**
`ash
# Optional: Set GROQ API key for enhanced AI features
export GROQ_API_KEY="your-groq-api-key-here"
`

###  Running the Application

** Quick Start - Full Stack (Recommended)**

**Step 1: Start the Backend API Server**
`ash
# Open Terminal/Command Prompt 1
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
`
 **Backend will be available at**: http://localhost:8000
 **API Documentation**: http://localhost:8000/docs

**Step 2: Start the Frontend Web Server**
`ash
# Open Terminal/Command Prompt 2 (new window)
cd flask_frontend
python app.py
`
 **Web Application will be available at**: http://localhost:3000

** Development Mode (Backend Only)**
`ash
# For API development and testing
cd backend
uvicorn app.main:app --reload
`

** Important Notes:**
- Keep both servers running simultaneously for full functionality
- Backend must be running before starting the frontend
- If you get port conflicts, change the ports in the commands above
- For Windows users, use python instead of python3

###  Access Points
- **Web Application**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

##  API Endpoints

| Endpoint | Method | Description | Input | Output |
|----------|--------|-------------|-------|--------|
| /api/health | GET | System status and agent information | - | System health data |
| /api/parse | POST | Molecular parsing and descriptor calculation | SMILES string | Molecular properties |
| /api/conformer | POST | 3D structure generation | SMILES + force field | PDB block |
| /api/admet | POST | ADMET property predictions | SMILES string | Drug-like properties |
| /api/analyze | POST | Complete molecular analysis | SMILES string | Full analysis report |
| /api/render | POST | Analysis payload formatting | Analysis data | Structured results |

##  Usage Examples

### Command Line API Testing
`ash
# Test molecular parsing
curl -X POST "http://localhost:8000/api/parse" \
     -H "Content-Type: application/json" \
     -d '{"smiles": "CC(=O)OC1=CC=CC=C1C(=O)O"}'

# Test 3D conformer generation
curl -X POST "http://localhost:8000/api/conformer" \
     -H "Content-Type: application/json" \
     -d '{"smiles": "CC(=O)OC1=CC=CC=C1C(=O)O", "forcefield": "UFF"}'

# Test complete analysis
curl -X POST "http://localhost:8000/api/analyze" \
     -H "Content-Type: application/json" \
     -d '{"smiles": "CC(=O)OC1=CC=CC=C1C(=O)O"}'
`

### Python Integration
`python
import requests

# Parse molecular properties
response = requests.post("http://localhost:8000/api/parse", 
                        json={"smiles": "CC(=O)OC1=CC=CC=C1C(=O)O"})
data = response.json()
print(f"Molecular Weight: {data['weight']}")

# Generate 3D structure
response = requests.post("http://localhost:8000/api/conformer",
                        json={"smiles": "CC(=O)OC1=CC=CC=C1C(=O)O"})
pdb_data = response.json()['pdb_block']
`

### Web Interface Usage
1. **Open** http://localhost:3000 in your browser
2. **Enter SMILES** or **upload molecular file** (SDF, PDB, MOL, XYZ)
3. **Click "Analyze Molecule"** to start the analysis
4. **View results** including 3D structure, descriptors, and ADMET predictions
5. **Interact** with the 3D viewer using mouse controls

##  Architecture

### Backend Architecture
`
        
   FastAPI App      AI Agents        RDKit Tools   
   (Port 8000)          (Agno)               (Cheminfo)    
        
                                                       
                                     
           ADMET-AI API   
                          (Predictions)  
                        
`

### Frontend Architecture
`
        
   Flask App        Static Files     3Dmol.js      
   (Port 3000)          (CSS/JS)             (Visualization)
        
         
         

   API Proxy     
   (Backend)     

`

##  Molecular Descriptors

| Descriptor | Description | Units | Range |
|------------|-------------|-------|-------|
| **Molecular Weight** | Total molecular mass | Da | 18-2000 |
| **LogP** | Lipophilicity | - | -2 to 6 |
| **HBD** | Hydrogen bond donors | count | 0-10 |
| **HBA** | Hydrogen bond acceptors | count | 0-20 |
| **TPSA** | Topological polar surface area | Ų | 0-200 |
| **Rotatable Bonds** | Flexible bond count | count | 0-15 |
| **Aromatic Rings** | Aromatic ring count | count | 0-10 |
| **Heavy Atoms** | Non-hydrogen atoms | count | 1-100 |
| **Lipinski Violations** | Rule of 5 violations | count | 0-4 |
| **Fraction Csp3** | Saturated carbon ratio | - | 0-1 |
| **Bertz CT** | Molecular complexity | - | 0-1000 |
| **Balaban J** | Topological index | - | 0-10 |
| **SlogP_VSA0** | LogP surface area | - | 0-100 |

##  3D Visualization Features

### Interactive Controls
- **Mouse Controls**: Rotate, zoom, pan with mouse/trackpad
- **Rendering Styles**: Stick, sphere, cartoon, surface representations
- **Auto-rotation**: Continuous 3D structure rotation
- **Reset View**: Return to default orientation
- **Fullscreen**: Expand viewer to full screen

### Supported Formats
- **Input**: SMILES, SDF, PDB, MOL, XYZ
- **Output**: PDB format for 3D visualization
- **Force Fields**: UFF (Universal Force Field), MMFF (Merck Molecular Force Field)

##  ADMET Predictions

### Absorption
- **Caco-2 Permeability**: Intestinal absorption prediction
- **HIA (Human Intestinal Absorption)**: Oral bioavailability
- **Pgp Substrate**: P-glycoprotein interaction

### Distribution
- **VD (Volume of Distribution)**: Tissue distribution
- **BBB (Blood-Brain Barrier)**: CNS penetration
- **PPB (Plasma Protein Binding)**: Protein binding affinity

### Metabolism
- **CYP1A2 Inhibition**: Drug-drug interaction risk
- **CYP2C19 Inhibition**: Metabolic pathway analysis
- **CYP2C9 Inhibition**: Enzyme interaction prediction
- **CYP2D6 Inhibition**: Pharmacogenomics consideration
- **CYP3A4 Inhibition**: Major metabolic pathway

### Excretion
- **CL (Clearance)**: Drug elimination rate
- **T1/2 (Half-life)**: Drug persistence in body

### Toxicity
- **hERG Inhibition**: Cardiac toxicity risk
- **Hepatotoxicity**: Liver damage potential
- **Ames Mutagenicity**: Genotoxicity assessment
- **Carcinogenicity**: Cancer risk evaluation

##  Development

### Project Structure
`
molecular-analytics-suite/
 backend/                 # FastAPI backend
    app/
       agents/         # AI agents (Parser, Conformer, ADMET, Render)
       routes/         # API endpoints
       services/       # RDKit and ADMET utilities
       models/         # Data schemas
    tests/              # Backend tests
 flask_frontend/         # Flask web interface
    templates/          # HTML templates
    static/             # CSS, JavaScript, assets
    app.py              # Flask application
 frontend/               # React frontend (legacy)
 docs/                   # Documentation
`

### Running Tests
`ash
# Backend tests
cd backend
python -m pytest tests/ -v

# Frontend tests (if using React)
cd frontend
npm test
`

### Code Quality
`ash
# Format code
black backend/
isort backend/

# Type checking
mypy backend/

# Linting
flake8 backend/
`

##  Deployment

### Docker Deployment
`ash
# Build and run with Docker Compose
docker-compose up --build
`

### Production Setup
`ash
# Install production dependencies
pip install gunicorn

# Run production server
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
`

### Environment Variables
`ash
# Required
GROQ_API_KEY=your-groq-api-key

# Optional
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_PORT=3000
DEBUG=False
`

##  Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

### Reporting Issues
- Use GitHub Issues for bug reports
- Include detailed reproduction steps
- Attach relevant log files and screenshots

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- **RDKit**: Open-source cheminformatics toolkit
- **3Dmol.js**: WebGL-based molecular visualization
- **ADMET-AI**: Advanced ADMET prediction models
- **FastAPI**: Modern Python web framework
- **Agno**: AI agent framework for Python

##  Support

- **Issues**: [GitHub Issues](https://github.com/jaannawaz/Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jaannawaz/Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform/discussions)
- **Documentation**: [Wiki](https://github.com/jaannawaz/Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform/wiki)

---

**Built with  for the computational chemistry and drug discovery community.**

[![GitHub stars](https://img.shields.io/github/stars/jaannawaz/Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform?style=social)](https://github.com/jaannawaz/Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform)
[![GitHub forks](https://img.shields.io/github/forks/jaannawaz/Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform?style=social)](https://github.com/jaannawaz/Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform)
