# Contribution Guidelines

Thank you for your interest in contributing to EDU TRACK PRO! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs
1. Check if the issue already exists in [GitHub Issues](https://github.com/zenithkandel/IoT-RFID-Attendance-System-1/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, browser, XAMPP version)
   - Screenshots if applicable

### Suggesting Features
1. Open a new issue with tag `enhancement`
2. Describe the feature and its benefits
3. Provide use cases and examples

### Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/IoT-RFID-Attendance-System-1.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages: `git commit -m "Add: Feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

#### Code Style
- **PHP**: Follow PSR-12 coding standards
- **JavaScript**: Use ES6+ syntax, camelCase naming
- **HTML/CSS**: Use semantic HTML, BEM naming convention
- **Comments**: Write clear, concise comments
- **Indentation**: 4 spaces for PHP, 2 spaces for JS/HTML/CSS

#### Commit Message Format
```
Type: Brief description

Detailed explanation (optional)

Fixes #issue_number (if applicable)
```

**Types:**
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Improve existing feature
- `Refactor:` Code restructuring
- `Docs:` Documentation changes
- `Style:` Formatting changes
- `Test:` Add/update tests

#### Pull Request Guidelines
- Keep PRs focused on a single feature/fix
- Update documentation if needed
- Ensure all tests pass
- Add screenshots for UI changes
- Link related issues

### Testing
Before submitting:
1. Test all affected functionality
2. Test on multiple browsers (Chrome, Firefox, Edge)
3. Test responsive design on mobile
4. Verify database operations work correctly
5. Check for console errors

### Code Review Process
1. Maintainers review PRs within 3-5 business days
2. Address requested changes
3. Once approved, maintainers will merge

## Development Setup

### Requirements
- XAMPP (Apache + MySQL)
- Arduino IDE with ESP8266 support
- Modern browser (Chrome, Firefox, Edge)
- Git

### Local Setup
1. Install XAMPP and start Apache + MySQL
2. Clone repository to `C:\xampp\htdocs\projects\iot\`
3. Import `edutrack.sql` into phpMyAdmin
4. Open `http://localhost/projects/iot/IoT-RFID-Attendance-System-/`

### Database Changes
- Always update `edutrack.sql` with schema changes
- Test migrations thoroughly
- Document breaking changes

### API Changes
- Update `API/README.md` with new/modified endpoints
- Maintain backward compatibility when possible
- Add request/response examples

## What We're Looking For

### High Priority
- Bug fixes and security improvements
- Performance optimizations
- Mobile responsiveness enhancements
- Documentation improvements
- Test coverage

### Medium Priority
- New features (with discussion first)
- UI/UX improvements
- Code refactoring
- Localization support

### Low Priority
- Minor style tweaks
- Non-critical optimizations

## Areas Needing Help

### Backend
- API rate limiting
- Advanced caching
- Database query optimization
- Backup/restore functionality

### Frontend
- Progressive Web App (PWA) support
- Offline mode
- Advanced analytics visualizations
- Accessibility improvements

### Hardware
- Multi-reader support
- Alternative RFID modules
- Power optimization
- Hardware documentation

### DevOps
- Docker containerization
- CI/CD pipeline
- Automated testing
- Deployment scripts

## Community

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers
- Stay on topic

### Getting Help
- Check existing documentation
- Search GitHub Issues
- Ask in discussion forums
- Contact maintainers

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Credited in documentation

Thank you for making EDU TRACK PRO better! 🎉

---

**Questions?** Open a discussion or contact maintainers:
- Sakshyam Bastakoti - [@they-call-me-electronerd](https://github.com/they-call-me-electronerd)
- Zenith Kandel - [@zenithkandel](https://github.com/zenithkandel)
