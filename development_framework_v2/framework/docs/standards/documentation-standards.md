# Documentation Standards - Framework v2

## 📚 MANDATORY DOCUMENTATION RULES

### **Placement Rules (NON-NEGOTIABLE)**

#### **ALL Documentation Must Be in `docs/` Folder**
- **General Documentation**: `docs/`
- **Agent-Specific Documentation**: `docs/agents/`
- **Workflow Documentation**: `docs/workflows/`
- **Architecture Documentation**: `docs/architecture/`
- **Templates**: `docs/templates/`
- **Guides**: `docs/guides/`
- **Configuration**: `docs/configuration/`

#### **README Files Exception**
- **README files**: Only allowed in subfolders
- **Must reference**: Additional documentation in `docs/` folder
- **Cross-references**: All README files must include links to relevant docs

### **File Naming Rules (STRICT)**

#### **Documentation Files**
- **MUST use lowercase**: `api-documentation.md`, `user-guide.md`, `setup-instructions.md`
- **NO UPPERCASE**: Documentation files must NEVER use uppercase letters
- **Descriptive names**: Use clear, descriptive filenames
- **Valid suffixes**: `.md`, `.mdc`, `.txt`, `_guide.md`, `_tutorial.md`, `_reference.md`

#### **README Files**
- **Always**: `README.md` (uppercase README, lowercase md)
- **Location**: Only in subfolders, not in root `docs/` folder

### **Content Standards (MANDATORY)**

#### **Structure Requirements**
- **Headings**: Use proper heading hierarchy (`#`, `##`, `###`)
- **Length**: Minimum 100 characters for meaningful documentation
- **Completeness**: Comprehensive coverage of the topic
- **Clarity**: Clear, concise, and professional tone

#### **Quality Indicators**
- **Comprehensive**: Complete coverage of all relevant aspects
- **Detailed**: Sufficient detail for understanding and implementation
- **Structured**: Well-organized with clear sections
- **Clear**: Easy to understand and follow
- **Complete**: All necessary information included

### **Cross-Reference Requirements**

#### **README Files Must Include**
- **Links to docs/**: Reference relevant documentation in `docs/` folder
- **Navigation**: Clear navigation to related documentation
- **Overview**: Brief overview with links to detailed docs

#### **Documentation Files Must Include**
- **Cross-references**: Links to related documentation
- **Navigation**: Clear navigation between related topics
- **Consistency**: Consistent linking patterns

## 🚫 COMMON VIOLATIONS TO AVOID

### **Placement Violations**
- ❌ Creating documentation files outside `docs/` folder
- ❌ Placing README files in root `docs/` folder
- ❌ Creating documentation in random locations

### **Naming Violations**
- ❌ Using uppercase letters in documentation filenames
- ❌ Using unclear or generic filenames
- ❌ Not using proper documentation suffixes

### **Content Violations**
- ❌ Creating documentation without proper structure
- ❌ Writing documentation that's too short or incomplete
- ❌ Not including cross-references to related documentation

## ✅ EXAMPLES OF CORRECT IMPLEMENTATION

### **Correct File Placement**
```
project/
├── docs/
│   ├── api-documentation.md
│   ├── user-guide.md
│   ├── setup-instructions.md
│   ├── agents/
│   │   └── mission-analyst-guide.md
│   └── workflows/
│       └── standard-workflow-reference.md
├── src/
│   └── README.md  # References docs/ for detailed information
└── tests/
    └── README.md  # References docs/ for testing guidelines
```

### **Correct File Naming**
- ✅ `api-documentation.md`
- ✅ `user-guide.md`
- ✅ `setup-instructions.md`
- ✅ `mission-analyst-guide.md`
- ✅ `standard-workflow-reference.md`
- ✅ `README.md` (in subfolders only)

### **Incorrect File Naming**
- ❌ `API-Documentation.md`
- ❌ `UserGuide.md`
- ❌ `SetupInstructions.md`
- ❌ `Mission-Analyst-Guide.md`
- ❌ `Standard-Workflow-Reference.md`

## 🔧 IMPLEMENTATION CHECKLIST

### **Before Creating Documentation**
- [ ] Determine if it's a README (subfolder only) or regular documentation (docs/ folder)
- [ ] Choose appropriate location in `docs/` folder structure
- [ ] Use lowercase filename with descriptive name
- [ ] Plan cross-references to related documentation

### **While Creating Documentation**
- [ ] Use proper heading hierarchy
- [ ] Include comprehensive content (minimum 100 characters)
- [ ] Add cross-references to related documentation
- [ ] Ensure clear, professional tone
- [ ] Include quality indicators (comprehensive, detailed, structured, clear, complete)

### **After Creating Documentation**
- [ ] Verify file is in correct location (`docs/` folder)
- [ ] Verify filename uses lowercase naming
- [ ] Verify content meets quality standards
- [ ] Verify cross-references are included
- [ ] Update related README files with links to new documentation

## 📋 QUALITY GATES FOR DOCUMENTATION

### **Placement Gate**
- [ ] Documentation file is in `docs/` folder (or README in subfolder)
- [ ] File location follows proper folder structure
- [ ] No documentation files in incorrect locations

### **Naming Gate**
- [ ] Filename uses lowercase letters
- [ ] Filename is descriptive and clear
- [ ] Filename uses proper documentation suffix
- [ ] README files use `README.md` format

### **Content Gate**
- [ ] Documentation has proper heading structure
- [ ] Documentation is comprehensive (minimum 100 characters)
- [ ] Documentation includes quality indicators
- [ ] Documentation has clear, professional tone
- [ ] Documentation includes cross-references

### **Cross-Reference Gate**
- [ ] README files reference relevant docs in `docs/` folder
- [ ] Documentation files link to related documentation
- [ ] Navigation is clear and consistent
- [ ] Links are functional and relevant

---

**These documentation standards are MANDATORY for all Framework v2 personas and must be enforced through quality gates and validation processes.**
