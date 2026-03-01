# Components Reference

All components use `<script setup lang="ts">` with Vue 3 Composition API.

## Component Tree

```
App.vue
├── AppBar.vue                          # Global nav (conditional logged-in / guest)
├── Confirm.vue                         # Global confirmation dialog (driven by useConfirmStore)
├── Snackbar (inline in App.vue)        # Global toast notifications
│
└── <RouterView>
    │
    ├── HomeView.vue                    # Landing page (guest hero / logged-in dashboard)
    │   └── CharacterLibrary.vue        # Monster/character browser dialog
    │
    ├── CharactersView.vue              # User's character roster
    │   ├── CharacterTeaser.vue         # Compact character card
    │   └── CharacterLibrary.vue
    │
    ├── CharacterEdit.vue               # Character editor (authenticated)
    │   └── CharacterBuilder.vue        # Full editor form with preview
    │       ├── CharacterDetails.vue    # Read-only stat block
    │       │   ├── CharacterHealth.vue
    │       │   ├── CharacterArmorClass.vue
    │       │   └── DiceText.vue → DiceRoller.vue
    │       ├── CharacterAbilitiesEditor.vue
    │       │   └── CharacterAbilityDialogue.vue
    │       └── (Vuetify form fields)
    │
    ├── EncountersView.vue              # Encounter list
    │   ├── EncounterNew.vue            # Create encounter card
    │   └── EncounterTeaser.vue         # Encounter list item (edit/delete)
    │
    ├── EncounterDetailsView.vue        # 3-column encounter layout
    │   ├── EncounterList.vue           # Left column: NPC roster + controls
    │   │   ├── EncounterActionbar.vue  # Top bar: round/turn, next, share, menu
    │   │   ├── CharacterListItem.vue   # Individual combatant row
    │   │   │   ├── CharacterHealthbar.vue    # Interactive HP bar + dialog
    │   │   │   ├── CharacterCondition.vue    # Condition manager dialog
    │   │   │   ├── CharacterInitiative.vue   # Initiative editor dialog
    │   │   │   └── CharacterArmorClass.vue   # AC display
    │   │   └── CharacterLibrary.vue    # "Add characters" dialog
    │   └── CharacterDetails.vue (x2)   # Center + Right columns
    │
    ├── DemoEncounterView.vue           # Demo version of encounter details
    │   ├── DemoBanner.vue              # Dismissible demo mode alert
    │   ├── EncounterList.vue           # (same component, uses patched stores)
    │   └── CharacterDetails.vue (x2)
    │
    ├── DemoCharacterEdit.vue           # Demo character editor (localStorage)
    │   ├── DemoBanner.vue
    │   └── CharacterBuilder.vue
    │
    ├── PlayerView.vue                  # Shared encounter (read-only)
    │   └── PlayerEncounter.vue
    │       └── PlayerParticipantCard.vue
    │
    ├── LoginView.vue                   # FirebaseUI auth
    ├── RegisterView.vue                # (placeholder)
    ├── UserDetailsView.vue             # Profile display
    └── FeedbackView.vue                # Feedback + newsletter
```

## Component Details

### Views

#### HomeView.vue
- **Path:** `src/views/HomeView.vue`
- **Store deps:** `useUsersStore`
- **Children:** `PageTitle`, `CharacterLibrary`
- **Behavior:** Renders different layouts for guests (hero section, feature cards, demo CTAs) vs logged-in users (encounters/characters CTAs, roadmap)
- **Key logic:** `handleCharacterClicked` routes to `demoCharacterEdit` or `characterEdit` based on login state

#### EncounterDetailsView.vue
- **Path:** `src/views/EncounterDetailsView.vue`
- **Store deps:** `useEncountersStore`
- **Children:** `EncounterList`, `CharacterDetails` (x2)
- **Layout:** 3-column grid. Left: encounter roster. Center: active NPC (whose turn). Right: selected NPC (clicked).
- **Key logic:** Fetches encounter by ID from route params on mount

