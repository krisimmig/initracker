<template>
  <div class="NpcCondition mt-3">
    <Button
      v-for="(conditionId, index) in condition"
      @click="setSelectedCondition(conditionId)"
      @clickPostfix="removeStatus(conditionId)"
      v-if="getConditionName(conditionId)"
      :key="index"
      :is-small="true"
    >
      <template #default>
        {{ getConditionName(conditionId) }}
      </template>

      <template #postfix>
        -
      </template>
    </Button>

    <Button :is-small="true" :is-secondary="true" @click="showConditionSelect = !showConditionSelect">
      +
      <template v-if="[].length < 4"> condition</template>
    </Button>

    <DialogueBox
      v-if="showConditionSelect"
      @cancel="showConditionSelect = false"
      title="Add a status effect to this character"
    >
      <template v-slot:content>
        <Button
          v-for="(condition, index) in npcConditions"
          @click="addStatus(condition.id)"
          @clickPrefix="conditionEffects = condition.effects"
          :key="index"
        >
          <template #prefix><em>i</em></template>

          <template #default>
            {{ condition.name }}
          </template>
        </Button>

        <p v-if="conditionEffects.length > 0"></p>
        <ul class="u-list">
          <li v-for="(conditionEffect, index) in conditionEffects">{{ conditionEffect }}</li>
        </ul>

      </template>
    </DialogueBox>

    <DialogueBox
      v-if="showConditionDescription"
      @cancel="showConditionDescription = false"
      title="Condition explained"
    >
      <template #content>
        <ul class="u-list">
          <li v-for="(effect, index) in selectedCondition.effects" :key="index">{{ effect }}</li>
        </ul>
      </template>
    </DialogueBox>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import DialogueBox from '@/components/common/DialogueBox.vue';
import { readGetEncountersCurrentId } from '@/store/encountersModule';
import { dispatchRemoveConditionFromNpc, dispatchUpdateCondition } from '@/store/npcsModule';
import { ICondition, conditionList } from '@/types/conditionTypes';
import Button from '@/components/common/Button.vue';

@Component({
  components: {
    DialogueBox,
    Button,
  },
})
export default class NpcConditions extends Vue {
  public showConditionSelect: boolean = false;
  public showConditionDescription: boolean = false;
  public npcConditions: ICondition[] = conditionList;
  public selectedCondition!: ICondition;
  public conditionEffects: string[] = [];

  @Prop({ required: true, type: String }) private uuid!: string;
  @Prop({ required: true, type: Array }) private condition!: string[];

  public addStatus(conditionId) {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    dispatchUpdateCondition(this.$store, {
      encounterId,
      npcId: this.uuid,
      newCondition: conditionId,
    });

    this.showConditionSelect = false;
  }

  public getConditionName(conditionId: string): string | boolean {
    const condition =  this.npcConditions.find((s) => s.id === conditionId);
    if (condition) {
      return condition.name;
    }
    return false;
  }

  public setSelectedCondition(conditionId: number) {
    const condition =  this.npcConditions.find((s) => s.id === conditionId);
    if (condition) {
      this.selectedCondition = condition;
      this.showConditionDescription = true;
    }
  }

  public removeStatus(statusIndex: number) {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    dispatchRemoveConditionFromNpc(this.$store, {
      encounterId,
      npcId: this.uuid,
      statusIndex,
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
