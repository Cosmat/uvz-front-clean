<template>
  <div>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> {{ userName }}</q-toolbar-title>
      <q-space />
      <q-btn
        size="sm"
        label="Создать заявку"
        @click="createBtn = true"
        class="q-mr-lg"
      ></q-btn>
      <router-link to="/" class="link">
        <q-btn size="sm" label="на главную" />
      </router-link>
    </q-toolbar>

    <create-zayavka
      v-if="createBtn"
      @chancel="createBtn = false"
    ></create-zayavka>
    <div v-if="loading" class="full_width q-mt-lg" style="height: 100vh">
      <q-spinner-pie color="orange" size="7.5em" />
    </div>

    <div v-if="epmty_or_not === true" class="text-h5 full_width_w text-white q-mt-xl q-ml-xl">
      У Вас пока нет созданных вакансий. Чтобы создать вакансию нажмите создать
      заявку.
    </div>
    <q-list
      v-else
      v-for="item in myZayavki"
      :key="item._id || item.id"
      dark
      separator
      class="full_width"
    >
      <zayavkaProfile
        @del="delProf"
        :tzeh="item.tzeh"
        :professia="item.professia"
        :description="item.description"
        :date="item.date"
        :id="item._id || item.id"
      >
        {{ item }}
      </zayavkaProfile>
    </q-list>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useZayavkaStore } from "stores/zayavka";
import { useAuthStore } from "stores/auth";
import { useQuasar } from "quasar";
import zayavkaProfile from "../components/TheZayavkaProfile";
import CreateZayavka from "../components/createZayavka.vue";

export default {
  components: { zayavkaProfile, CreateZayavka },

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const zayavkaStore = useZayavkaStore();
    const authStore = useAuthStore();

    onBeforeMount(async () => {
      loading.value = true;
      try {
        const response = await zayavkaStore.fetchMyZayavki();
        myZayavki.value = response.data.reverse();
      } catch (e) {
        console.error('Failed to fetch profile zayavki:', e);
      } finally {
        loading.value = false;
      }

      if (myZayavki.value.length === 0) {
        epmty_or_not.value = true;
      } else {
        epmty_or_not.value = false;
      }
    });

    const userName = computed(() => authStore.user?.username || '');

    var loading = ref(false);
    var myZayavki = ref([]);
    var createBtn = ref(false);
    var epmty_or_not = ref(false);

    const zayavkaCreated = () => {
      createBtn.value = false;
      $q.notify({
        type: 'positive',
        message: 'Вакансия создана',
        position: 'top'
      });
    };

    const delProf = async (id) => {
      try {
        loading.value = true;
        await zayavkaStore.deleteZayavka(id);
        // Refetch to update list
        const response = await zayavkaStore.fetchMyZayavki();
        myZayavki.value = response.data.reverse();
        $q.notify({
          type: 'positive',
          message: 'Вакансия удалена',
          position: 'top'
        });
      } catch (e) {
        console.error('Delete error:', e);
        $q.notify({
          type: 'negative',
          message: 'Ошибка при удалении',
          position: 'top'
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      Name: userName,
      createBtn,
      myZayavki,
      loading,
      epmty_or_not,
      zayavkaCreated,
      delProf
    };
  },
};
</script>

<style scoped>
.full_width {
  display: flex;
  justify-content: center;
  align-items: center;
}
.full_width_w {
  display: flex;
  justify-content: center;
}
</style>