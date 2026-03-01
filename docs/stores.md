# Pinia Stores Reference

All stores use the Composition API style (`defineStore('name', () => { ... })`).

## firebase.ts — Firebase Initialization

Not a Pinia store. Exports Firebase instances and helpers.

| Export | Type | Description |
|--------|------|-------------|
| `db` | Firestore | Database instance for all queries |
| `firebase` | namespace | Firebase compat namespace |
| `firebaseApp` | App | Firebase app instance |
| `isLoggedIn()` | `() => boolean` | Check if `firebase.auth().currentUser` exists |
| `authReady` | `Promise<void>` | Resolves when Firebase auth state is restored on app load |

---

## useUsersStore — Authentication

**Store ID:** `'users'`

### State
| Ref | Type | Description |
|-----|------|-------------|
| `user` | `firebase.User \| null` | Current authenticated user |

### Computed
| Name | Type | Description |
|------|------|-------------|
| `isLoggedIn` | `boolean` | Whether user is authenticated |
| `userString` | `string` | Display name or email |
| `userPhotoUrl` | `string \| false` | Avatar URL |
| `userEmail` | `string` | User email |
| `userUid` | `string` | Firebase user UID |

### Methods
| Method | Params | Description |
|--------|--------|-------------|
| `validateUser` | `{ email, password }` | Sign in with email/password |
| `logoutUser` | — | Sign out, clear user state |
| `loginUser` | `firebase.User` | Set user directly (called by auth state observer) |

---

## useEncountersStore — Encounter Management

**Store ID:** `'encounters'`
**Firestore paths:** `users/{uid}/encounters/{id}`, `users/{uid}/encounters/{id}/npcs/{npcId}`, `shared_encounters/{shareId}`

### State
| Ref | Type | Description |
|-----|------|-------------|
| `encountersAll` | `IEncounterEntity[]` | All user's encounters |
| `encountersCurrent` | `IEncounterEntity \| null` | Active encounter being viewed |
| `encountersNpcs` | `ICharacter[]` | NPCs in current encounter (sorted by initiative desc) |
| `npcInDetail` | `ICharacter \| null` | NPC selected for right detail panel |
| `isLoading` | `boolean` | Loading state |
| `sharedEncounter` | `IEncounterEntity \| null` | Encounter loaded via share link |
| `sharedEncounterNpcs` | `ICharacter[]` | NPCs in shared encounter |
| `isLoadingShared` | `boolean` | Shared encounter loading state |
| `sharedError` | `string \| null` | Error message for invalid/expired share links |

### Computed
| Name | Returns | Description |
|------|---------|-------------|
| `encountersActiveNpc` | `ICharacter \| undefined` | NPC whose turn it is (by `activeEntityIndex`) |
| `encountersCurrentId` | `string \| undefined` | ID of current encounter |
| `npcUuidInDetail` | `string \| undefined` | UUID of selected detail NPC |

### Methods — Encounters CRUD
| Method | Params | Firestore Operation |
|--------|--------|-------------------|
| `fetchEncounters` | — | `onSnapshot` on `users/{uid}/encounters` |
| `fetchEncounterById` | `{ encounterId }` | `get()` on encounter doc + `fetchEncountersCurrentNpcs` |
| `addNewEncounter` | `{ encounterName }` | `set()` new encounter doc |
| `removeEncounter` | `{ encounterId }` | `delete()` encounter doc |
| `updateName` | `{ encounterId, newName }` | `update({ name })` |

### Methods — Turn/Round Management
| Method | Params | Firestore Operation |
|--------|--------|-------------------|
| `updateRound` | `{ encounterId, newRoundIndex }` | `update({ round })` |
| `updateActiveEntityIndex` | `{ encounterId, activeEntityIndex, currentTurn? }` | `update({ activeEntityIndex, currentTurn? })` |
| `updateTurnState` | `{ encounterId, activeEntityIndex, currentTurn, round? }` | `update({ activeEntityIndex, currentTurn, round? })` |

### Methods — NPC Management
| Method | Params | Firestore Operation |
|--------|--------|-------------------|
| `fetchEncountersCurrentNpcs` | `{ encounterId }` | `onSnapshot` on `npcs` subcollection (ordered by initiative desc) |
| `addNpcToEncounter` | `{ npcData, encounterId }` | `set()` new NPC doc with fresh uuid, reset HP/initiative/conditions |
| `removeNpcFromEncounter` | `{ npcID, encounterId }` | `delete()` NPC doc |
| `setNpcInDetail` | `ICharacter \| null` | Local state only |

### Methods — Sharing
| Method | Params | Description |
|--------|--------|-------------|
| `generateShareLink` | `{ encounterId }` | Creates `nanoid(10)` share ID, writes to encounter doc + `shared_encounters/{shareId}` |
| `revokeShareLink` | `{ encounterId }` | Deletes share doc + removes `shareId` field from encounter |
| `fetchSharedEncounter` | `{ shareId }` | `onSnapshot` on share doc, encounter doc, and NPCs. Auto-disconnects if share doc is deleted. |

---

## useNpcsStore — NPC/Monster Library & Combat Mutations

**Store ID:** `'npcs'`
**Firestore paths:** `monsters/`, `npcs/`, `users/{uid}/encounters/{eid}/npcs/{nid}`

### State
| Ref | Type | Description |
|-----|------|-------------|
| `npcs` | `ICharacter[]` | Available monsters/NPCs from global collections |

