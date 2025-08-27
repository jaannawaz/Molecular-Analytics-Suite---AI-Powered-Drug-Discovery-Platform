# Contributing to Molecular Analytics Suite

Thank you for your interest in contributing to the Molecular Analytics Suite! This document provides guidelines and information for contributors.

## 🎯 Ways to Contribute

- **Bug Reports**: Report bugs through GitHub Issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit pull requests for bug fixes or features
- **Documentation**: Improve documentation and examples
- **Testing**: Add test cases and improve test coverage
- **UI/UX**: Enhance the user interface and experience

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Git
- Basic knowledge of FastAPI, Flask, and molecular chemistry
- Familiarity with RDKit (helpful but not required)

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/jaannawaz/Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform.git
cd Molecular-Analytics-Suite---AI-Powered-Drug-Discovery-Platform
```

2. **Backend Development**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e .
pip install -r requirements-dev.txt  # Development dependencies
```

3. **Frontend Development**
```bash
cd flask_frontend
pip install -r requirements.txt
```

4. **Run Tests**
```bash
cd backend
python -m pytest tests/ -v
```

## 🔧 Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Test improvements

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(api): add new molecular descriptor calculation`
- `fix(3d-viewer): resolve structure loading issue`
- `docs(readme): update installation instructions`
- `test(agents): add comprehensive agent testing`

## 🧪 Code Standards

### Python Code Style
- Follow PEP 8
- Use type hints where possible
- Maximum line length: 88 characters (Black formatter)
- Use docstrings for all functions and classes

### Example Function Documentation
```python
def calculate_molecular_weight(smiles: str) -> float:
    """Calculate the molecular weight from a SMILES string.
    
    Args:
        smiles: A valid SMILES notation string
        
    Returns:
        The molecular weight in g/mol
        
    Raises:
        ValueError: If SMILES string is invalid
    """
    pass
```

### JavaScript Code Style
- Use ES6+ features
- Consistent indentation (2 spaces)
- Meaningful variable names
- Add comments for complex logic

## 🧬 Adding New Features

### Adding New Molecular Descriptors
1. Update `backend/app/services/rdkit_utils.py`
2. Add calculation logic to `mol_summary()` method
3. Add corresponding tests
4. Update API documentation

### Adding New File Format Support
1. Update `flask_frontend/static/js/file-upload.js`
2. Add parser logic for the new format
3. Update backend processing if needed
4. Add validation and error handling

### Adding New 3D Visualization Features
1. Update `flask_frontend/static/js/molecular-viewer.js`
2. Test with various molecular structures
3. Ensure cross-browser compatibility
4. Update user documentation

## 🧪 Testing Guidelines

### Writing Tests
- Write tests for all new functionality
- Include edge cases and error conditions
- Use descriptive test names
- Maintain >80% test coverage

### Test Categories
- **Unit Tests**: Test individual functions/methods
- **Integration Tests**: Test component interactions
- **API Tests**: Test REST endpoints
- **UI Tests**: Test frontend functionality

### Running Tests
```bash
# All tests
python -m pytest tests/

# Specific test file
python -m pytest tests/test_rdkit_utils.py -v

# With coverage
python -m pytest tests/ --cov=app --cov-report=html
```

## 📚 Documentation

### Code Documentation
- Document all public functions and classes
- Include usage examples
- Explain complex algorithms
- Update docstrings when modifying functions

### User Documentation
- Update README.md for new features
- Add examples to usage sections
- Update API documentation
- Include screenshots for UI changes

## 🐛 Bug Reports

### Before Submitting
- Check existing issues to avoid duplicates
- Test with the latest version
- Gather relevant information

### Bug Report Template
```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 10, macOS 12.0, Ubuntu 20.04]
- Python Version: [e.g., 3.9.7]
- Browser: [e.g., Chrome 96.0, Firefox 95.0]
- Version: [e.g., v1.2.0]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.
```

## 🔍 Code Review Process

### Pull Request Guidelines
1. **Title**: Clear, descriptive title
2. **Description**: Explain what and why
3. **Testing**: Include test results
4. **Documentation**: Update relevant docs
5. **Screenshots**: For UI changes

### Review Criteria
- Code quality and style
- Test coverage
- Documentation completeness
- Performance impact
- Security considerations

## 🏷️ Release Process

### Version Numbers
We use Semantic Versioning (SemVer):
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches

### Communication
- Use clear, professional language
- Be patient with questions
- Provide helpful, actionable feedback
- Acknowledge good contributions

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation
- Special mentions for significant contributions

## 📞 Getting Help

- **Documentation**: Check the README and Wiki
- **Issues**: Search existing issues first
- **Discussions**: Use GitHub Discussions for questions
- **Email**: For sensitive matters only

## 🎉 Thank You!

Every contribution, no matter how small, helps make this project better. We appreciate your time and effort in contributing to the Molecular Analytics Suite!

---

*This contributing guide is a living document and will be updated as the project evolves.* 