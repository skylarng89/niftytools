# Automated Versioning Guide

NiftyTools uses **Changesets** for automated semantic versioning across the monorepo. This enables independent package versioning based on conventional commits.

## How It Works

### 1. Conventional Commits
Use conventional commit format for all changes:

```bash
# Feature (minor version bump)
git commit -m "feat(backend): add user authentication"

# Bug fix (patch version bump)  
git commit -m "fix(user-frontend): resolve button styling issue"

# Breaking change (major version bump)
git commit -m "feat(shared)!: update API interfaces"

# Documentation
git commit -m "docs: update installation guide"

# Chore/maintenance
git commit -m "chore(deps): update dependencies"
```

### 2. Scopes Available
- `backend` - Backend API server
- `user-frontend` - User interface
- `admin-frontend` - Admin interface  
- `shared` - Shared types and utilities
- `api-client` - API client library
- `ui-components` - UI component library
- `text-tools` - Text tools plugin
- `auth` - Authentication plugin
- `core` - Core functionality
- `deps` - Dependencies
- `workflow` - CI/CD workflow
- `docker` - Docker configuration

### 3. Automated Workflow

#### On Main Branch Push:
1. **Changesets Analysis**: Detects which packages changed based on conventional commits
2. **Version Calculation**: Determines version bumps (patch/minor/major)
3. **Dependency Updates**: Auto-updates dependent packages
4. **Changelog Generation**: Creates GitHub-linked changelogs
5. **Release Creation**: Publishes GitHub releases with clean tags

#### Example Flow:
```bash
# 1. Make changes with conventional commits
git commit -m "feat(backend): add JWT authentication"
git commit -m "fix(user-frontend): resolve login form validation"

# 2. Push to main
git push origin main

# 3. CI automatically:
#    - backend: 0.1.0 → 0.2.0 (feat = minor)
#    - user-frontend: 0.1.0 → 0.1.1 (fix = patch)
#    - Creates releases: v0.2.0-backend, v0.1.1-user-frontend
```

## Manual Operations

### Creating Changesets Manually
```bash
# Interactive changeset creation
bun run changeset

# Manual version updates (for testing)
bun run version-packages

# Manual release (CI handles this automatically)
bun run release
```

### Version Strategies

#### Independent Versioning
Each package maintains its own version:
- ✅ **backend**: `0.2.0`
- ✅ **user-frontend**: `1.0.0` 
- ✅ **admin-frontend**: `0.2.0`
- ✅ **shared**: `0.2.0`

#### Smart Dependencies
When shared packages change, dependents auto-update:
```bash
# shared: 0.2.0 → 1.0.0 (breaking change)
# → backend: 0.2.0 → 1.0.0 (depends on shared)
# → user-frontend: 1.0.0 → 2.0.0 (depends on shared)
```

## Release Tags

### Format
- Individual packages: `@niftytools/backend@0.2.0`
- GitHub releases: Clean semantic versions (`v0.2.0`)
- Docker images: Timestamped (`main-20250127-123456-abcd1234`)

### Benefits
- ✅ **Zero Manual Work**: Commit → Release automatically
- ✅ **Professional Changelogs**: GitHub-linked with proper formatting
- ✅ **Smart Dependencies**: Cascade updates when needed
- ✅ **Independent Lifecycles**: Each package versions independently
- ✅ **Industry Standard**: Used by React, Vue, and major OSS projects

## Commit Validation

### Pre-commit Hooks
- **commitlint**: Validates conventional commit format
- **husky**: Enforces commit message standards

### Valid Examples
```bash
✅ feat(backend): add user registration
✅ fix(user-frontend): resolve responsive layout
✅ docs: update API documentation
✅ chore(deps): update Vue to 3.5.0
✅ feat(shared)!: breaking API changes
```

### Invalid Examples
```bash
❌ added new feature
❌ fixed bug
❌ updated docs
❌ WIP: work in progress
```

## Troubleshooting

### Commit Rejected
```bash
# Error: Invalid commit format
git commit -m "updated feature"

# Fix: Use conventional format
git commit -m "feat(backend): update user authentication"
```

### Manual Version Override
```bash
# Force version for specific package
echo '---
"@niftytools/backend": major
---

Force major version bump
' > .changeset/force-major.md

bun run version-packages
```

### Release Issues
- Check GitHub Actions logs in repository
- Ensure GITHUB_TOKEN has proper permissions
- Verify package.json versions are consistent

## Best Practices

1. **Descriptive Commits**: Explain why, not just what
2. **Atomic Changes**: One logical change per commit
3. **Test Before Push**: Ensure changes work as expected
4. **Review Changelogs**: Check generated changelogs for accuracy
5. **Monitor Releases**: Verify automated releases complete successfully

This system provides Netflix/Spotify-level automated versioning with zero manual intervention! 🚀