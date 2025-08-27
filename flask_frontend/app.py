from flask import Flask, render_template, request, jsonify
import requests
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'molecular-analytics-2024'

# Backend API configuration
BACKEND_URL = "http://localhost:8000"

@app.route('/')
def index():
    """Main page for molecular analysis"""
    return render_template('index.html')

@app.route('/api/parse', methods=['POST'])
def parse_molecule():
    """Proxy to backend parser agent"""
    try:
        data = request.get_json()
        response = requests.post(f"{BACKEND_URL}/api/parse", json=data, timeout=30)
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": f"Backend connection failed: {str(e)}"}), 500

@app.route('/api/conformer', methods=['POST'])
def generate_conformer():
    """Proxy to backend conformer agent"""
    try:
        data = request.get_json()
        response = requests.post(f"{BACKEND_URL}/api/conformer", json=data, timeout=30)
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": f"Backend connection failed: {str(e)}"}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_molecule():
    """Proxy to backend full analysis"""
    try:
        data = request.get_json()
        response = requests.post(f"{BACKEND_URL}/api/analyze", json=data, timeout=30)
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": f"Backend connection failed: {str(e)}"}), 500

@app.route('/api/health')
def health_check():
    """Check backend health"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=10)
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": f"Backend unavailable: {str(e)}"}), 503

@app.route('/examples')
def examples():
    """Examples page with common molecules"""
    examples = [
        {"name": "Aspirin", "smiles": "CC(=O)OC1=CC=CC=C1C(=O)O", "description": "Pain reliever and anti-inflammatory"},
        {"name": "Caffeine", "smiles": "CN1C=NC2=C1C(=O)N(C(=O)N2C)C", "description": "Central nervous system stimulant"},
        {"name": "Ibuprofen", "smiles": "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O", "description": "Nonsteroidal anti-inflammatory drug"},
        {"name": "Ethanol", "smiles": "CCO", "description": "Simple alcohol, commonly used solvent"},
        {"name": "Benzene", "smiles": "c1ccccc1", "description": "Aromatic hydrocarbon, basic benzene ring"},
        {"name": "Glucose", "smiles": "C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O)O)O)O)O", "description": "Simple sugar, primary energy source"},
        {"name": "Paracetamol", "smiles": "CC(=O)NC1=CC=C(C=C1)O", "description": "Acetaminophen, pain reliever"},
        {"name": "Morphine", "smiles": "CN1CC[C@]23C4=C5C=CC(O)=C4O[C@H]2[C@@H](O)C=C[C@H]3[C@H]1C5", "description": "Opioid pain medication"}
    ]
    return render_template('examples.html', examples=examples)

@app.route('/about')
def about():
    """About page explaining the technology"""
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000) 