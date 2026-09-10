<template>
  <q-page class="q-pa-md" style="max-width: var(--container-max); margin: 0 auto;">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-slide-up">
      <div>
        <h1 class="text-3xl font-bold text-primary" style="line-height: var(--leading-tight);">
          Дешифратор кодов зарплаты
        </h1>
        <p class="text-secondary mt-1">
          Всего кодов: <span class="font-semibold text-primary">{{ pagination?.total || 0 }}</span>
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <q-input
          v-model="searchQuery"
          @update:model-value="debouncedSearch"
          placeholder="Поиск по шифру или описанию..."
          dense
          clearable
          style="width: 100%; max-width: 400px;"
          prefix="<q-icon name='search' color='text-tertiary' />"
          class="input-modern"
        />
      </div>
    </div>

    <!-- Category Filter -->
    <div v-if="(categories?.length || 0) > 0" class="mb-6 animate-slide-down">
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
        style="width: 100%; max-width: 300px;"
        class="input-modern"
      />
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && (!deshife || deshife.length === 0)" class="animate-fade-in">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Шифр</th>
              <th>Описание</th>
              <th>Категория</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 8" :key="i">
              <td><div class="skeleton skeleton-text short" style="width: 80px; height: 16px;" /></td>
              <td><div class="skeleton skeleton-text" style="height: 16px;" /></td>
              <td><div class="skeleton skeleton-text short" style="width: 100px; height: 16px;" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else-if="deshife && deshife.length > 0" class="animate-slide-up">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 120px;">Шифр</th>
              <th>Описание</th>
              <th style="width: 180px;">Категория</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in deshife" :key="item.shifr" @click="copyShifr(item.shifr)" class="cursor-pointer hover-row">
              <td>
                <code class="font-mono text-primary font-semibold">{{ item.shifr }}</code>
              </td>
              <td class="text-secondary max-w-xl truncate">{{ item.description }}</td>
              <td>
                <q-badge
                  :label="item.category"
                  :color="getCategoryColor(item.category)"
                  size="sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination?.pages > 1" class="flex justify-center mt-6 animate-fade-in">
        <q-pagination
          v-model="pagination.page"
          :max="pagination.pages"
          :boundary-links="true"
          :boundary-numbers="true"
          @input="onPageChange"
          color="primary"
          class="w-auto"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state animate-fade-in">
      <q-icon name="font_download" size="80px" class="empty-state-icon" />
      <h3 class="empty-state-title">Коды не найдены</h3>
      <p class="empty-state-text">Попробуйте изменить поиск или категорию</p>
    </div>

    <!-- Toast -->
    <q-toast
      v-if="copiedShifr"
      :message="'Шифр ' + copiedShifr + ' скопирован'"
      color="positive"
      position="top"
      class="toast-modern"
    />

    <q-toast
      v-if="error"
      :message="error"
      color="negative"
      position="top"
      class="toast-modern"
    />
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

    const {
      deshife,
      loading,
      error,
      pagination,
      categories
    } = storeToRefs(deshifeStore)

    const searchQuery = ref('')
    const selectedCategory = ref(null)
    const copiedShifr = ref(null)

    const categoryOptions = computed(() => [
      { label: 'Все категории', value: null },
      ...(categories.value || []).map(c => ({ label: c, value: c }))
    ])

    const getCategoryColor = (cat) => {
      switch (cat) {
        case 'Начисления': return 'secondary'
        case 'Удержания': return 'danger'
        default: return 'primary'
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

    async function onPageChange(page) {
      await deshifeStore.fetchDeshife({
        search: searchQuery.value || undefined,
        category: selectedCategory.value || undefined,
        page
      })
    }

    async function copyShifr(shifr) {
      try {
        await navigator.clipboard.writeText(shifr)
        copiedShifr.value = shifr
        setTimeout(() => { copiedShifr.value = null }, 2000)
      } catch (e) {
        $q.notify({ message: 'Не удалось скопировать', color: 'negative', position: 'top' })
      }
    }

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
      searchQuery,
      selectedCategory,
      categoryOptions,
      deshife,
      loading,
      error,
      pagination,
      categories,
      copiedShifr,
      getCategoryColor,
      onPageChange
    }
  }
}
</script>

<style scoped>
.input-modern :deep(.q-input__inner) {
  background: var(--bg-elevated) !important;
  border: 1px solid var(--border-light) !important;
  border-radius: var(--radius-md) !important;
  color: var(--text-primary) !important;
}

.input-modern :deep(.q-input__inner:focus) {
  border-color: var(--border-focus) !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
}

.table-container {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.table th,
.table td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}

.table th {
  font-weight: var(--font-semibold);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  background: var(--bg-secondary);
  white-space: nowrap;
}

.table tbody tr {
  transition: background var(--transition-fast);
}

.hover-row:hover {
  background: var(--bg-tertiary) !important;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.animate-fade-in { animation: fadeIn var(--transition-normal) ease-out; }
.animate-slide-up { animation: slideUp var(--transition-normal) ease-out; }
.animate-slide-down { animation: slideDown var(--transition-normal) ease-out; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.table-container {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.table th,
.table td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}

.table th {
  font-weight: var(--font-semibold);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  background: var(--bg-secondary);
  white-space: nowrap;
}

.table tbody tr {
  transition: background var(--transition-fast);
}

.hover-row:hover {
  background: var(--bg-tertiary) !important;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.animate-fade-in { animation: fadeIn var(--transition-normal) ease-out; }
.animate-slide-up { animation: slideUp var(--transition-normal) ease-out; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
  color: var(--text-secondary);
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  margin-bottom: var(--space-4);
  color: var(--color-neutral-300);
}

[data-theme="dark"] .empty-state-icon {
  color: var(--color-neutral-600);
}

.empty-state-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-text {
  font-size: var(--text-base);
  max-width: 300px;
}
</style>