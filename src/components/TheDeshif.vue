<template>
  <div class="deshif-page">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-icon name="vpn_key" size="md" class="q-mr-md" />
      <q-toolbar-title class="q-ml-lg text-h5">Дешифратор</q-toolbar-title>
      <q-space />
      <q-btn class="q-mr-lg" to="/" color="secondary" unelevated rounded
        >На главную</q-btn
      >
    </q-toolbar>

    <div v-if="loading" class="full_width" style="height: 100vh">
      <q-spinner-pie color="orange" size="7.5em" />
    </div>
    <div v-else>
      <div class="row q-col-gutter-md q-mt-lg q-mb-md flex flex-center">
        <q-card class="search-card col-12 col-md-8 col-lg-6">
          <q-card-section>
            <poisk_shifr
              v-model="filter"
              placeholder="Поиск по шифру или описанию..."
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="row q-col-gutter-md flex flex-center">
        <q-card
          v-for="item in ddata"
          :key="item"
          class="deshif-card col-12 col-md-8 col-lg-6 q-mb-md"
        >
          <q-card-section class="row items-center">
            <q-icon name="key" color="primary" size="32px" class="q-mr-md" />
            <div class="text-h6 text-weight-bold text-primary">
              {{ item.shifr }}
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-body1">{{ item.description }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import poisk_shifr from "src/components/ui/poisk_shifr";
import { onBeforeMount, ref, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import keys from '@/keys/keys.dev';
export default {
  name: "Deshife",
  components: { poisk_shifr },
  setup() {
    const store = useStore();
    var loading = ref(false);
    const shifr = ref(null);
    const description = ref(null);
    const filter = ref({});

    onBeforeMount(async () => {
      loading.value = true;
      await store.dispatch("requests/getallDeshife");
      loading.value = false;
    });
    const ddata = computed(() =>
      store.getters["requests/getallDeshife"]
        .filter((dddata) => {
          if (filter.value.shifr) {
            return dddata.shifr.includes(filter.value.shifr);
          }
          return dddata;
        })
        .filter((dddata) => {
          if (filter.value.description) {
            return dddata.description.includes(filter.value.description);
          }
          return dddata;
        })
    );
    return {
      loading,
      shifr,
      description,
      ddata,
      filter,
      async onSubmit() {
        if (shifr.value && description.value) {
          loading.value = true;
          try {
            const formData = {
              shifr: shifr.value,
              description: description.value,
            };
            await axios.post(`${keys.BASE_URL}/create_Deshife`, formData);
          } catch (e) {
            console.log("error: ", e);
            loading.value = false;
          }
        } else {
          $store.dispatch("setMessage", {
            value: "Во время создания дешифр что то пошлот не так",
            type: "warning",
          });
        }
      },
    };
  },
};
</script>

<style scoped>
.deshif-page {
  background: #f5f5f5;
  min-height: 100vh;
}
.search-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  background: #fff;
}
.deshif-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  background: #fff;
  transition: box-shadow 0.2s;
}
.deshif-card:hover {
  box-shadow: 0 4px 24px rgba(25, 118, 210, 0.18);
}
.text-primary {
  color: #1976d2;
}
.text-body1 {
  color: #333;
}
@media (max-width: 600px) {
  .search-card,
  .deshif-card {
    margin-bottom: 12px;
  }
}
</style>
