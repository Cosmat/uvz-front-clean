<template>
  <q-page class="q-pa-md full-width" style="max-width: 1200px; margin: 0 auto;">
    <div class="row q-mb-md items-center">
      <div class="col-auto">
        <h4 class="text-h6 q-mb-none">Дешифратор кодов зарплаты</h4>
        <div class="text-caption text-grey-7">
          Всего кодов: {{ pagination?.total || 0 }}
        </div>
      </div>
      <q-space />
      <div class="col-auto">
        <q-input
          v-model="searchQuery"
          @update:model-value="debouncedSearch"
          placeholder="Поиск по шифру или описанию..."
          dense
          clearable
          style="width: 350px"
          prefix="<q-icon name='search' />"
        />
      </div>
    </div>

    <!-- Category filter -->
    <div v-if="(categories?.length || 0) > 0" class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-md-4">
        <q-select
          v-model="selectedCategory"
          :options="categoryOptions"
          label="Категория"
          dense
          emit-value
          map-options
          option-value="value"
          option-label="label"
          clearable
        />
      </div>
    </div>

    <!-- Table -->
    <div class="q-overflow-auto">
      <q-table
        :rows="deshife || []"
        :columns="columns"
        row-key="shifr"
        :loading="loading"
        :pagination="pagination"
        flat
        bordered
        separator="cell"
        wrap-cells
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-description="props">
          <div class="text-body2">{{ props.value }}</div>
        </template>

        <template v-slot:body-cell-category="props">
          <q-chip :label="props.value" :color="getCategoryColor(props.value)" size="sm" />
        </template>
      </q-table>
    </div>

    <!-- Error toast -->
    <q-toast v-if="error" :message="error" color="negative" position="top" />
  </q-page>
</template>

<script>
import { ref, computed, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useDeshifeStore } from 'stores/deshife'
import { useQuasar } from 'quasar'
import { debounce } from 'quasar'

export default {
  name: 'PageDeshife',
  setup() {
    const $q = useQuasar()
    const deshifeStore = useDeshifeStore()

    // Use storeToRefs for proper reactivity
    const {
      deshife,
      loading,
      error,
      pagination,
      categories
    } = storeToRefs(deshifeStore)

    const searchQuery = ref('')
    const selectedCategory = ref(null)

    const categoryOptions = computed(() => [
      { label: 'Все', value: null },
      ...(categories.value || []).map(c => ({ label: c, value: c }))
    ])

    const columns = [
      { name: 'shifr', label: 'Шифр', field: 'shifr', align: 'center', sortable: true },
      { name: 'description', label: 'Описание', field: 'description', sortable: false },
      { name: 'category', label: 'Категория', field: 'category', align: 'center', sortable: true }
    ]

    const getCategoryColor = (cat) => {
      switch (cat) {
        case 'Начисления': return 'green'
        case 'Удержания': return 'red'
        default: return 'grey'
      }
    }

    const debouncedSearch = debounce(async (value) => {
      await deshifeStore.fetchDeshife({
        search: value || undefined,
        category: selectedCategory.value || undefined,
        page: 1
      })
    }, 300)

    watch(selectedCategory, async (val) => {
      await deshifeStore.fetchDeshife({
        search: searchQuery.value || undefined,
        category: val || undefined,
        page: 1
      })
    })

    onBeforeMount(async () => {
      await deshifeStore.fetchDeshife({ limit: 100 })
      await deshifeStore.fetchCategories()
    })

    watch(() => deshifeStore.error, (err) => {
      if (err) {
        $q.notify({ message: err, color: 'negative', position: 'top' })
      }
    })

    return {
      deshife,
      loading,
      error,
      pagination,
      categories,
      searchQuery,
      selectedCategory,
      categoryOptions,
      columns,
      getCategoryColor
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
.q-table__cell {
  white-space: normal;
  word-break: break-word;
}
</style>