### Methods — Library
| Method | Params | Description |
|--------|--------|-------------|
| `fetchNpcs` | — | Load `monsters` collection |
| `openNpcsConnection` | — | Real-time listener on `npcs` collection |
| `getNpcById` | `npcID: string` | Find NPC by ID in local array |
| `getSearchResults` | `query: string` | Filter NPCs by name (case-insensitive) |

### Methods — Combat Mutations (write to encounter NPC subcollection)
| Method | Params | Firestore Operation |
|--------|--------|-------------------|
| `updateHitPointCurrent` | `{ encounterId, npcId, newHitPoints }` | `update({ hit_points_current })` |
| `updateCondition` | `{ encounterId, npcId, newCondition: ICondition }` | `update({ conditions: arrayUnion(condition) })` |
| `removeConditionFromNpc` | `{ encounterId, npcId, conditionId }` | Reads doc, removes condition by ID, writes back |
| `updateInitiative` | `{ encounterId, npcId, newInitiative }` | `update({ initiative })` |
| `updateNpcConditionRound` | `{ encounterId, npcId }` | Reads doc, decrements condition durations, removes expired (duration reaches 0) |

---

## useCharacterBuilderStore — Character Creation/Editing

**Store ID:** `'characterBuilder'`
**Firestore paths:** `monsters/{id}`, `users/{uid}/characters/{uuid}`

### State
| Ref | Type | Description |
|-----|------|-------------|
| `character` | `Character` | Character being edited |
| `isLoading` | `boolean` | Fetch loading state |
| `isSaving` | `boolean` | Save operation state |

### Methods
| Method | Params | Description |
|--------|--------|-------------|
| `fetchCharacterById` | `{ id }` | Load from global `monsters` collection (public, no auth needed) |
| `fetchCharacterByUuid` | `{ characterUuid }` | Load from `users/{uid}/characters/{uuid}` |
| `saveCharacter` | `{ char, newCharacter }` | Create or update character. Generates uuid/uuid_ref for new. Calls `updateCharacterInEncounters` for existing. |
| `deleteCharacter` | `{ characterUuid }` | Delete from Firestore |
| `updateCharacterInEncounters` | `{ character }` | Finds all encounter NPCs with matching `uuid_ref`, updates them while preserving encounter-specific state (conditions, HP, initiative) |
| `setCharacter` | `Character` | Set character directly in state |

### Character ID System
- **`uuid`** — Unique per instance. Each NPC in an encounter gets its own uuid.
- **`uuid_ref`** — Template reference. Same across all copies derived from the same saved character. Used by `updateCharacterInEncounters` to find and update all instances.

---

## useCharactersStore — User's Character Library

**Store ID:** `'characters'`
**Firestore path:** `users/{uid}/characters` (ordered by `meta.updatedAt` desc)

### State
| Ref | Type | Description |
|-----|------|-------------|
| `characters` | `Character[]` | User's saved characters |
| `isLoading` | `boolean` | Loading state |

### Methods
| Method | Description |
|--------|-------------|
| `fetchCharacters` | Real-time `onSnapshot` listener, maps docs to `Character` instances |

---

## useDemoStore — Demo Mode Orchestration

**Store ID:** `'demo'`
**No Firestore access.** Operates entirely in-memory.

### State
| Ref | Type | Description |
|-----|------|-------------|
| `isDemoActive` | `boolean` | Whether demo mode is active |
| `interactionCount` | `number` | User interaction counter |
| `ctaShown` | `boolean` | Whether sign-up CTA has been shown |

### Methods
| Method | Description |
|--------|-------------|
| `activateDemo` | Populates `encountersStore` and `encountersNpcs` with demo data, replaces 11 store methods with in-memory equivalents |
| `deactivateDemo` | Restores all original store methods, clears demo state |
| `trackInteraction` | Increments counter, shows snackbar CTA at 5 interactions |

### Patched Methods
When demo is active, these store methods operate on in-memory arrays instead of Firestore:

**On encountersStore:** `fetchEncounterById`, `updateTurnState`, `updateActiveEntityIndex`, `updateRound`, `addNpcToEncounter`, `removeNpcFromEncounter`

**On npcsStore:** `updateHitPointCurrent`, `updateCondition`, `removeConditionFromNpc`, `updateInitiative`, `updateNpcConditionRound`

---

## useConfirmStore — Confirmation Dialogs

**Store ID:** `'confirm'`

### State
| Ref | Type | Description |
|-----|------|-------------|
| `dialog` | `boolean` | Dialog visibility |
| `title` | `string` | Dialog title |
| `message` | `string` | Dialog message |

### Methods
| Method | Returns | Description |
|--------|---------|-------------|
| `open` | `Promise<boolean>` | Show dialog, resolves when user confirms/cancels |
| `agree` | — | Resolve promise with `true` |
| `cancel` | — | Resolve promise with `false` |

---

## useSnackbarStore — Toast Notifications

**Store ID:** `'snackbar'`

### State
| Ref | Type | Description |
|-----|------|-------------|
| `message` | `string` | Notification text (supports HTML) |
| `visible` | `boolean` | Show/hide flag |
| `timeout` | `number` | Auto-dismiss duration (default 4000ms) |

### Methods
| Method | Params | Description |
|--------|--------|-------------|
| `show` | `msg: string, opts?: { timeout? }` | Display notification |
