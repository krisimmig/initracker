# Initracker (Gemini Context)

## Project Overview
`initracker-ts` is a web-based Initiative Tracker application designed for Tabletop RPGs (like D&D 5e). It allows users to manage characters, monsters, and encounters, tracking turns, health, and initiative order.

## Technology Stack
*   **Framework:** Vue.js (v2)
*   **Language:** TypeScript
*   **UI Library:** Vuetify (Material Design)
*   **State Management:** Vuex (with `vuex-typescript` for type-safe accessors)
*   **Backend/Auth:** Firebase (Firestore & Authentication)
*   **Build Tool:** Vue CLI
*   **Testing:** Cypress (E2E)

## Building and Running

### Prerequisites
*   Node.js (v18 recommended)
*   Yarn

### Scripts
*   `yarn install`: Install dependencies.
*   `yarn run serve`: Start local development server (hot-reload).
*   `yarn run build`: Build for production.
*   `yarn run lint`: Lint and fix files.
*   `yarn run test`: Run unit tests.
*   `yarn run test:e2e`: Run Cypress E2E tests.

## Project Structure

*   **`src/classes/`**: Domain entity classes.
    *   `Character.ts`: Core class for Characters/Monsters with 5e stats (AC, HP, Speed, etc.).
*   **`src/components/`**: Vue components.
    *   `characters/`: Components related to character lists and details.
    *   `encounters/`: Components for managing encounters.
    *   `common/`: Reusable UI components.
*   **`src/store/`**: Vuex state management.
    *   Modularized (`charactersModule`, `encountersModule`, `usersModule`, etc.).
    *   Uses `vuex-typescript` helpers (`read`, `commit`, `dispatch`) for type safety.
*   **`src/views/`**: Page-level components mapped to routes.
*   **`src/types/`**: TypeScript interfaces and enums for the domain model (e.g., `creatureTypes`, `encounters`).

## Development Conventions

*   **Component Style:** Class-based components using `vue-property-decorator` (`@Component`, `class MyComponent extends Vue`).
*   **State Access:** Do not access `$store` directly if possible. Use the exported accessor functions from store modules (e.g., `readGetCharacters`, `dispatchFetchCharacters`).
*   **Persistence:** Data is synced with Firebase Firestore. `charactersModule` uses `onSnapshot` for real-time updates.
*   **Naming:**
    *   Components: PascalCase (e.g., `CharacterDetails.vue`).
    *   Store Accessors: camelCase with prefixes (`read...`, `commit...`, `dispatch...`).
