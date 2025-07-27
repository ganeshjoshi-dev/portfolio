# Style Guide

## Color Theme

This project follows a modern, dark-themed design system with cyan accents, as defined in `src/styles/theme.js`. 

### Brand Colors
- Primary (Cyan): `text-cyan-400` or `bg-cyan-400` (#06b6d4)
  - Used for: Brand name, important buttons, interactive elements
  - Hover state: `hover:text-cyan-400`, `hover:bg-cyan-400/20`

### Background Colors
- Main gradient: 
  ```css
  bg-gradient-to-br from-gray-900 via-black to-gray-800
  ```
- Component backgrounds: `bg-gray-800/80` with backdrop blur
- Hover states: `hover:bg-cyan-400/20`

### Typography
- Primary text: `text-white`
- Secondary text: `text-gray-300`
- Muted text: `text-gray-400`
- Font sizes:
  - Headings: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`
  - Body: `text-base sm:text-lg md:text-xl`
  - Small text: `text-sm sm:text-base`

### Border Styles
- Default: `border border-gray-700/50`
- Hover: `hover:border-cyan-400/50`
- Border radius: `rounded-lg`

### Interactive Elements
Common button/link styles:
```css
px-6 py-3 bg-gray-800/80 
hover:bg-cyan-400/20 
border border-gray-700 
hover:border-cyan-400/50 
rounded-lg text-white 
hover:text-cyan-400 
transition-all duration-300 
hover:scale-105
```

### Animations
- Transitions: `transition-all duration-300`
- Hover effects: `hover:scale-105`
- Special effects: `animate-pulse` (used for emphasis)

### Layout
- Container max width: `max-w-4xl`
- Spacing:
  - Gaps: `gap-4 sm:gap-6`
  - Padding: `p-4`, `p-6`
  - Margins: `mb-4`, `mb-8`

### Responsive Design
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
- Mobile-first approach with responsive classes
  Example: `text-base sm:text-lg md:text-xl`

## Usage Guidelines

1. **Component Styling**
   - Use the theme colors instead of direct Tailwind color classes
   - Example: 
     ```jsx
     // Instead of
     <button className="text-cyan-400">
     
     // Use
     <button className="text-primary">
     ```

2. **Dark Mode**
   - The theme automatically handles dark mode through CSS variables
   - Use the appropriate light/dark variants when needed

3. **Maintaining Consistency**
   - All new colors should be added to `src/styles/theme.js`
   - Update this style guide when adding new theme values

4. **Using with AI Tools**
   When working with AI tools like GitHub Copilot, mention:
   - "Use the theme colors from src/styles/theme.js"
   - "Follow the style guide in STYLE_GUIDE.md"
   - "Use themed Tailwind classes instead of direct color classes"
