<template>
  <form class="Form">
    <h3>{{ title }}</h3>

    <Collapsable
        class="CharacterBuilder-removable"
        v-for="(ability, index) in abilities"
        :key="`ability-${type}-${index}`"
    >
      <template v-slot:title>
        <p class="CharacterBuilder-actionTitle">{{ ability.name }}</p>
      </template>

      <template v-slot:content>
        <v-text-field v-model="ability.name" label="Name" />
        <v-textarea v-model="ability.desc" label="Description" />
        <v-btn color="error" @click="$emit('removeAbility', { type, index })">- Remove {{ ability.name }}</v-btn>
      </template>
    </Collapsable>


    <v-btn @click="$emit('addAbility', { type })">+ Add ability</v-btn>

  </form>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import Collapsable from "@/components/common/Collapsable.vue";

@Component({
  components: {Collapsable}
})
export default class CharacterBuilderAbilities extends Vue {
  @Prop({ required: true, type: String }) private type!: string;
  @Prop({ required: true, type: String }) private title!: string;
  @Prop({ required: true, type: Array }) private abilities!: [{ name: string, desc: string }];
}
</script>

<style lang="scss">
</style>
