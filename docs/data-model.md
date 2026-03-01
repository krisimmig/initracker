# Data Model

## Firestore Schema

```
firestore/
│
├── monsters/{monsterId}                    # Global collection (public read for auth users)
│   └── (Character fields)                  # Pre-loaded D&D 5e monsters
│
├── npcs/{npcId}                            # Global NPC collection
│   └── (Character fields)
│
├── users/{userId}/
│   ├── characters/{characterUuid}          # User's saved characters
│   │   └── (Character fields)
│   │
│   └── encounters/{encounterId}            # User's encounters
│       ├── id: string
│       ├── name: string
│       ├── round: number
│       ├── activeEntityIndex: number       # 1-indexed (whose turn)
│       ├── currentTurn: number             # Total turns elapsed
│       ├── createdAt: number               # Timestamp
│       ├── shareId?: string                # nanoid(10), set when sharing
│       │
│       └── npcs/{npcId}                    # NPCs in this encounter
│           └── (Character fields)          # Full character data + encounter state
│
└── shared_encounters/{shareId}             # Share link lookup (public read)
    ├── ownerUid: string
    ├── encounterId: string
    └── createdAt: Timestamp
```

## Character Class

**File:** `src/classes/Character.ts`

The `Character` class is the core data model. It represents both player characters and monsters/NPCs. The same class is used for saved character templates and encounter instances.

### Constructor

```typescript
new Character()          // Blank character with all defaults
new Character(data)      // Merge data with defaults (lodash mergeWith)
```

The constructor uses `lodash.mergeWith` to deep-merge provided data with defaults, preferring non-null values from the input.

### Properties

#### Identity
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `''` | Character name |
| `id` | `string` | `''` | Monster ID or name identifier |
| `uuid` | `string` | `''` | Unique instance ID (generated on save/add-to-encounter) |
| `uuid_ref` | `string` | `''` | Template reference ID (same across copies from same saved character) |
| `category` | `CharacterCategories` | `NPC` | NPC, Player, Enemy, or Other |
| `type` | `CreatureTypes \| CharacterRaces` | `''` | Creature type or playable race |
| `subtype` | `string` | `''` | Creature subtype |
| `size` | `CharacterSizes` | `Medium` | Tiny through Gargantuan |
| `alignment` | `string` | `''` | D&D alignment |
| `group` | `string` | `''` | Optional grouping |

