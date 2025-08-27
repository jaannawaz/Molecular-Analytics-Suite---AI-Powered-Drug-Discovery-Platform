/**
 * File Upload and Input Method Handler
 * Handles SDF, PDB, MOL, XYZ file uploads and tab switching
 */

class FileUploadHandler {
    constructor() {
        this.currentFile = null;
        this.currentInputMethod = 'smiles';
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchInputMethod(e.target.dataset.method);
            });
        });
        
        // File input
        const fileInput = document.getElementById('fileInput');
        const fileUploadArea = document.getElementById('fileUploadArea');
        const removeFileBtn = document.getElementById('removeFile');
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        
        if (fileUploadArea) {
            // Drag and drop
            fileUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            fileUploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            fileUploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));
            
            // Click to select
            fileUploadArea.addEventListener('click', () => {
                if (fileInput) fileInput.click();
            });
        }
        
        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', () => this.removeFile());
        }
    }
    
    switchInputMethod(method) {
        this.currentInputMethod = method;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.method === method);
        });
        
        // Update input sections
        document.querySelectorAll('.input-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = method === 'smiles' ? 'smilesInputSection' : 'fileInputSection';
        document.getElementById(targetSection).classList.add('active');
        
        // Clear errors
        this.clearErrors();
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('.file-upload-area').classList.add('dragover');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('.file-upload-area').classList.remove('dragover');
    }
    
    handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('.file-upload-area').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }
    
    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }
    
    processFile(file) {
        // Validate file type
        const allowedExtensions = ['.sdf', '.pdb', '.mol', '.xyz'];
        const fileName = file.name.toLowerCase();
        const isValidType = allowedExtensions.some(ext => fileName.endsWith(ext));
        
        if (!isValidType) {
            this.showError('fileError', 'Invalid file type. Please upload SDF, PDB, MOL, or XYZ files.');
            return;
        }
        
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.showError('fileError', 'File too large. Maximum size is 10MB.');
            return;
        }
        
        this.currentFile = file;
        this.updateFileInfo(file);
        this.clearErrors();
    }
    
    updateFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        const fileName = fileInfo.querySelector('.file-name');
        const fileSize = fileInfo.querySelector('.file-size');
        const uploadArea = document.getElementById('fileUploadArea');
        
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
        
        fileInfo.style.display = 'flex';
        uploadArea.style.display = 'none';
    }
    
    removeFile() {
        this.currentFile = null;
        const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        const uploadArea = document.getElementById('fileUploadArea');
        
        if (fileInput) fileInput.value = '';
        if (fileInfo) fileInfo.style.display = 'none';
        if (uploadArea) uploadArea.style.display = 'block';
        
        this.clearErrors();
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'flex';
        }
    }
    
    clearErrors() {
        const errorElements = ['smilesError', 'fileError'];
        errorElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '';
                element.style.display = 'none';
            }
        });
    }
    
    async readFileContent() {
        if (!this.currentFile) return null;
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(this.currentFile);
        });
    }
    
    getInputData() {
        if (this.currentInputMethod === 'smiles') {
            const smilesInput = document.getElementById('smilesInput');
            return {
                type: 'smiles',
                data: smilesInput ? smilesInput.value.trim() : ''
            };
        } else if (this.currentInputMethod === 'file' && this.currentFile) {
            return {
                type: 'file',
                fileName: this.currentFile.name,
                fileType: this.getFileType(this.currentFile.name),
                file: this.currentFile
            };
        }
        return null;
    }
    
    getFileType(fileName) {
        const ext = fileName.toLowerCase().split('.').pop();
        const typeMap = {
            'sdf': 'sdf',
            'pdb': 'pdb',
            'mol': 'mol',
            'xyz': 'xyz'
        };
        return typeMap[ext] || 'unknown';
    }
}

// Initialize file upload handler when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.fileUploadHandler = new FileUploadHandler();
});

// Export for use in other scripts
window.FileUploadHandler = FileUploadHandler; 