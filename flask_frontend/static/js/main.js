// Main JavaScript for Molecular Analytics Suite
class MolecularApp {
    constructor() {
        this.backendUrl = '/api';
        this.init();
    }

    init() {
        this.checkBackendHealth();
        this.setupEventListeners();
        
        // Check backend health every 30 seconds
        setInterval(() => this.checkBackendHealth(), 30000);
    }

    setupEventListeners() {
        // Character counter for SMILES input
        const smilesInput = document.getElementById('smilesInput');
        const charCount = document.getElementById('charCount');
        
        if (smilesInput && charCount) {
            smilesInput.addEventListener('input', (e) => {
                charCount.textContent = e.target.value.length;
            });
        }

        // Example cards click handlers
        document.querySelectorAll('.example-card').forEach(card => {
            card.addEventListener('click', () => {
                const smiles = card.dataset.smiles;
                if (smilesInput) {
                    smilesInput.value = smiles;
                    if (charCount) {
                        charCount.textContent = smiles.length;
                    }
                    // Trigger analysis if on main page
                    if (typeof window.analysisApp !== 'undefined') {
                        window.analysisApp.analyzeSmiles(smiles);
                    }
                }
            });
        });
    }

    async checkBackendHealth() {
        const statusIndicator = document.getElementById('backendStatus');
        if (!statusIndicator) return;

        const statusDot = statusIndicator.querySelector('.status-dot');
        const statusText = statusIndicator.querySelector('.status-text');

        try {
            const response = await fetch(`${this.backendUrl}/health`);
            const data = await response.json();
            
            if (response.ok) {
                statusDot.className = 'status-dot online';
                statusText.textContent = 'Backend Online';
                statusIndicator.title = `✅ Backend healthy - ${data.endpoints?.length || 0} endpoints available`;
            } else {
                throw new Error('Backend returned error');
            }
        } catch (error) {
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'Backend Offline';
            statusIndicator.title = `❌ Backend unavailable: ${error.message}`;
        }
    }

    showMessage(message, type = 'info') {
        const container = document.getElementById('messageContainer');
        if (!container) return;

        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        
        const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        messageEl.innerHTML = `
            <span>${icon}</span>
            <span>${message}</span>
        `;

        container.appendChild(messageEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }

    clearMessages() {
        const container = document.getElementById('messageContainer');
        if (container) {
            container.innerHTML = '';
        }
    }

    updateProgressSteps(currentStep) {
        const steps = ['input', 'analysis', 'results'];
        const stepElements = document.querySelectorAll('.step');
        const connectors = document.querySelectorAll('.step-connector');

        stepElements.forEach((step, index) => {
            const stepName = steps[index];
            step.classList.remove('active', 'completed');
            
            if (stepName === currentStep) {
                step.classList.add('active');
            } else if (steps.indexOf(stepName) < steps.indexOf(currentStep)) {
                step.classList.add('completed');
            }
        });

        connectors.forEach((connector, index) => {
            connector.classList.toggle('completed', 
                steps.indexOf(steps[index + 1]) <= steps.indexOf(currentStep));
        });
    }

    formatDescriptorName(key) {
        const names = {
            'heavy_atom_count': 'Heavy Atoms',
            'atom_count': 'Total Atoms',
            'bond_count': 'Bonds',
            'ring_count': 'Rings',
            'aromatic_ring_count': 'Aromatic Rings',
            'logp': 'LogP',
            'hbd': 'H-Bond Donors',
            'hba': 'H-Bond Acceptors',
            'rotatable_bonds': 'Rotatable Bonds',
            'tpsa': 'TPSA (Ų)',
            'formal_charge': 'Formal Charge',
            'molar_refractivity': 'Molar Refractivity',
            'fraction_sp3': 'Fraction Csp3',
            'bertz_ct': 'Bertz CT',
            'balaban_j': 'Balaban J',
            'slogp': 'SLogP',
            'lipinski_violations': 'Lipinski Violations'
        };
        return names[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getDescriptorColor(key, value) {
        if (typeof value !== 'number') return '';
        
        switch (key) {
            case 'lipinski_violations':
                return value === 0 ? 'good' : value <= 1 ? 'warning' : 'bad';
            case 'logp':
                return value <= 5 ? 'good' : 'bad';
            case 'hbd':
                return value <= 5 ? 'good' : 'bad';
            case 'hba':
                return value <= 10 ? 'good' : 'bad';
            case 'tpsa':
                return value <= 140 ? 'good' : 'warning';
            case 'rotatable_bonds':
                return value <= 10 ? 'good' : 'warning';
            default:
                return '';
        }
    }

    formatNumber(value, decimals = 2) {
        if (typeof value !== 'number') return value;
        return Number(value.toFixed(decimals));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.molecularApp = new MolecularApp();
}); 