# Architecture Overview

## What is YAIT?

YAIT (Yet Another Initiative Tracker) is a web app for running D&D 5e combat encounters. DMs create characters/monsters, organize them into encounters, and run combat with initiative tracking, HP management, and condition tracking. Encounters can be shared with players via real-time links.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Vue 3 (Composition API, `<script setup>`) | ^3.5.0 |
| Language | TypeScript (strict mode) | ^5.3.0 |
| UI Library | Vuetify 3 (Material Design) | ^3.4.0 |
| State | Pinia | ^2.1.7 |
| Backend | Firebase 9.10.0 (compat API) | 9.10.0 |
| Auth | Firebase Authentication (Email, Google, Twitter via FirebaseUI) | |
| Database | Cloud Firestore | |
| Router | Vue Router 4 | ^4.2.5 |
| Bundler | Vite 5 | ^5.1.0 |
| CSS | Tailwind CSS 3 + Vuetify theme system | ^3.4.0 |
| Icons | Material Design Icons (@mdi/font) | ^7.4.47 |
| Dice | @dice-roller/rpg-dice-roller | ^5.1.0 |
| IDs | uuid (v1) + nanoid (share links) | |
| Testing | Vitest (unit) + Cypress (e2e) | |

## Directory Structure

```
src/
├── assets/              # Static assets (SVG icons, images)
├── classes/
│   └── Character.ts     # Core Character class with D&D 5e stats
├── components/
│   ├── AppBar.vue       # Global navigation bar
│   ├── characters/      # Character display & editing components
│   │   ├── common/      # CharacterHealthbar, CharacterCondition, etc.
│   │   └── character-builder/  # CharacterBuilder form components
│   ├── common/          # Confirm dialog, PageTitle, DiceRoller, etc.
│   ├── demo/            # DemoBanner component
│   └── encounters/      # EncounterList, EncounterActionbar, PlayerEncounter, etc.
├── css/
│   └── base.css         # Base stylesheet
├── data/
│   └── demoEncounterData.ts  # Pre-built demo encounter (9 characters)
├── plugins/
│   └── vuetify.ts       # Vuetify theme config (light/dark, colors, defaults)
├── store/               # Pinia stores (see docs/stores.md)
│   ├── firebase.ts      # Firebase init, db instance, auth helpers
│   ├── useCharacterBuilderStore.ts
│   ├── useCharactersStore.ts
│   ├── useConfirmStore.ts
│   ├── useDemoStore.ts
│   ├── useEncountersStore.ts
│   ├── useNpcsStore.ts
│   ├── useSnackbarStore.ts
│   └── useUsersStore.ts
├── types/               # TypeScript enums and interfaces (see docs/data-model.md)
├── utils/
│   └── dnd.ts           # Ability modifier calculation helpers
├── views/               # Page-level components (see docs/routing.md)
├── App.vue              # Root component (AppBar + RouterView + Confirm + Snackbar)
├── main.ts              # Entry point (creates app, registers plugins)
└── router.ts            # Route definitions + auth guard
```

## Key Architectural Patterns

### 1. Composition API Everywhere
All components use `<script setup lang="ts">`. No Options API or class-based components.

### 2. Pinia Stores as the Single Source of Truth
Components import stores directly (e.g., `useEncountersStore()`) rather than receiving data through props from parent views. This means deeply nested components like `CharacterHealthbar` directly call store methods to persist changes.

**Implication for refactoring:** You cannot simply swap store implementations via props. The demo mode works around this by monkey-patching store methods at runtime.

### 3. Firebase Compat API
The project uses Firebase v9 but with the **compat** (v8-style) API:
```typescript
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
```
This means Firestore calls look like `db.doc('path').get()` rather than the modular `getDoc(doc(db, 'path'))`.

### 4. Real-Time Listeners
Most data fetching uses Firestore `onSnapshot()` for real-time updates rather than one-time `get()` calls. This is critical for:
- Encounter NPC lists (sorted by initiative)
- Shared encounter player views (DM changes appear instantly)
- Character library (new characters appear immediately)

### 5. Demo Mode via Method Patching
The demo system (for non-authenticated users) works by replacing Firestore-calling store methods with in-memory equivalents at runtime. Original methods are saved and restored on teardown. See [docs/features.md](features.md#demo-mode) for details.

### 6. Three-Column Encounter Layout
The encounter detail view uses a fixed three-column layout:
1. **Left:** Encounter roster (NPCs sorted by initiative, action bar)
2. **Center:** Active NPC detail panel (whose turn it is)
3. **Right:** Selected NPC detail panel (clicked NPC)

### 7. Vuetify Theme System
Two themes defined in `src/plugins/vuetify.ts`:
- **Light:** primary `#4A6FA5`, secondary `#6b7280`
- **Dark:** primary `#ba600c`

Theme toggle available in AppBar (logged-in users only).

## Build & Dev Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # vue-tsc --noEmit && vite build
npm run preview    # Preview production build
npm run test:unit  # Vitest
npm run test:e2e   # Cypress
```

## Firebase Project

- Project ID: `initracker-kkk`
- Auth domain: `initracker-kkk.firebaseapp.com`
- Security rules: `firestore.rules`
- Deployment config: `firebase.json`
