# Routing

**File:** `src/router.ts`

## Route Table

| Path | Name | Component | Auth | Meta Flags | Props |
|------|------|-----------|------|------------|-------|
| `/` | `home` | `HomeView` | No | — | — |
| `/user` | `userdetails` | `UserDetailsView` | Yes | — | — |
| `/characters` | `characters` | `CharactersView` | Yes | — | — |
| `/characters/edit/:type/:uuid?` | `characterEdit` | `CharacterEdit` | Yes | — | `true` (route params → props) |
| `/encounters` | `encounters` | `EncountersView` | Yes | — | — |
| `/encounters/:encounterId` | `encounterDetails` | `EncounterDetailsView` | Yes | `isFullWidth` | — |
| `/feedback` | `feedback` | `FeedbackView` | Yes | — | — |
| `/demo` | `demo` | `DemoEncounterView` (lazy) | No | `isFullWidth` | — |
| `/demo/character/:type/:uuid?` | `demoCharacterEdit` | `DemoCharacterEdit` (lazy) | No | — | `true` |
| `/play/:shareId` | `player-view` | `PlayerView` (lazy) | No | `isFullWidth`, `hideAppBar` | — |
| `/login` | `login` | `LoginView` | No | — | — |
| `/register` | `register` | `RegisterView` | No | — | — |

## Route Params

### Character Edit Routes (`characterEdit`, `demoCharacterEdit`)
- **`:type`** — Determines how the character is loaded:
  - `edit` — Load existing character by UUID from user's collection
  - `base-character` — Load existing character as a template (new character based on it)
  - `base-empty` — Start with a blank `new Character()`
  - `base-monster` — Load a monster from the global `monsters` collection by ID
- **`:uuid?`** — Character UUID or monster ID (optional, not needed for `base-empty`)

### Encounter Details Route (`encounterDetails`)
- **`:encounterId`** — Firestore document ID of the encounter

### Player View Route (`player-view`)
- **`:shareId`** — `nanoid(10)` share link ID, looked up in `shared_encounters` collection

## Meta Flags

| Flag | Type | Description |
|------|------|-------------|
| `requiresAuth` | `boolean` | If `true`, unauthenticated users are redirected to `/login` |
| `isFullWidth` | `boolean` | If `true`, `App.vue` removes the container padding for full-width layout |
| `hideAppBar` | `boolean` | If `true`, `App.vue` hides the `AppBar` component entirely |

## Auth Guard

```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ name: 'login', query: { redirect: to.name } })
  } else if (isLoggedIn() && ['login', 'register'].includes(to.name)) {
    next({ name: 'home' })
  } else {
    next()
  }
})
```

**Behavior:**
1. Protected routes → redirect to `/login?redirect={routeName}` if not authenticated
2. Login/Register pages → redirect to `/` if already authenticated
3. All other routes → pass through

## Lazy-Loaded Routes

These routes use dynamic `import()` to reduce initial bundle size:
- `/demo` → `DemoEncounterView`
- `/demo/character/:type/:uuid?` → `DemoCharacterEdit`
- `/play/:shareId` → `PlayerView`

All other routes are eagerly imported at the top of `router.ts`.

## Navigation Patterns

### Programmatic Navigation
- After creating a new character: `router.push({ name: 'characterEdit', params: { uuid, type: 'edit' } })`
- After deleting a character (demo): `router.push({ name: 'home' })`
- From HomeView character library: `router.push({ name: 'demoCharacterEdit' | 'characterEdit', params: { type, uuid } })`

### Route Guards in Components
- `CharacterEdit` and `DemoCharacterEdit` use `onBeforeRouteLeave` to warn about unsaved changes
- Guard shows confirmation dialog via `useConfirmStore.open()`
