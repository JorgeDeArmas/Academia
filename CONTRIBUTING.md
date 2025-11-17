# Contributing to Academia

Thank you for your interest in contributing to Academia! This document provides guidelines and instructions for contributing.

## 🎯 Project Vision

Academia aims to empower Hispanic TikTok Shop creators by providing data-driven insights about similar creators, trending content, and successful products. The platform should remain:

- **User-friendly** - Simple, intuitive interface
- **Mobile-first** - Optimized for mobile creators
- **Spanish-focused** - Culturally relevant for Hispanic market
- **Data-driven** - Actionable insights over vanity metrics
- **Extensible** - Easy to add new features

## 🛠️ Development Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

Quick start:

```bash
npm install
cp .env.local.example .env.local
# Add your credentials to .env.local
npm run dev
```

## 📂 Project Structure

```
app/                    # Next.js App Router pages
├── api/               # API routes
├── dashboard/         # Dashboard page
├── onboarding/        # Onboarding flow
├── layout.tsx         # Root layout
└── page.tsx           # Landing page

lib/                    # Utilities and services
├── services/          # Business logic
├── utils/             # Helper functions
├── translators/       # Localization
├── auth.ts            # Auth helpers
└── supabase.ts        # Database client

types/                  # TypeScript definitions
supabase/              # Database migrations
public/                # Static assets
```

## 🌿 Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

## 📝 Commit Messages

Follow conventional commits:

```
feat: add video filtering by category
fix: correct engagement score calculation
docs: update deployment guide
style: format dashboard components
refactor: simplify creator similarity logic
test: add tests for product scoring
chore: update dependencies
```

## 🔄 Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
   - Test on desktop and mobile
   - Check for TypeScript errors
   - Verify no console errors
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**
   - Describe what changed
   - Reference any related issues
   - Add screenshots for UI changes

## 🧪 Testing Guidelines

### Before Submitting PR

- [ ] Code runs without errors
- [ ] TypeScript types are correct
- [ ] UI is responsive on mobile
- [ ] Spanish text is grammatically correct
- [ ] No console warnings/errors
- [ ] Environment variables documented

### Manual Testing

Test these flows:

1. Landing page loads
2. TikTok OAuth works
3. Onboarding flow completes
4. Dashboard displays data
5. Logout works
6. Protected routes redirect

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new files
- Avoid `any` types
- Export interfaces from `types/`
- Use meaningful variable names

### React Components

```typescript
// Good
export default function CreatorCard({ creator }: { creator: User }) {
  const [expanded, setExpanded] = useState(false);
  // ...
}

// Avoid
export default function Card(props: any) {
  // ...
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Mobile-first responsive design
- Consistent spacing (4px grid)
- Use theme colors

### API Routes

```typescript
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = getSession(request);

    // Fetch data
    const data = await fetchData();

    // Return response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Message" }, { status: 500 });
  }
}
```

## 🌍 Internationalization

All user-facing text should be in Spanish. For future i18n:

```typescript
// Current (Spanish only)
<button>Continuar</button>

// Future (with i18n)
<button>{t('continue')}</button>
```

## 🚀 Feature Development

### Adding a New Feature

1. **Check existing issues** - Avoid duplicates
2. **Create an issue** - Describe the feature
3. **Discuss approach** - Get feedback before coding
4. **Implement** - Follow code style guidelines
5. **Document** - Update README if needed
6. **Test** - Thoroughly test the feature
7. **Submit PR** - Reference the issue

### Feature Checklist

- [ ] Implements the feature completely
- [ ] Mobile-responsive
- [ ] Spanish language
- [ ] TypeScript types defined
- [ ] Error handling included
- [ ] Loading states added
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] Documentation updated

## 🐛 Bug Fixes

### Reporting Bugs

Include:

- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos
- Environment (browser, OS, device)

### Fixing Bugs

1. Create an issue (if not exists)
2. Reproduce the bug locally
3. Fix the root cause
4. Test the fix thoroughly
5. Submit PR with "Fixes #issue-number"

## 📚 Documentation

### What to Document

- Public API changes
- New environment variables
- Configuration changes
- Breaking changes
- Migration guides

### Where to Document

- `README.md` - Overview and quick start
- `SETUP.md` - Detailed setup
- `DEPLOYMENT.md` - Deployment instructions
- Code comments - Complex logic
- JSDoc - Functions and interfaces

## 🎯 Priority Areas for Contribution

### High Priority

1. **TikTok API Integration**

   - Implement real data fetching
   - Content Posting API
   - Research API for analytics

2. **Similarity Algorithm**

   - ML-based creator matching
   - Category analysis
   - Engagement pattern matching

3. **Analytics Dashboard**
   - Charts and visualizations
   - Trend analysis
   - Performance predictions

### Medium Priority

4. **Product Recommendations**

   - ML-based suggestions
   - Cultural fit scoring
   - Price optimization

5. **Multi-language Support**

   - English translation
   - Portuguese (Brazilian)
   - Translation infrastructure

6. **Mobile App**
   - React Native wrapper
   - Push notifications
   - Offline capabilities

### Low Priority

7. **Advanced Features**

   - Creator collaboration tools
   - Content calendar
   - Export reports

8. **Performance**
   - Caching layer
   - Image optimization
   - Database query optimization

## 🤝 Code Review

### As a Reviewer

- Be constructive and respectful
- Test the changes locally
- Check for edge cases
- Verify mobile responsiveness
- Suggest improvements, don't demand

### As an Author

- Respond to feedback promptly
- Be open to suggestions
- Make requested changes
- Thank reviewers

## ✅ Merge Criteria

PRs will be merged when:

- [ ] All tests pass
- [ ] No merge conflicts
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Spanish language verified (for UI changes)

## 🏆 Recognition

Contributors will be:

- Listed in README.md
- Credited in release notes
- Mentioned in project updates

## 📞 Getting Help

- **Questions**: Open a discussion
- **Bugs**: Create an issue
- **Features**: Propose in discussions first
- **Security**: Email directly (don't open issue)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Academia! Your work helps Hispanic creators succeed on TikTok Shop. 🎉
