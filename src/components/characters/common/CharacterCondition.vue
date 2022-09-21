<template>
  <div class="NpcCondition mt-3">
    <v-btn
      v-for="(conditionId, index) in conditions"

      @click="setSelectedCondition(conditionId)"
      v-if="getConditionName(conditionId)"
      :key="index"
      small
      text
      color="primary"
    >
      {{ getConditionName(conditionId) }}
    </v-btn>

    <v-btn
     @click="showConditionSelect = true"
     small
     outlined
     color="primary"
    >
      <v-icon>mdi-plus</v-icon>
      <template v-if="conditions.length < 4"> condition</template>
    </v-btn>

    <v-dialog v-model="showConditionSelect" max-width="650px">
      <v-card>
        <v-app-bar flat>
          <v-toolbar-title>Update conditions</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="showConditionSelect = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <div >
                  <v-btn
                    small
                    v-for="(condition, index) in npcConditions" :key="index"
                    @click="selectedCondition = condition"
                    :color="conditions.includes(condition.id) ? 'primary' : ''"
                    class="mb-2 mr-2"
                  >
                    {{ condition.name }}
                  </v-btn>
                </div>
              </v-col>
              <v-col>
                <template v-if="selectedCondition">
                  <h4 class="title">{{ selectedCondition.name }}</h4>
                  <ul class="u-list mb-4 body-1">
                    <li v-for="(effect, index) in selectedCondition.effects" :key="index">{{ effect }}</li>
                  </ul>

                  <div v-if="conditions.includes(selectedCondition.id)">
                    <v-btn small color="primary" @click="removeCondition(selectedCondition.id)">
                      <v-icon>mdi-minus</v-icon>
                      Remove {{ selectedCondition.name }}
                    </v-btn>
                  </div>
                  <div v-else>
                    <v-btn small color="primary" @click="addCondition(selectedCondition.id)">
                      <v-icon>mdi-plus</v-icon>
                      Add {{ selectedCondition.name }}
                    </v-btn>
                  </div>
                </template>
                <template v-else>
                  <v-alert type="info" outlined>Select a condition from the list to see more info.</v-alert>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { readGetEncountersCurrentId } from '@/store/encountersModule';
import { dispatchRemoveConditionFromNpc, dispatchUpdateCondition } from '@/store/npcsModule';
import { ICondition, conditionList } from '@/types/conditionTypes';

@Component
export default class NpcConditions extends Vue {
  public showConditionSelect: boolean = false;
  public npcConditions: ICondition[] = conditionList;
  public selectedCondition: ICondition | null = null;

  @Prop({ required: true, type: String }) private uuid!: string;
  @Prop({ required: true, type: Array }) private conditions!: string[];

  public addCondition(conditionId) {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    dispatchUpdateCondition(this.$store, {
      encounterId,
      npcId: this.uuid,
      newCondition: conditionId,
    });
  }

  public setSelectedCondition(conditionId: string) {
    const condition = this.npcConditions.find((c) => c.id === conditionId);
    if (condition) {
      this.showConditionSelect = true;
      this.selectedCondition = condition;
    }
  }

  public getConditionName(conditionId: string): string | boolean {
    const condition =  this.npcConditions.find((s) => s.id === conditionId);
    if (condition) {
      return condition.name;
    }
    return false;
  }

  public removeCondition(conditionId: string) {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    dispatchRemoveConditionFromNpc(this.$store, {
      encounterId,
      npcId: this.uuid,
      conditionId,
    });
  }
}
</script>

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
</style>
