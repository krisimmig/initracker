<template >
  <div class="NpcCondition mt-3">
    <v-btn
        v-for="(condition, index) in conditions"
        @click="setSelectedCondition(condition.id)"
        :key="index"
        small
        outlined
        color="secondary"
        class="mr-1 mb-1"
    >
      {{ condition.name }}
      <span
          v-if="condition.duration"
          class="ml-1"
      >
        ({{ condition.duration }})
      </span >
    </v-btn >

    <v-btn
        @click="showConditionSelect = true"
        small
        text
        color="primary"
        class="mb-1"
    >
      <v-icon left>mdi-plus</v-icon >
      <template v-if="conditions.length < 4"> condition</template >
    </v-btn >

    <v-dialog
        v-model="showConditionSelect"
        width="min(80vw, 900px)"
    >
      <v-card >
        <v-app-bar flat>
          <v-toolbar-title >Set this characters status effects</v-toolbar-title >
          <v-spacer ></v-spacer >
          <v-btn
              icon
              @click.stop="showConditionSelect = false"
          >
            <v-icon >mdi-close</v-icon >
          </v-btn >
        </v-app-bar >

        <v-card-text style="height: 500px;">
          <v-container >
            <v-row >
              <v-col >
                <div style="column-count: 2">
                  <div
                      v-for="condition in npcConditions"
                      :key="condition.id"
                  >
                    <v-btn
                        small
                        text
                        @click="selectedCondition = condition"
                        :color="isActiveCondition(condition.id) ? 'primary' : ''"
                        :class="[{'text-decoration-underline': selectedCondition?.id === condition.id}, 'mb-2 mr-2']"
                    >
                      {{ condition.name }}
                    </v-btn >
                  </div >
                </div >
              </v-col >
              <v-col >
                <template v-if="selectedCondition">
                  <h4 class="title">{{ selectedCondition.name }}</h4 >
                  <ul class="u-list mb-4 body-1">
                    <li
                        v-for="(effect, index) in selectedCondition.effects"
                        :key="index"
                    >{{ effect }}
                    </li >
                  </ul >

                </template >
                <template v-else>
                  <v-alert
                      type="info"
                      outlined
                  >Select a condition from the list to see more info.
                  </v-alert >
                </template >
              </v-col >
            </v-row >
          </v-container >
        </v-card-text >
        <v-card-actions >
          <v-spacer ></v-spacer >
          <template v-if="selectedCondition">
            <div v-if="isActiveCondition(selectedCondition.id)">
              <v-btn
                  color="primary"
                  @click="removeCondition(selectedCondition.id)"
                  class="mb-5 mr-3"
              >
                <v-icon left>mdi-minus</v-icon >
                Remove {{ selectedCondition.name }}
              </v-btn >
            </div >
            <div
                v-else
                class="d-flex align-middle"
            >
              <v-text-field
                  v-model="selectedCondition.duration"
                  label="Duration (in Rounds)"
                  class="pt-0 mt-0"
                  prepend-inner-icon="mdi-clock"
                  hint="Leave empty for permanent conditions"
              />
              <v-btn
                  color="primary"
                  style="width: 200px; margin: 0 1rem;"
                  @click="addCondition(selectedCondition)"
              >
                <v-icon left>mdi-plus</v-icon >
                Add {{ selectedCondition.name }}
              </v-btn >
            </div >
          </template >
        </v-card-actions >
      </v-card >
    </v-dialog >
  </div >
</template >

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { readGetEncountersCurrentId } from '@/store/encountersModule';
import { dispatchRemoveConditionFromNpc, dispatchUpdateCondition } from '@/store/npcsModule';
import { ICondition, conditionList } from '@/types/conditionTypes';
import { find } from "lodash";

@Component
export default class NpcConditions extends Vue {
  public showConditionSelect: boolean = false;
  public npcConditions: ICondition[] = conditionList;
  public selectedCondition: ICondition | null = null;

  @Prop() uuid!: string;
  @Prop() name!: string;
  @Prop() conditions!: ICondition[];

  public isActiveCondition(conditionId: string): boolean {
    return !!find(this.conditions, (c) => c.id === conditionId);
  }

  public addCondition(condition: ICondition) {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) {
      return;
    }

    dispatchUpdateCondition(this.$store, {
      encounterId,
      npcId: this.uuid,
      newCondition: condition,
    });

    const rounds = condition.duration ? ` for ${condition.duration} rounds` : '';
    this.$toast(`${this.name} is ${condition.name.toLowerCase()}${rounds}.`);
  }

  public setSelectedCondition(conditionId: string) {
    const condition = this.npcConditions.find((c) => c.id === conditionId);
    if (condition) {
      this.showConditionSelect = true;
      this.selectedCondition = condition;
    }
  }

  public removeCondition(conditionId: string) {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) {
      return;
    }

    dispatchRemoveConditionFromNpc(this.$store, {
      encounterId,
      npcId: this.uuid,
      conditionId,
    });

    const condition = this.npcConditions.find(({id}) => id === conditionId);
    if (condition) {
      this.$toast(`${this.name} is no longer ${condition.name.toLowerCase()}.`);
    }
  }
}
</script >

<style lang="scss">
.NpcCondition-condition,
.NpcCondition-add {
  font-size: .8em;
  color: theme('colors.blue.600');
  cursor: pointer;
  margin-right: .7em;
  border: 1px solid theme('colors.blue.400');;
  border-radius: 1em;
  height: 1.4rem;
  display: inline-block;
  text-align: center;
  padding: 0 7px 3px 7px;
}

.NpcCondition-addText {
  display: inline-block;
}

.NpcCondition-condition {
  margin-right: .7em;
  cursor: pointer;
}

.NpcCondition-add:hover,
.NpcCondition-condition:hover {
  color: theme('colors.blue.100');
  border-color: theme('colors.blue.500');
  background-color: theme('colors.blue.600');
}
</style >
