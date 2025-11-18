# Contributing to FuzzySet.js

Thank you for your interest in contributing to FuzzySet.js! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [License](#license)

## Code of Conduct

This project follows a simple code of conduct: be respectful, be professional, and be constructive. We welcome contributions from everyone.

## Getting Started

Before contributing, please:
1. Check existing issues to see if your problem/feature has been discussed
2. For major changes, open an issue first to discuss your proposed changes
3. For bug fixes, please include steps to reproduce the bug

## Development Setup

### Prerequisites
- Node.js >= 0.4.0 (though a modern version is recommended)
- npm or your preferred package manager

### Setup Steps

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fuzzyset.js.git
   cd fuzzyset.js
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. The build outputs will be in the `dist/` directory

### Project Structure

```
fuzzyset.js/
├── src/
│   └── fuzzyset.ts        # Main source code
├── dist/                   # Build output (generated)
│   ├── fuzzyset.cjs       # CommonJS build
│   ├── fuzzyset.mjs       # ES Module build
│   └── fuzzyset.d.ts      # TypeScript declarations
├── package.json
├── tsconfig.json
└── README.MD
```

## How to Contribute

### Types of Contributions

1. **Bug Reports**: Open an issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Code samples if applicable

2. **Feature Requests**: Open an issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach

3. **Code Contributions**:
   - Bug fixes
   - New features (after discussion)
   - Performance improvements
   - Documentation improvements
   - Test additions

4. **Documentation**:
   - Improving README
   - Adding code examples
   - Fixing typos
   - API documentation improvements

## Coding Standards

### TypeScript Style

- Use TypeScript for all code
- Provide proper type annotations
- Avoid `any` types when possible
- Use meaningful variable and function names

### Code Style

```typescript
// Good
private calculateScore(str1: string, str2: string): number {
  const distance = this.levenshtein(str1, str2);
  return str1.length > str2.length
    ? 1 - distance / str1.length
    : 1 - distance / str2.length;
}

// Bad
private calc(s1, s2) {
  const d = this.levenshtein(s1, s2);
  return s1.length > s2.length ? 1 - d / s1.length : 1 - d / s2.length;
}
```

### Best Practices

1. **Keep methods focused**: Each method should do one thing well
2. **Add comments for complex logic**: Especially for algorithm implementations
3. **Maintain backward compatibility**: Don't break existing APIs without discussion
4. **Performance matters**: This is a performance-sensitive library
5. **Memory efficiency**: Be mindful of memory usage for large datasets

### ESLint

The project uses ESLint with TypeScript support. Run linting with:
```bash
npm run lint        # (if configured)
```

## Testing Guidelines

### Current State
Currently, the project lacks comprehensive tests. **Adding tests is a high-priority contribution!**

### Testing Recommendations

When adding tests, consider:

1. **Unit Tests**: Test individual methods
   ```typescript
   test('add() should not add duplicates', () => {
     const fs = FuzzySet([]);
     fs.add('apple');
     fs.add('apple');
     expect(fs.length()).toBe(1);
   });
   ```

2. **Integration Tests**: Test complete workflows
   ```typescript
   test('fuzzy matching workflow', () => {
     const fs = FuzzySet(['Michael']);
     const result = fs.get('Micael');
     expect(result).toBeDefined();
     expect(result[0][1]).toBe('Michael');
   });
   ```

3. **Edge Cases**:
   - Empty strings
   - Special characters
   - Unicode characters
   - Very long strings
   - Case sensitivity

4. **Performance Tests**: For large datasets

### Suggested Testing Framework
- Jest or Vitest recommended
- Add to `package.json`:
  ```json
  {
    "scripts": {
      "test": "vitest run",
      "test:watch": "vitest"
    }
  }
  ```

## Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages:

```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat: add remove() method to delete items from set

Implement a new remove() method that allows users to delete
specific strings from the FuzzySet. This maintains internal
consistency across all gram size indices.

Closes #123
```

```
fix: handle null values in distance calculation

Previously, comparing null values would throw an error.
Now properly handles null/undefined inputs.

Fixes #456
```

```
docs: improve API documentation with more examples

Add comprehensive examples for common use cases including
spell checking, name matching, and product search.
```

## Pull Request Process

### Before Submitting

1. **Update from main**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Build succeeds**:
   ```bash
   npm run build
   ```

3. **Linting passes** (if configured)

4. **Tests pass** (when tests are added)

5. **Documentation updated**: If adding features or changing APIs

### PR Description

Include in your PR:
- **What**: What does this PR do?
- **Why**: Why is this change needed?
- **How**: How does it work?
- **Testing**: How was it tested?
- **Related Issues**: Link to related issues

### Example PR Description

```markdown
## What
Adds a `remove()` method to delete items from the FuzzySet.

## Why
Users have requested the ability to remove items from the set
without recreating it. This is useful for dynamic datasets.

## How
- Implemented `remove()` method in FuzzySearch class
- Updates all internal data structures (exactSet, matchDict, items)
- Maintains consistency across all gram sizes

## Testing
- Tested with manual examples
- Handles edge cases: non-existent items, empty set

## Related Issues
Closes #123
```

### Review Process

1. Maintainer will review your PR
2. Address any requested changes
3. Once approved, maintainer will merge
4. Your contribution will be in the next release!

## License

### Code Contributions

By contributing code to this project, you agree that your contributions will be licensed under the [Prosperity Public License 3.0](LICENSE.md).

Important notes about this license:
- **Non-commercial use**: Free for personal, educational, and non-commercial projects
- **Commercial use**: Requires a one-time license fee after 30-day trial
- **Contributions**: Your contributions back to the project are exempt from commercial restrictions

### Contribution Terms

When you contribute, you're licensing your contribution under terms compatible with the project's license. The maintainer may ask you to confirm your agreement to these terms.

## Questions?

If you have questions about contributing:
1. Check existing issues and discussions
2. Open a new issue with the `question` label
3. Contact the maintainer through GitHub

---

Thank you for contributing to FuzzySet.js! 🎉
