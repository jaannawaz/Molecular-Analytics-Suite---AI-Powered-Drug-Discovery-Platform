// Analysis-specific JavaScript for Molecular Analytics
class AnalysisApp {
    constructor() {
        this.currentResults = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Analysis form submission
        const form = document.getElementById('analysisForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.analyzeInput();
            });
        }

        // New analysis button
        const newAnalysisBtn = document.getElementById('newAnalysisBtn');
        if (newAnalysisBtn) {
            newAnalysisBtn.addEventListener('click', () => {
                this.resetAnalysis();
            });
        }
    }

    async analyzeInput() {
        try {
            // Get input data from file upload handler or SMILES input
            const inputData = window.fileUploadHandler ? window.fileUploadHandler.getInputData() : null;
            
            if (!inputData) {
                this.showError('Please enter a SMILES string or upload a molecular file');
                return;
            }

            if (inputData.type === 'smiles' && !inputData.data) {
                this.showError('Please enter a SMILES string');
                return;
            }

            if (inputData.type === 'file' && !inputData.file) {
                this.showError('Please upload a molecular structure file');
                return;
            }

            // Clear previous messages and update UI
            window.molecularApp.clearMessages();
            this.showLoadingState();
            window.molecularApp.updateProgressSteps('analysis');

            if (inputData.type === 'smiles') {
                await this.analyzeSmiles(inputData.data);
            } else if (inputData.type === 'file') {
                await this.analyzeFile(inputData);
            }

        } catch (error) {
            console.error('Analysis failed:', error);
            this.showError(error.message);
            this.resetToInput();
        }
    }

    async analyzeFile(inputData) {
        try {
            // Read file content
            const fileContent = await window.fileUploadHandler.readFileContent();
            
            if (!fileContent) {
                throw new Error('Failed to read file content');
            }

            // For PDB files, we can directly use the 3D structure
            if (inputData.fileType === 'pdb') {
                // Step 1: Extract basic info from PDB
                this.updateLoadingStep('loadingParse', 'active');
                const basicInfo = this.extractPDBInfo(fileContent, inputData.fileName);
                this.updateLoadingStep('loadingParse', 'completed');

                // Step 2: Use PDB as 3D structure
                this.updateLoadingStep('loadingConformer', 'active');
                const conformerData = {
                    pdb_block: fileContent,
                    status: 'ok',
                    forcefield_used: 'File',
                    atom_count: (fileContent.match(/HETATM|ATOM/g) || []).length,
                    has_3d_coords: true
                };
                this.updateLoadingStep('loadingConformer', 'completed');

                // Step 3: Skip analysis for now
                this.updateLoadingStep('loadingAnalysis', 'active');
                const analysisData = {};
                this.updateLoadingStep('loadingAnalysis', 'completed');

                // Combine results
                this.currentResults = {
                    molecule: basicInfo,
                    conformer: conformerData,
                    analysis: analysisData
                };

                // Show results
                this.showResults();
                window.molecularApp.updateProgressSteps('results');
                window.molecularApp.showMessage(`PDB file "${inputData.fileName}" loaded successfully!`, 'success');
            } else {
                // For other formats, show a message that they need backend support
                throw new Error(`File format ${inputData.fileType.toUpperCase()} requires backend processing. Currently only PDB files are supported for direct upload.`);
            }

        } catch (error) {
            console.error('File analysis failed:', error);
            throw error;
        }
    }

    extractPDBInfo(pdbContent, fileName) {
        // Extract basic information from PDB file
        const lines = pdbContent.split('\n');
        let compoundName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
        
        // Look for COMPND record
        for (const line of lines) {
            if (line.startsWith('COMPND') && line.includes('MOLECULE:')) {
                const match = line.match(/MOLECULE:\s*([^;]+)/);
                if (match) {
                    compoundName = match[1].trim();
                    break;
                }
            }
        }

        return {
            smiles: 'N/A (from PDB file)',
            formula: 'Unknown',
            weight: 0,
            inchi: 'N/A',
            inchikey: 'N/A',
            descriptors: {
                'compound_name': compoundName,
                'source': 'PDB file upload',
                'file_name': fileName
            }
        };
    }

    async analyzeSmiles(smiles) {
        if (!smiles) {
            this.showError('Please enter a SMILES string');
            return;
        }

        try {
            // Clear previous messages and update UI
            window.molecularApp.clearMessages();
            this.showLoadingState();
            window.molecularApp.updateProgressSteps('analysis');

            // Step 1: Parse the molecule
            this.updateLoadingStep('loadingParse', 'active');
            const parseResponse = await fetch('/api/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ smiles })
            });

            if (!parseResponse.ok) {
                const error = await parseResponse.json();
                throw new Error(error.error || 'Failed to parse SMILES');
            }

            const parseData = await parseResponse.json();
            this.updateLoadingStep('loadingParse', 'completed');

            // Step 2: Generate 3D conformer
            this.updateLoadingStep('loadingConformer', 'active');
            const conformerResponse = await fetch('/api/conformer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ smiles, forcefield: 'UFF' })
            });

            const conformerData = await conformerResponse.json();
            this.updateLoadingStep('loadingConformer', 'completed');

            // Step 3: Full analysis (includes ADMET if available)
            this.updateLoadingStep('loadingAnalysis', 'active');
            const analysisResponse = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ smiles })
            });

            const analysisData = await analysisResponse.json();
            this.updateLoadingStep('loadingAnalysis', 'completed');

            // Combine results
            this.currentResults = {
                molecule: parseData,
                conformer: conformerData,
                analysis: analysisData
            };

            // Show results
            this.showResults();
            window.molecularApp.updateProgressSteps('results');
            window.molecularApp.showMessage('Analysis completed successfully!', 'success');

        } catch (error) {
            console.error('Analysis failed:', error);
            this.showError(error.message);
            this.resetToInput();
        }
    }

    showLoadingState() {
        this.hideAllSections();
        document.getElementById('loadingSection').classList.remove('hidden');
        
        // Reset loading steps
        document.querySelectorAll('.loading-step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
    }

    updateLoadingStep(stepId, status) {
        const step = document.getElementById(stepId);
        if (step) {
            step.classList.remove('active', 'completed');
            step.classList.add(status);
        }
    }

    showResults() {
        this.hideAllSections();
        document.getElementById('resultsSection').classList.remove('hidden');
        
        if (this.currentResults) {
            this.populateBasicProperties();
            this.populateDrugProperties();
            this.populateAllDescriptors();
            this.populateStructureInfo();
            this.populateAdmetResults();
        }
    }

    populateBasicProperties() {
        const container = document.getElementById('basicProperties');
        const { molecule } = this.currentResults;
        
        const properties = [
            { label: 'SMILES', value: molecule.smiles, type: 'code' },
            { label: 'Formula', value: molecule.formula, type: 'formula' },
            { label: 'Molecular Weight', value: `${molecule.weight} g/mol`, type: 'weight' },
            { label: 'InChI Key', value: molecule.inchikey ? `${molecule.inchikey.substring(0, 14)}...` : 'N/A', type: 'code' }
        ];

        container.innerHTML = properties.map(prop => `
            <div class="property-item">
                <span class="property-label">${prop.label}</span>
                <span class="property-value ${prop.type}">${prop.value}</span>
            </div>
        `).join('');
    }

    populateDrugProperties() {
        const container = document.getElementById('drugProperties');
        const { descriptors } = this.currentResults.molecule;
        
        const drugKeys = ['lipinski_violations', 'logp', 'hbd', 'hba', 'tpsa'];
        const properties = drugKeys.map(key => ({
            label: window.molecularApp.formatDescriptorName(key),
            value: window.molecularApp.formatNumber(descriptors[key]),
            color: window.molecularApp.getDescriptorColor(key, descriptors[key])
        }));

        container.innerHTML = properties.map(prop => `
            <div class="property-item">
                <span class="property-label">${prop.label}</span>
                <span class="property-value ${prop.color}">${prop.value}</span>
            </div>
        `).join('');
    }

    populateAllDescriptors() {
        const container = document.getElementById('allDescriptors');
        const { descriptors } = this.currentResults.molecule;
        
        container.innerHTML = Object.entries(descriptors).map(([key, value]) => `
            <div class="descriptor-card">
                <div class="descriptor-label">${window.molecularApp.formatDescriptorName(key)}</div>
                <div class="descriptor-value ${window.molecularApp.getDescriptorColor(key, value)}">
                    ${window.molecularApp.formatNumber(value)}
                </div>
            </div>
        `).join('');
    }

    populateStructureInfo() {
        const container = document.getElementById('structureDetails');
        const { conformer } = this.currentResults;
        
        if (conformer && conformer.pdb_block && !conformer.error) {
            // Calculate atom count from PDB block if not provided
            const atomCount = conformer.atom_count || (conformer.pdb_block.match(/HETATM/g) || []).length;
            const forcefield = conformer.forcefield_used || 'UFF';
            const hasCoords = conformer.has_3d_coords !== false; // default to true if not specified
            
            container.innerHTML = `
                <div class="message success">
                    <span>✅</span>
                    <div>
                        <strong>3D Structure Generated Successfully</strong>
                        <br>
                        <small>
                            ${atomCount} atoms • ${forcefield} force field • 
                            ${hasCoords ? 'Optimized geometry' : 'Basic structure'}
                        </small>
                    </div>
                </div>
            `;
            
            // Load the 3D structure into the viewer
            this.load3DStructure();
        } else {
            container.innerHTML = `
                <div class="message error">
                    <span>❌</span>
                    <span>Failed to generate 3D structure: ${conformer?.error || 'Unknown error'}</span>
                </div>
            `;
            
            // Clear the 3D viewer
            if (window.molecularViewer) {
                window.molecularViewer.clear();
            }
        }
    }
    
    load3DStructure() {
        const { conformer } = this.currentResults;
        
        console.log('load3DStructure called with:', conformer);
        console.log('window.molecularViewer available:', !!window.molecularViewer);
        
        if (!conformer || !conformer.pdb_block) {
            console.log('No conformer data or PDB block available');
            return;
        }
        
        // Wait for molecular viewer to be available
        const tryLoadMolecule = () => {
            if (window.molecularViewer) {
                // Prepare molecule info for the viewer
                const moleculeInfo = {
                    atom_count: conformer.atom_count || (conformer.pdb_block.match(/HETATM/g) || []).length,
                    forcefield_used: conformer.forcefield_used || 'UFF',
                    has_3d_coords: conformer.has_3d_coords !== false,
                    status: conformer.status || 'success'
                };
                
                console.log('Loading molecule into 3D viewer with info:', moleculeInfo);
                console.log('PDB block length:', conformer.pdb_block.length);
                
                // Load the molecule into the 3D viewer
                window.molecularViewer.loadMolecule(conformer.pdb_block, moleculeInfo);
            } else {
                console.log('Molecular viewer not ready, retrying in 100ms...');
                setTimeout(tryLoadMolecule, 100);
            }
        };
        
        tryLoadMolecule();
    }

    populateAdmetResults() {
        const container = document.getElementById('admetGrid');
        const { analysis } = this.currentResults;
        
        if (analysis && analysis.admet && analysis.admet.length > 0) {
            container.innerHTML = analysis.admet.map(pred => `
                <div class="property-item">
                    <span class="property-label">${pred.property}</span>
                    <span class="property-value">
                        ${typeof pred.value === 'number' ? pred.value.toFixed(3) : pred.value}
                        ${pred.unit || ''}
                    </span>
                </div>
            `).join('');
        } else {
            document.getElementById('admetResults').style.display = 'none';
        }
    }

    resetAnalysis() {
        this.currentResults = null;
        this.resetToInput();
        window.molecularApp.updateProgressSteps('input');
        window.molecularApp.clearMessages();
        
        // Clear 3D viewer
        if (window.molecularViewer) {
            window.molecularViewer.clear();
        }
        
        // Reset form
        const form = document.getElementById('analysisForm');
        if (form) {
            form.reset();
            document.getElementById('smilesInput').value = 'CCO';
            document.getElementById('charCount').textContent = '3';
        }
    }

    resetToInput() {
        this.hideAllSections();
        document.getElementById('inputSection').classList.remove('hidden');
        window.molecularApp.updateProgressSteps('input');
    }

    hideAllSections() {
        ['inputSection', 'loadingSection', 'resultsSection'].forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
    }

    showError(message) {
        window.molecularApp.showMessage(message, 'error');
        this.resetToInput();
    }
}

// Initialize analysis app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analysisApp = new AnalysisApp();
}); 