<template>
  <div class="NpcCondition mt-3">
    <Button
      v-for="(conditionId, index) in condition"
      @click="setSelectedCondition(conditionId)"
      @clickPostfix="removeCondition(conditionId)"
      v-if="getConditionName(conditionId)"
      :key="index"
      is-small
    >
      <template #default>{{ getConditionName(conditionId) }}</template>
      <template #postfix>-</template>
    </Button>

    <Button
        is-small
        is-secondary
        @click="showConditionSelect = !showConditionSelect"
    >
      +
      <template v-if="[].length < 4"> condition</template>
    </Button>

    <DialogueBox
      v-if="showConditionSelect"
      @cancel="showConditionSelect = false"
      title="Add a status effect to this character"
    >
      <template #content>
        <Button
          v-for="(condition, index) in npcConditions"
          @click="addCondition(condition.id)"
          @clickPrefix="selectedCondition = condition"
          class="ml-0 mr-2 mt-1"
          :key="index"
        >
          <template #prefix><em>i</em></template>
          {{ condition.name }}
        </Button>

        <template v-if="selectedCondition">
          <h4 class="mt-4">{{ selectedCondition.name }}</h4>
          <ul class="u-list">
            <li v-for="(effect, index) in selectedCondition.effects" :key="index">{{ effect }}</li>
          </ul>
        </template>

      </template>
    </DialogueBox>

    <DialogueBox
      v-if="showConditionDescription"
      @cancel="showConditionDescription = false"
      :title='`The ${ selectedCondition.name } condition`'
    >
      <template #content>
        <p>
          <em>These are the effects of the {{ selectedCondition.name }} condition:</em>
        </p>
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
  public selectedCondition: ICondition | null = null;

  @Prop({ required: true, type: String }) private uuid!: string;
  @Prop({ required: true, type: Array }) private condition!: string[];

  public addCondition(conditionId) {
    this.selectedCondition = null;
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

  public setSelectedCondition(conditionId: string) {
    const condition =  this.npcConditions.find((c) => c.id === conditionId);
    if (condition) {
      this.selectedCondition = condition;
      this.showConditionDescription = true;
    }
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
