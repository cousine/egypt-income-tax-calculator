# AGENTS.md - Egyptian Salary Calculator

## Project Type
Static HTML/CSS/JavaScript web application - Egyptian salary calculator with tax calculations and currency conversion.

## Build/Test Commands
- No build system - direct HTML file execution
- Open `egyptian_salary_calculator.html` in browser for testing
- No package.json or automated tests present
- Test manually by entering various salary values and verifying calculations

## Code Style Guidelines

### HTML Structure
- Use semantic HTML5 elements with proper DOCTYPE
- Include viewport meta tag for responsive design
- Use descriptive IDs and classes (camelCase for IDs, kebab-case for classes)
- Maintain accessibility with proper labels and ARIA attributes

### CSS Conventions
- Use CSS custom properties for consistent theming
- Implement responsive design with CSS Grid and Flexbox
- Use modern CSS features (gradients, box-shadow, border-radius)
- Follow BEM-like naming for CSS classes
- Use relative units (em, rem) for scalability
- Maintain consistent spacing and color schemes

### JavaScript Style
- Use modern ES6+ features (const/let, arrow functions, async/await)
- Implement event-driven architecture with proper DOM manipulation
- Use camelCase for variables and functions
- Add comprehensive error handling for edge cases and API failures
- Structure code with clear separation of concerns (calculation logic, UI updates, event handling)
- Use descriptive variable names (e.g., `monthlyGrossValue`, `breakdownCurrency`)
- Implement proper input validation and sanitization
- Use try-catch blocks for async operations (e.g., exchange rate fetching)
- Maintain consistent formatting and indentation (2 spaces)