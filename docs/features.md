# Features — How Things Work

## 1. Encounter Lifecycle

### Creating an Encounter
1. User navigates to `/encounters` (EncountersView)
2. Types a name in `EncounterNew` → calls `encountersStore.addNewEncounter({ encounterName })`
3. Encounter created in Firestore with `round: 1, activeEntityIndex: 1, currentTurn: 1`
4. Appears in list via real-time `onSnapshot` listener

### Adding Characters to an Encounter
1. In EncounterDetailsView, click "Add characters" in EncounterActionbar menu
2. Opens `CharacterLibrary` dialog showing monsters (from `monsters` collection) and user's characters
3. Clicking a character calls `encountersStore.addNpcToEncounter({ npcData, encounterId })`
4. NPC gets a fresh `uuid`, `hit_points_current` reset to max, `initiative` set to 0, `conditions` cleared
5. Written to `users/{uid}/encounters/{eid}/npcs/{npcId}`

### Rolling Initiative
1. Click "Roll initiative" in EncounterActionbar menu
2. `EncounterList.handleRollInitiative()` iterates all NPCs
3. For each: rolls `1d20` + `calcModifier(npc.dexterity)` using `@dice-roller/rpg-dice-roller`
4. Calls `npcsStore.updateInitiative()` for each NPC
5. NPCs automatically re-sort by initiative (desc) via Firestore `orderBy`
6. Round reset to 1, active entity to 1

### Advancing Turns
1. Click "Next" button → `EncounterList.handleNextTurn()`
2. Logic:
   - If not at last NPC: increment `activeEntityIndex`, increment `currentTurn`
   - If at last NPC: reset `activeEntityIndex` to 1, increment `round`, increment `currentTurn`
3. On round change: calls `npcsStore.updateNpcConditionRound()` for each NPC
   - Decrements condition `duration` by 1
   - Removes conditions where `duration` reaches 0
4. Updates encounter state via `encountersStore.updateTurnState()`

### Removing an NPC
1. Click remove button on `CharacterListItem`
2. `EncounterList.handleRemoveNpc()` deletes the NPC doc
3. If removed NPC was before or at the active index, adjusts `activeEntityIndex` to maintain correct turn

### HP Management
1. Click HP bar on `CharacterListItem` → opens `CharacterHealthbar` dialog
2. Enter damage/heal amount (or use quick buttons: 1, 5, 10, 20)
3. Click Damage or Heal → calculates new HP (clamped to 0...max)
4. Calls `npcsStore.updateHitPointCurrent()`
5. HP bar color: green (>60%), yellow (>25%), red (<=25%)

### Condition Management
1. Click condition icon on `CharacterListItem` → opens `CharacterCondition` dialog
2. Shows all 18 D&D 5e conditions with effect descriptions
3. Select condition, optionally set duration (rounds)
4. Calls `npcsStore.updateCondition()` (uses Firestore `arrayUnion`)
5. Active conditions show as chips on the character card
6. Conditions with duration auto-decrement on round advance

---

## 2. Character Builder

### Creating a Character
Three entry points:
- **From scratch:** Route `/characters/edit/base-empty` → blank Character
- **From monster template:** Route `/characters/edit/base-monster/{id}` → loads from `monsters` collection
- **From existing character:** Route `/characters/edit/base-character/{uuid}` → loads from user's characters

### Editor (CharacterBuilder.vue)
Tabbed form with 6 sections:
1. **Identity** — Name, race/type, size, alignment, category, challenge rating
2. **Defense** — AC, armor description, max HP, hit dice
3. **Ability Scores** — STR, DEX, CON, INT, WIS, CHA + saving throws
4. **Speed** — Walk, swim, fly, burrow, climb
5. **Traits** — Senses, perception, languages, immunities/resistances
6. **Abilities** — Actions, special abilities, reactions, legendary actions (each with name + description)

Live preview panel on right side (hidden on small screens).

### Saving
- `useCharacterBuilderStore.saveCharacter({ char, newCharacter })`
- New character: generates `uuid` and `uuid_ref`, sets `meta.createdAt`
- Existing character: calls `updateCharacterInEncounters()` to sync changes to all encounter instances
  - Finds all NPCs across all encounters with matching `uuid_ref`
  - Updates stat fields but preserves encounter-specific state (HP, initiative, conditions)

### Unsaved Changes Guard
`onBeforeRouteLeave` checks `hasUnsavedChanges` flag. If true, shows confirm dialog via `useConfirmStore`.

---

## 3. Encounter Sharing

### Generating a Share Link
1. DM clicks share button in `EncounterActionbar`
2. `encountersStore.generateShareLink({ encounterId })`:
   - Generates `nanoid(10)` share ID
   - Writes `shareId` to encounter document
   - Creates lookup document at `shared_encounters/{shareId}` with `{ ownerUid, encounterId, createdAt }`
3. Share URL: `https://{host}/play/{shareId}`
4. URL displayed in dialog with copy button

