<template>
  <div class="NpcStatus">
    <span
      v-for="(status, index) in statuses"
      @click="removeStatus(status)"
      :key="index"
      class="NpcListItem-status"
    >
      {{ statusString(status) }}
    </span>
    <span @click="showStatusSelect = !showStatusSelect">
      +
      <template v-if="statuses.length < 4">
        add condition
      </template>
    </span>

    <DialogueBox
      v-if="showStatusSelect"
      @cancel="showStatusSelect = false"
    >
      <template v-slot:content>
        <select
          v-model="newStatus"
          @change="addStatus"
          class="NpcListItem-statusSelect"
        >
          <option disabled value="default">Select new state</option>
          <option
            v-for="(state, index) in npcStates"
            v-bind:value="state.id"
            :key="index"
          >{{ state.name }}</option>
        </select>
      </template>
    </DialogueBox>

  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { StatusTypes } from '../../../types/characters';
import DialogueBox from '@/components/common/DialogueBox.vue';
import { readGetEncountersCurrentId } from '@/store/encountersModule';
import { dispatchRemoveStatusFromNpc, dispatchUpdateStatus, readGetNpcStates } from '@/store/npcsModule';

@Component({
  components: {
    DialogueBox,
  },
})
export default class NpcStatus extends Vue {
  public showStatusSelect: boolean = false;
  public newStatus: StatusTypes | 'default' = 'default';

  @Prop({ required: true, type: Array }) private statuses!: StatusTypes[];
  @Prop({ required: true, type: String }) private uuid!: string;

  get npcStates() {
    return readGetNpcStates(this.$store);
  }

  public statusString(enumValue: StatusTypes): string {
    return StatusTypes[enumValue];
  }

  public addStatus() {
    if (this.newStatus === 'default') { return; }

    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    dispatchUpdateStatus(this.$store, {
      encounterId,
      npcId: this.uuid,
      newStatus: this.newStatus,
    });

    this.showStatusSelect = false;
    this.newStatus = 'default';
  }

  public removeStatus(statusIndex: StatusTypes) {
    const encounterId = readGetEncountersCurrentId(this.$store);
    if (!encounterId) { return; }

    dispatchRemoveStatusFromNpc(this.$store, {
      encounterId,
      npcId: this.uuid,
      statusIndex,
    });
  }
}
</script>

<style>
</style>