#### Combat
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hit_points` | `number` | `10` | Maximum HP |
| `hit_points_current` | `number` | `= hit_points` | Current HP (set on init) |
| `armor_class` | `number` | `10` | AC value |
| `armor_desc` | `string` | `''` | Armor description (e.g., "leather armor") |
| `initiative` | `number` | `10` | Initiative value (set by roll in encounter) |
| `hit_dice` | `string` | `''` | Hit dice notation (e.g., "8d8+16") |
| `challenge_rating` | `string` | `''` | CR value |
| `conditions` | `ICondition[]` | `[]` | Active conditions with optional durations |

#### Ability Scores
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `strength` | `number` | `10` | STR score |
| `dexterity` | `number` | `10` | DEX score |
| `constitution` | `number` | `10` | CON score |
| `intelligence` | `number` | `10` | INT score |
| `wisdom` | `number` | `10` | WIS score |
| `charisma` | `number` | `10` | CHA score |
| `strength_save` | `number` | `0` | STR saving throw modifier |
| `dexterity_save` | `number` | `0` | DEX saving throw modifier |
| `constitution_save` | `number` | `0` | CON saving throw modifier |
| `intelligence_save` | `number` | `0` | INT saving throw modifier |
| `wisdom_save` | `number` | `0` | WIS saving throw modifier |
| `charisma_save` | `number` | `0` | CHA saving throw modifier |

#### Movement & Senses
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | `{ walk, swim, fly, burrow, climb }` | all `0` | Speed values in feet |
| `senses` | `string` | `''` | Senses description |
| `perception` | `number` | `0` | Passive perception |

#### Traits
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `languages` | `string` | `''` | Known languages |
| `damage_immunities` | `string` | `''` | Damage immunities |
| `damage_resistances` | `string` | `''` | Damage resistances |
| `damage_vulnerabilities` | `string` | `''` | Damage vulnerabilities |
| `condition_immunities` | `string` | `''` | Condition immunities |

#### Abilities & Actions
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `actions` | `ICharacterAbility[]` | `[]` | Standard actions |
| `special_abilities` | `ICharacterAbility[]` | `[]` | Passive/special traits |
| `reactions` | `string` | `''` | Reaction text |
| `legendary_actions` | `ICharacterAbility[]` | `[]` | Legendary actions |

#### Metadata
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `meta.createdAt` | `Date` | `new Date()` | Creation timestamp |
| `meta.updatedAt` | `Date` | `new Date()` | Last update timestamp |

### Static Methods

| Method | Description |
|--------|-------------|
| `Character.getDescription(data)` | Returns `"{size} {alignment} {type} with CR of {cr}"` |
| `Character.getSpeedString(data)` | Returns `"30ft (walk), 15ft (swim)"` |
| `Character.getCreatedAt(data)` | Parses Firestore timestamp to locale string |
| `Character.getUpdatedAt(data)` | Parses Firestore timestamp to locale string |

### ICharacterAbility Interface

```typescript
interface ICharacterAbility {
  desc: string   // Description text (may contain dice notation like "2d6+3")
  name: string   // Ability name
}
```

### Character ID Semantics

When a character is **saved** to the user's library:
- `uuid` = unique ID for the saved character
- `uuid_ref` = same as `uuid` (or separately generated)

When a character is **added to an encounter**:
- `uuid` = NEW unique ID for this encounter instance
- `uuid_ref` = original character's `uuid_ref` (links back to template)
- `hit_points_current` = reset to `hit_points`
- `initiative` = reset to 0
- `conditions` = cleared

When `updateCharacterInEncounters` runs (editing a saved character):
- Finds all encounter NPCs where `uuid_ref` matches
- Updates stat fields from the template
- **Preserves** encounter-specific state: `conditions`, `hit_points_current`, `uuid`, `initiative`

---

## TypeScript Types & Enums

All defined in `src/types/`.

### IEncounterEntity
```typescript
interface IEncounterEntity {
  id: string                  // Firestore document ID
  name: string                // Display name
  round: number               // Current round (starts at 1)
  activeEntityIndex: number   // 1-indexed position in sorted NPC list
  currentTurn: number         // Total turns taken (for game time calc: turns * 6 = seconds)
  createdAt: number           // Timestamp
  shareId?: string            // nanoid(10) share link ID
}
```

### ICondition
```typescript
interface ICondition {
  name: string          // Condition name (e.g., "Frightened")
  id: string            // Unique ID for this condition instance
  effects?: string[]    // Array of effect descriptions
  duration?: number     // Rounds remaining (decremented each round, removed at 0)
}
```

### Enums

| File | Enum | Values |
|------|------|--------|
| `characterAttributes.ts` | `CharacterAttributes` | STR, DEX, CON, INT, WIS, CHA |
| `characterAlignments.ts` | `CharacterAlignments` | LawfulGood through ChaoticEvil (9 values) |
| `characterSizes.ts` | `CharacterSizes` | Tiny, Small, Medium, Large, Huge, Gargantuan |
| `characterRaces.ts` | `CharacterRaces` | 40+ D&D races (Human, Elf, Dwarf, Tiefling, etc.) |
| `creatureTypes.ts` | `CreatureTypes` | aberration, beast, celestial, construct, dragon, elemental, fey, fiend, giant, humanoid, monstrosity, ooze, plant, undead |
| `characterCategories.ts` | `CharacterCategories` | NPC, Player, Enemy, Other |
| `users.ts` | `LoginCredentials` | `{ email: string; password: string }` |

### conditionTypes.ts — Condition Registry

Exports `conditionList: ICondition[]` with 18 entries: the 13 standard D&D 5e conditions (Blinded, Charmed, Deafened, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Restrained, Stunned, Unconscious) plus Exhaustion levels 1–6. Each includes effect descriptions from the SRD.

---

## Utility Functions

**File:** `src/utils/dnd.ts`

| Function | Signature | Description |
|----------|-----------|-------------|
| `calcModifier` | `(score: number) => number` | `Math.floor((score - 10) / 2)` |
| `modifierWithSign` | `(score: number) => string` | Returns `"+3"`, `"-1"`, or `""` for 0 |
| `stringModifier` | `(score: number) => string` | Returns `"(+3)"`, `"(-1)"`, or `""` |