### Player View
1. Player opens `/play/{shareId}` → `PlayerView.vue`
2. Calls `encountersStore.fetchSharedEncounter({ shareId })`
3. Sets up 3 nested `onSnapshot` listeners:
   - **Share doc** (`shared_encounters/{shareId}`) — watches for deletion (revocation)
   - **Encounter doc** (`users/{ownerUid}/encounters/{encounterId}`) — real-time state
   - **NPCs collection** — real-time NPC list sorted by initiative
4. `PlayerEncounter` renders read-only view with:
   - Round/turn display
   - Elapsed game time (`currentTurn * 6` seconds)
   - Current turn character highlight
   - Participant cards with initiative, name, category, conditions

### Revoking a Share
1. DM clicks share button (already shared) → opens dialog → clicks "Stop sharing"
2. `encountersStore.revokeShareLink({ encounterId })`:
   - Deletes `shared_encounters/{shareId}` document
   - Removes `shareId` field from encounter document
3. Player's `onSnapshot` on share doc fires with `doc.exists === false`
4. Cleanup: all 3 listeners unsubscribed, error message shown to player

---

## 4. Demo Mode

### Purpose
Lets non-authenticated visitors try the full encounter experience without an account. All data stays in memory (no Firestore writes).

### Activation Flow
1. User clicks "Try a Live Demo" on HomeView → navigates to `/demo`
2. `DemoEncounterView` mounts → calls `demoStore.activateDemo()` **synchronously in setup**
3. `activateDemo()`:
   - Deep copies demo data from `src/data/demoEncounterData.ts`
   - Populates `encountersStore.encountersCurrent` and `encountersStore.encountersNpcs`
   - Saves references to 11 original store methods
   - Replaces them with in-memory equivalents

### Demo Encounter Data
Pre-built scenario: **"Ambush at Grimhollow Bridge"** — Round 3, 9 participants:
- 4 player characters (Elf Rogue, Dwarf Fighter, Human Cleric, Half-Elf Sorcerer)
- 5 enemies (2 Goblin Skirmishers, 1 Goblin Sharpshooter, 1 Bugbear Chief, 1 Dire Wolf)
- Active conditions: Frightened, Unconscious, Poisoned, Grappled
- Characters have full stats, abilities, and actions

### What Works in Demo
- Advancing turns (next button)
- Damaging/healing characters
- Adding/removing conditions
- Editing initiative
- Adding characters from the monster library
- Removing characters
- Viewing character details
- All condition duration tracking

### What's Different in Demo
- Share button shows sign-up dialog instead of generating link
- `DemoBanner` dismissible alert at top: "You're in demo mode"
- After 5 interactions: one-time snackbar CTA to sign up
- No Firestore reads or writes

### Deactivation
When `DemoEncounterView` unmounts:
1. `demoStore.deactivateDemo()` restores all 11 original store methods
2. Clears demo state flags

### Guest Character Builder
`DemoCharacterEdit` (`/demo/character/:type/:uuid?`) patches `useCharacterBuilderStore`:
- `saveCharacter` → serializes to `localStorage` (key: `yait_demo_characters`)
- `deleteCharacter` → removes from localStorage
- `fetchCharacterByUuid` → reads from localStorage
- `fetchCharacterById` (monster template) → left unpatched (reads from public `monsters` collection)

On save, shows snackbar: "Character saved locally. Sign up to keep it forever!"

---

## 5. Authentication

### Firebase Auth Setup
- Configured in `src/store/firebase.ts`
- Uses Firebase compat auth API
- `authReady` promise ensures auth state is restored before router guard runs

### Providers
- Email/password
- Google (via FirebaseUI)
- Twitter (via FirebaseUI)

### Auth State Flow
1. App loads → `firebase.auth().onAuthStateChanged()` fires
2. If user exists: `usersStore.loginUser(user)` sets state
3. Router guard checks `route.meta.requiresAuth`:
   - If required and not logged in → redirect to `/login`
   - If logged in and on `/login` or `/register` → redirect to `/home`

### Login View
`LoginView.vue` initializes FirebaseUI widget with configured providers. On successful auth, redirects to the original requested route (if stored in query param) or home.

---

## 6. CTA Strategy (Conversion)

Non-blocking conversion prompts for guest users:

| Trigger | Component | Message |
|---------|-----------|---------|
| Demo encounter load | `DemoBanner` | "You're in demo mode. Sign up to create your own encounters." |
| After 5 interactions | Snackbar (via `useDemoStore`) | "Enjoying YAIT? Create a free account to save your work." |
| Character save (demo) | Snackbar (via `DemoCharacterEdit`) | "Character saved locally. Sign up to keep it forever!" |
| Share button (demo) | Dialog (via `EncounterActionbar`) | Explains sharing feature + "Create account" button |
| HomeView sign-up nudge | `v-alert` in HomeView | "Create a free account to keep your characters and encounters synced across devices." |

All CTAs are dismissible and non-blocking. No features are gated behind authentication in demo mode.