#### DemoEncounterView.vue
- **Path:** `src/views/DemoEncounterView.vue`
- **Store deps:** `useEncountersStore`, `useDemoStore`
- **Children:** `DemoBanner`, `EncounterList`, `CharacterDetails` (x2)
- **Key logic:** Calls `demoStore.activateDemo()` synchronously in setup (before child mount). Calls `deactivateDemo()` on unmount. Uses `DEMO_ENCOUNTER_ID = 'demo-encounter'`.

#### DemoCharacterEdit.vue
- **Path:** `src/views/DemoCharacterEdit.vue`
- **Props:** `uuid?: string`, `type?: string`
- **Store deps:** `useCharacterBuilderStore`, `useConfirmStore`, `useSnackbarStore`
- **Key logic:** Patches `saveCharacter`, `deleteCharacter`, `fetchCharacterByUuid` on the builder store to use `localStorage` (key: `yait_demo_characters`). Restores originals on unmount. Route guard for unsaved changes.

#### CharacterEdit.vue
- **Path:** `src/views/CharacterEdit.vue`
- **Props:** `uuid?: string`, `type?: string` (values: `edit`, `base-character`, `base-empty`, `base-monster`)
- **Store deps:** `useCharacterBuilderStore`, `useConfirmStore`
- **Key logic:** Routes to different fetch methods based on `type` prop. Route guard for unsaved changes via `onBeforeRouteLeave`.

#### PlayerView.vue
- **Path:** `src/views/PlayerView.vue`
- **Store deps:** `useEncountersStore`
- **Children:** `PlayerEncounter`
- **Key logic:** Loads shared encounter by `shareId` from route params. Shows error/loading states.

### Encounter Components

#### EncounterList.vue
- **Path:** `src/components/encounters/EncounterList.vue`
- **Props:** `id: string` (encounter ID)
- **Store deps:** `useEncountersStore`, `useNpcsStore`, `useSnackbarStore`
- **Children:** `EncounterActionbar`, `CharacterLibrary`, `CharacterListItem`
- **Key logic:**
  - `handleNextTurn`: Advances `activeEntityIndex`, wraps to next round, calls `updateNpcConditionRound` per NPC
  - `handleRollInitiative`: Rolls `1d20 + dex_modifier` for each NPC using rpg-dice-roller
  - `handleRemoveNpc`: Removes NPC and adjusts active index if needed
  - `handleReset`: Resets round to 1, active index to 1, current turn to 1

#### EncounterActionbar.vue
- **Path:** `src/components/encounters/EncounterActionbar.vue`
- **Props:** `encounter: IEncounterEntity`, `disableActions: boolean`
- **Emits:** `nextTurn`, `addCharacters`, `rollInitiative`, `reset`
- **Store deps:** `useEncountersStore`, `useSnackbarStore`, `useDemoStore`
- **Key logic:** Displays round/turn counters. Share button shows real share flow (generate link, copy URL) when logged in, or sign-up dialog in demo mode. Menu has add characters, roll initiative, reset.

#### CharacterListItem.vue
- **Path:** `src/components/characters/CharacterListItem.vue`
- **Props:** `npc: ICharacter`, `isActive: boolean`, `removable: boolean`, `hasActed?: boolean`
- **Emits:** `remove`
- **Store deps:** `useEncountersStore`
- **Children:** `CharacterHealthbar`, `CharacterInitiative`, `CharacterCondition`, `CharacterArmorClass`
- **Key logic:** Clicking the card sets `npcInDetail` in encounters store. Struck-through name if HP <= 0. Visual highlight for active turn and already-acted states.

### Character Common Components

