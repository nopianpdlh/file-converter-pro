# 🤝 Contributing to File Converter Pro

Terima kasih atas minat Anda untuk berkontribusi! Kami sangat menghargai kontribusi dari community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Development Guidelines](#development-guidelines)

## 📜 Code of Conduct

Project ini mengikuti [Contributor Covenant](https://www.contributor-covenant.org/). Dengan berpartisipasi, Anda diharapkan menjunjung tinggi kode etik ini.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- Git

### Fork & Clone

```bash
# Fork repository di GitHub, kemudian clone
git clone https://github.com/YOUR_USERNAME/file-converter-pro.git
cd file-converter-pro

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/file-converter-pro.git
```

## 💻 Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run in different terminal untuk hot reload
npm run build
```

### Environment Setup

```bash
# Copy environment variables (jika ada)
cp .env.example .env.local
```

## 🔄 Making Changes

### 1. Create Branch

```bash
# Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# atau
git checkout -b fix/your-bug-fix
```

### 2. Development Workflow

```bash
# Make your changes
# ...

# Test your changes
npm run lint
npm run build

# Commit changes
git add .
git commit -m "feat: add amazing new feature"
```

### 3. Commit Convention

Kami menggunakan [Conventional Commits](https://conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

**Examples:**

```bash
git commit -m "feat: add video compression options"
git commit -m "fix: resolve memory leak in file processing"
git commit -m "docs: update installation guide"
```

## 🔍 Pull Request Process

### 1. Before Submitting

- [ ] Code passes all linting checks (`npm run lint`)
- [ ] Build completes successfully (`npm run build`)
- [ ] All existing functionality works
- [ ] New features have appropriate documentation
- [ ] Changes are tested manually

### 2. Submit PR

```bash
# Push to your fork
git push origin feature/your-feature-name
```

1. Open Pull Request di GitHub
2. Fill PR template dengan lengkap
3. Link related issues
4. Request review dari maintainers

### 3. PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested manually
- [ ] Added unit tests
- [ ] Updated documentation

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

## 🐛 Bug Reports

### Good Bug Report Contains:

1. **Clear Title** - Descriptive summary
2. **Environment** - Browser, OS, version
3. **Steps to Reproduce** - Exact steps
4. **Expected Behavior** - What should happen
5. **Actual Behavior** - What actually happens
6. **Screenshots** - If applicable
7. **Additional Context** - Any other relevant info

### Bug Report Template:

```markdown
**Environment:**

- Browser: Chrome 91.0
- OS: Windows 10
- Device: Desktop

**Steps to Reproduce:**

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
A clear description of what you expected to happen.

**Actual Behavior:**
A clear description of what actually happened.

**Screenshots:**
If applicable, add screenshots.

**Additional Context:**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Good Feature Request Contains:

1. **Problem Statement** - What problem does this solve?
2. **Proposed Solution** - How should it work?
3. **Use Cases** - Who will use this feature?
4. **Alternatives** - Other solutions considered?
5. **Additional Context** - Mockups, examples, etc.

### Feature Request Template:

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Use Cases**
Who would use this feature and how?

**Additional Context**
Mockups, examples, or other context.
```

## 📐 Development Guidelines

### Code Style

- **TypeScript** - Semua file baru harus TypeScript
- **ESLint** - Follow existing linting rules
- **Prettier** - Auto-formatting enabled
- **Naming Conventions**:
  - Components: PascalCase (`FileUploader.tsx`)
  - Functions: camelCase (`convertFile()`)
  - Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### Component Guidelines

```typescript
// ✅ Good - Functional component with TypeScript
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<ComponentProps> = ({ title, onAction }) => {
  const [state, setState] = useState<string>("");

  return (
    <div className="component-wrapper">
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

// ❌ Avoid - Class components (use functional)
class MyComponent extends React.Component {
  // ...
}
```

### File Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements
│   └── features/       # Feature-specific components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── store/              # State management
```

### Testing

```typescript
// Add tests for new features
describe("FileUploader", () => {
  it("should accept valid file formats", () => {
    // Test implementation
  });

  it("should reject invalid file formats", () => {
    // Test implementation
  });
});
```

### Performance Guidelines

- Use `React.memo()` untuk komponen yang sering re-render
- Implement proper loading states
- Optimize bundle size dengan lazy loading
- Use Web Workers untuk processing berat

### Security Guidelines

- Validate semua user input
- Sanitize file names dan content
- Implement proper error handling
- No sensitive data di localStorage

## 🎯 Areas for Contribution

### 🆕 Beginner Friendly

- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Adding file format support
- Improving error messages

### 🔧 Intermediate

- Performance optimizations
- New conversion features
- Mobile responsiveness
- Accessibility improvements
- Testing coverage

### 🚀 Advanced

- Architecture improvements
- WebAssembly optimizations
- PWA features
- Advanced file processing
- Security enhancements

## 📞 Getting Help

- **Discord**: [Join our Discord](https://discord.gg/your-server)
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/file-converter-pro/issues)
- **Email**: your.email@example.com

## 🏆 Recognition

Contributors akan diakui di:

- README.md contributor section
- Release notes
- Hall of Fame page (if implemented)

---

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)

---

**Thank you for contributing! 🙏**
