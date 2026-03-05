# design-system.md — LeaveAware

A lightweight, modern design system for LeaveAware (web + mobile). Built around a calm **blue → purple** brand gradient and simple, high-clarity UI.

---

## Brand principles

- **Clarity first:** leave planning should feel obvious at a glance.
- **Lightweight SaaS:** not “enterprise HR”, not playful consumer.
- **Consistent everywhere:** works as favicon, app icon, web, mobile.
- **Accessible:** strong contrast, readable sizes, clear states.

---

## Color system

### Brand
- **Brand Blue:** `#2D9CDB`
- **Brand Indigo:** `#4C6EF5`
- **Brand Purple:** `#8E2DE2`

#### Primary gradient
- `linear-gradient(135deg, #2D9CDB 0%, #4C6EF5 45%, #8E2DE2 100%)`

Use for:
- App icon / logo background
- Primary CTA background (optional; can also be solid Indigo)
- Hero accents (subtle, not overpowering)

### Neutrals (light theme)
- **Background:** `#F8FAFC`
- **Surface:** `#FFFFFF`
- **Text / Primary:** `#0F172A`
- **Text / Muted:** `#64748B`
- **Border:** `#E2E8F0`

### Feedback / status
- **Success (Approved):** `#22C55E`
- **Warning (Potential conflict):** `#F59E0B`
- **Error (Rejected / issue):** `#EF4444`
- **Info:** `#3B82F6`

### Dark mode (optional baseline)
- **Background:** `#0F172A`
- **Surface:** `#111827`
- **Text / Primary:** `#F8FAFC`
- **Text / Muted:** `#94A3B8`
- **Border:** `#1F2937`

> Note: Gradient works well on dark backgrounds; keep it subtle for large areas.

---

## Token naming

Use a single source of truth (CSS vars / design tokens).

### CSS variables (recommended)
```css
:root{
  /* Brand */
  --brand-blue: #2D9CDB;
  --brand-indigo: #4C6EF5;
  --brand-purple: #8E2DE2;
  --brand-gradient: linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-indigo) 45%, var(--brand-purple) 100%);

  /* Neutrals */
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --text: #0F172A;
  --text-muted: #64748B;
  --border: #E2E8F0;

  /* Feedback */
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.10);

  /* Radii */
  --r-sm: 10px;
  --r-md: 14px;
  --r-lg: 18px;

  /* Spacing scale (8pt) */
  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-5: 20px;
  --s-6: 24px;
  --s-8: 32px;
  --s-10: 40px;
  --s-12: 48px;
  --s-16: 64px;
}