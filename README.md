
# SkyCast AI Weather App

## CSS Guidelines

This app has been converted from Tailwind CSS to vanilla CSS. Here's a guide to the CSS structure:

### Color Variables

All colors are defined as CSS variables in the `:root` selector with a dark mode variant in the `.dark` class. This makes it easy to adjust the theme.

### Class Structure

- Layout classes: `.flex`, `.grid`, `.grid-cols-*`, etc.
- Spacing: `.p-*`, `.m-*`, `.gap-*`, etc.
- Typography: `.text-*` for sizes, `.font-*` for weights
- Colors: `.bg-*`, `.text-*` 
- Components: `.card`, `.weather-card`, `.glass-card`, etc.

### Media Query Breakpoints

The CSS maintains the same breakpoints as Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Theme Toggle

The dark/light mode toggle adds or removes the `.dark` class on the `html` element. All theme colors are controlled through CSS variables.

### Weather-Specific Classes

- `.weather-gradient-day`: Light blue gradient for day
- `.weather-gradient-night`: Dark blue gradient for night
- `.weather-gradient-cloudy`: Gray gradient for cloudy weather
- `.weather-gradient-rainy`: Blue gradient for rainy weather
- `.glass-card`: Translucent card with backdrop blur

### Component-Specific Classes

The CSS includes styling for:
- Cards
- Buttons
- Inputs
- Weather components
- Chat interface
- Charts
- Modal/sheet components

All classes follow a logical naming convention similar to the original Tailwind utility classes but grouped into semantic classes.
