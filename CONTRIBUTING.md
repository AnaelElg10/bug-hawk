# Contributing to BugHawk

We love your input! We want to make contributing to BugHawk as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/your-username/bughawk.git`
3. **Run setup**: `./scripts/setup.sh`
4. **Create a branch**: `git checkout -b feature/amazing-feature`
5. **Make your changes**
6. **Run tests**: `npm run test`
7. **Commit your changes**: `git commit -m 'Add amazing feature'`
8. **Push to the branch**: `git push origin feature/amazing-feature`
9. **Open a Pull Request**

## 📋 Development Process

We use GitLab CI/CD for all changes to the code. Pull requests are the best way to propose changes to the codebase.

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/improvements

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(auth): add OAuth2 Google authentication
fix(api): resolve memory leak in WebSocket connections
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests for specific workspace
npm run test --workspace=apps/api
npm run test --workspace=apps/web
npm run test --workspace=packages/shared

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Guidelines

- Write tests for all new features
- Ensure tests pass before submitting PR
- Aim for >80% code coverage
- Use descriptive test names
- Mock external dependencies

### Test Structure

```typescript
describe('Feature Description', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## 📚 Code Style

We use ESLint and Prettier for code formatting. The configuration is already set up in the project.

### TypeScript Guidelines

- Use TypeScript for all new code
- Define proper interfaces and types
- Use strict type checking
- Avoid `any` type unless absolutely necessary

### React Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for prop types
- Follow React best practices

### NestJS Guidelines

- Use decorators appropriately
- Implement proper validation
- Use dependency injection
- Follow SOLID principles

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Environment Setup

1. Copy environment file: `cp .env.example .env`
2. Update variables in `.env`
3. Run setup script: `./scripts/setup.sh`

### Database Migrations

```bash
# Create migration
cd apps/api
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

## 📦 Package Management

We use npm workspaces for monorepo management.

### Adding Dependencies

```bash
# Root dependency
npm install package-name

# Workspace-specific dependency
npm install package-name --workspace=apps/api

# Dev dependency
npm install package-name --save-dev --workspace=apps/web
```

## 🚀 Deployment

### Staging Deployment

Automatically deployed when merging to `develop` branch.

### Production Deployment

Manually triggered when merging to `main` branch.

## 🐛 Bug Reports

Great Bug Reports tend to have:

- A quick summary and/or background
- Steps to reproduce
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening)

Use the bug report template when creating issues.

## 🆕 Feature Requests

We use GitHub issues to track feature requests. Please include:

- Detailed description of the feature
- Use cases and benefits
- Possible implementation approach
- Any relevant mockups or diagrams

## 📖 Documentation

- Update documentation for new features
- Include JSDoc comments for functions
- Update README if necessary
- Add examples for complex features

## 🔒 Security

### Reporting Security Issues

Please do not create public GitHub issues for security vulnerabilities. Instead:

1. Email security@bughawk.io
2. Include detailed description
3. Include steps to reproduce
4. We will respond within 48 hours

### Security Guidelines

- Never commit sensitive data
- Use environment variables for secrets
- Validate all user inputs
- Follow OWASP guidelines

## 📋 Code Review

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance implications considered
- [ ] Backward compatibility maintained

### Review Process

1. Automated checks must pass
2. At least one maintainer approval required
3. Address all feedback before merge
4. Squash commits when merging

## 🏷️ Release Process

We follow semantic versioning (SemVer):

- `MAJOR.MINOR.PATCH`
- MAJOR: breaking changes
- MINOR: new features (backward compatible)
- PATCH: bug fixes (backward compatible)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Community

- **Discord**: [Join our community](https://discord.gg/bughawk)
- **Discussions**: Use GitHub Discussions for questions
- **Twitter**: [@BugHawkHQ](https://twitter.com/bughawkhq)

## 🙏 Recognition

Contributors are recognized in our:

- README.md contributors section
- Release notes
- Annual contributor report

Thank you for contributing to BugHawk! 🎉