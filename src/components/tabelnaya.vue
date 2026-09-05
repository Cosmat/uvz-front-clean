<template>
  <q-toolbar class="bg-purple text-white">
    <q-toolbar-title class="q-ml-lg">Телефоны табельных</q-toolbar-title>

    <q-space />
    <q-btn class="q-mr-lg" to="/">На главную</q-btn>
  </q-toolbar>

  <div v-if="loading" class="full_width" style="height: 100vh">
    <q-spinner-pie color="orange" size="7.5em" />
  </div>
  <div v-else>
    <div class="row q-pl-md q-pr-md q-pt-md">
      <q-input
        v-model="filter.number_tzeh"
        debounce="200"
        clearable
        clear-icon="close"
        bg-color="white"
        rounded
        outlined
        class="col-12 col-sm-6 col-md-4 q-mr-sm q-mb-sm"
        label="Номер цеха"
        :hint="'Найдено: ' + phoneData.length"
      >
        <template v-slot:prepend>
          <q-icon name="work" />
        </template>
      </q-input>
    </div>

    <div v-if="phoneData.length === 0" class="q-pa-md">
      <q-banner rounded class="bg-grey-2 text-dark">
        <q-icon name="info" color="primary" class="q-mr-sm" />
        Ничего не найдено. Измените параметры поиска.
      </q-banner>
    </div>

    <div class="row q-pa-md q-col-gutter-md">
      <div
        v-for="item in phoneData"
        :key="item._id || (item.number_tzeh + '_' + item.nuber_phone)"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card bordered flat class="bg-white">
          <q-item>
            <q-item-section avatar>
              <q-avatar color="purple" text-color="white">
                <q-icon name="apartment" />
              </q-avatar>
          </q-item-section>
          <q-item-section>
              <div class="row items-center no-wrap">
                <div class="text-subtitle1 text-weight-bold q-mr-sm">Цех</div>
                <q-badge color="purple" align="middle">{{ item.number_tzeh }}</q-badge>
              </div>
              <div class="text-body2 text-grey-7 q-mt-xs">
                Номер телефона
              </div>
              <div class="text-h6 text-dark">
                {{ item.nuber_phone }}
              </div>
          </q-item-section>
        </q-item>
          <q-separator />
          <q-card-actions align="right">
            <q-btn
              color="primary"
              icon="content_copy"
              label="Копировать"
              flat
              @click="copyToClipboard(item.nuber_phone)"
            />
          </q-card-actions>
      </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "Tabelnaya",
  setup() {
    const store = useStore();
    var loading = ref(false);
    const filter = ref({});

    onBeforeMount(async () => {
      loading.value = true;
      await store.dispatch("requests/getallPhoneTabel");
      loading.value = false;
    });

    const phoneData = computed(() =>
      (store.getters["requests/getallPhoneTabel"] || [])
        .filter((item) => {
          if (filter.value.number_tzeh) {
            return String(item.number_tzeh)
              .toLowerCase()
              .includes(String(filter.value.number_tzeh).toLowerCase());
          }
          return item;
        })
    );

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(String(text));
      } catch (e) {
        const el = document.createElement("textarea");
        el.value = String(text);
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
    };

    return {
      loading,
      phoneData,
      filter,
      copyToClipboard,
    };
  },
};
</script>

<style scoped>
/* Мелкие доработки верстки */
</style>
