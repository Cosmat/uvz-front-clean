<template>
  <div v-if="message" class="width_center q-pa-md">
    <q-banner class="bg-teal text-white">
      {{ message }}
    </q-banner>
  </div>
</template>

<script>
import { ref, onUnmounted } from "vue";

// Self-contained message bus (no Vuex — the app uses Pinia only).
export const messageBus = ref(null);

let timer = null;
export function showMessage(text, timeout = 4000) {
  messageBus.value = text;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => (messageBus.value = null), timeout);
}

export default {
  name: "AppMessage",
  setup() {
    const message = messageBus;
    onUnmounted(() => {
      if (timer) clearTimeout(timer);
    });
    return { message };
  },
};
</script>

<style scoped>
.width_center {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
