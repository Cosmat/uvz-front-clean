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
            <q-input
              v-model="filter.shifr"
              dense
              clearable
              placeholder="Поиск по шифру или описанию..."
              label="Шифр / Описание"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-section>
        </q-card>
      </div>
      <div class="row q-col-gutter-md flex flex-center">
        <q-card
          v-for="item in filteredDeshife"
          :key="item.shifr"
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
import { onBeforeMount, ref, computed } from "vue";
import { useDeshifeStore } from "stores/deshife";
import { useQuasar } from "quasar";

export default {
  name: "Deshife",

  setup() {
    const $q = useQuasar();
    const deshifeStore = useDeshifeStore();

    const loading = ref(false);
    const filter = ref({});

    onBeforeMount(async () => {
      loading.value = true;
      try {
        await deshifeStore.fetchDeshife({ limit: 1000 });
        await deshifeStore.fetchCategories();
      } catch (e) {
        console.error('Failed to fetch deshife:', e);
      } finally {
        loading.value = false;
      }
    });

    const filteredDeshife = computed(() => {
      let data = deshifeStore.deshife;
      if (filter.value.shifr) {
        const q = filter.value.shifr.toLowerCase();
        data = data.filter(d => 
          d.shifr.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
        );
      }
      if (filter.value.category) {
        data = data.filter(d => d.category === filter.value.category);
      }
      return data;
    });

    const createDeshife = async (shifr, description, category) => {
      if (!shifr || !description) {
        $q.notify({
          type: 'warning',
          message: 'Заполните шифр и описание',
          position: 'top'
        });
        return;
      }
      loading.value = true;
      try {
        await deshifeStore.createDeshife({ shifr, description, category: category || 'Начисления' });
        $q.notify({
          type: 'positive',
          message: 'Дешифр создан',
          position: 'top'
        });
      } catch (e) {
        console.error('Create deshife error:', e);
        $q.notify({
          type: 'negative',
          message: 'Ошибка при создании',
          position: 'top'
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      filter,
      filteredDeshife,
      createDeshife
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