#### CharacterHealthbar.vue
- **Path:** `src/components/characters/common/CharacterHealthbar.vue`
- **Props:** `uuid?: string`, `name?: string`, `hp: number`, `maxHp?: number`
- **Store deps:** `useEncountersStore`, `useNpcsStore`
- **Key logic:** Color-coded progress bar (green >60%, yellow >25%, red <=25%). Click opens dialog with damage/heal input and quick buttons (1, 5, 10, 20). Calls `npcsStore.updateHitPointCurrent()`.

#### CharacterCondition.vue
- **Path:** `src/components/characters/common/CharacterCondition.vue`
- **Props:** `uuid: string`, `name: string`, `conditions: ICondition[]`
- **Store deps:** `useEncountersStore`, `useNpcsStore`, `useSnackbarStore`
- **Key logic:** Dialog listing all D&D 5e conditions with effects text. Active conditions shown as chips. Optional duration field (in rounds). Calls `npcsStore.updateCondition()` / `removeConditionFromNpc()`.

#### CharacterInitiative.vue
- **Path:** `src/components/characters/common/CharacterInitiative.vue`
- **Props:** `uuid: string`, `initiative: number`
- **Emits:** `confirm`
- **Store deps:** `useEncountersStore`, `useNpcsStore`
- **Key logic:** Simple dialog to manually set initiative value.

#### CharacterDetails.vue
- **Path:** `src/components/characters/CharacterDetails.vue`
- **Props:** `characterData: Character`, `isWide?: boolean`
- **Key logic:** Full stat block display. Shows ability scores with modifiers, AC, HP, speed, senses, languages, immunities/resistances, special abilities, actions, legendary actions. Uses `DiceText` for clickable dice notation in ability descriptions.

### Character Builder Components

#### CharacterBuilder.vue
- **Path:** `src/components/characters/character-builder/CharacterBuilder.vue`
- **Props:** `character: Character`, `isNewCharacter?: boolean`
- **Emits:** `change: [hasChanges: boolean]`
- **Store deps:** `useCharacterBuilderStore`, `useConfirmStore`, `useSnackbarStore`
- **Key logic:** Tabbed form (Identity, Defense, Ability Scores, Speed, Traits, Abilities). Live preview panel on right (wide screens). Footer with Save/Delete buttons. Deep-watches character for unsaved changes.

#### CharacterLibrary.vue
- **Path:** `src/components/characters/CharacterLibrary.vue`
- **Props:** `buttonText?: string`
- **Emits:** `characterClicked`, `closeClicked`
- **Store deps:** `useNpcsStore`, `useCharactersStore`
- **Key logic:** Two-column layout: scrollable list on left, preview on right. Filter by type (all/monsters/my characters) and search by name. Virtual scroll for performance. Fetches both monsters and user characters on mount.

### Player View Components

#### PlayerEncounter.vue
- **Path:** `src/components/encounters/PlayerEncounter.vue`
- **Props:** `encounter: IEncounterEntity`, `participants: ICharacter[]`
- **Key logic:** Read-only encounter display for shared links. Shows round/turn, elapsed game time (1 turn = 6 seconds), current turn character alert, participant list.

#### PlayerParticipantCard.vue
- **Path:** `src/components/encounters/PlayerParticipantCard.vue`
- **Props:** `npc: ICharacter`, `isActive: boolean`, `hasActed?: boolean`
- **Key logic:** Simplified read-only card. Shows initiative, name, category chip, condition chips. Skull icon if dead (HP <= 0). No interactive controls.

### Common Components

#### DiceText.vue / DiceRoller.vue
- `DiceText` parses text for dice notation patterns (e.g., `2d6+3`) and replaces them with clickable `DiceRoller` chips.
- `DiceRoller` uses `@dice-roller/rpg-dice-roller` to roll dice and shows results in a snackbar.

#### Confirm.vue
- Rendered once in `App.vue`. Driven entirely by `useConfirmStore`. Shows title + message with Cancel/OK buttons.

#### PageTitle.vue
- Simple header with icon + title + optional subtitle. Used at the top of every view.
