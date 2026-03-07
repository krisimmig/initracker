export type ActivityLogType =
  | 'dice_roll'
  | 'hp_change'
  | 'condition_add'
  | 'condition_remove'
  | 'initiative_roll'
  | 'turn_advance'
  | 'round_advance'
  | 'character_add'
  | 'character_remove'
  | 'encounter_reset'

export interface ActivityLogEntry {
  id: string
  type: ActivityLogType
  timestamp: number
  round?: number
  turn?: number
  actorName?: string
  message: string
  detail?: string
}
