<template>
  <div class="my row">
    <div class="col-xs-5 col-lg-3 q-pt-md">
      <q-input
        rounded
        outlined
        color="orange"
        bg-color="deep-purple-2"
        label="поиск по шифру"
        dense
        v-model="shifr"
      />
    </div>
    <div class="col-xs-5 col-lg-3 q-pt-md">
      <q-input
        rounded
        outlined
        color="orange"
        bg-color="deep-purple-2"
        label="поиск по описанию"
        dense
        v-model="description"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
export default {
  emits: ["update:modelValue"],
  props: ["modelValue"],
  setup(_, { emit }) {
    const shifr = ref();
    const description = ref("");
    watch([shifr, description], (values) => {
      emit("update:modelValue", {
        shifr: values[0],
        description: values[1].toLowerCase().trim(),
      });
    });
    return { shifr, description };
  },
};
</script>

<style scoped>
.my {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
