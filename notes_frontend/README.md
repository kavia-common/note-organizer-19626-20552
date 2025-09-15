# Ocean Notes — Nuxt 3

Playful, vibrant, and efficient notes management UI built with Nuxt 3.

- Ocean Professional theme with primary (#EC4899) and secondary (#8B5CF6)
- Sidebar navigation (All, Pinned, Archived, Trash) + tags
- Top bar with search and quick actions
- Notes list with pin, archive, delete
- Editor with title, content, tags, and color
- LocalStorage persistence (no backend required)

## Setup

Install dependencies:

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit http://localhost:3000

## Production

```bash
npm run build
npm run preview
```

## Structure

- app.vue — App shell, layout, and wiring
- components/ — Sidebar, Topbar, NotesList, NoteEditor
- pages/index.vue — Main page with list + editor split view
- stores/notes.ts — Lightweight store with persistence
- assets/main.css — Utility CSS and theme helpers

## Notes

- This frontend is self-contained and uses localStorage. Swap the store with API calls to integrate with a backend.
- Theme variables are defined in app.vue :root for easy customization.
