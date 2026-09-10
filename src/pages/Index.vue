<template>
  <q-page class="q-pa-md" style="max-width: var(--container-max); margin: 0 auto;">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-slide-up">
      <div>
        <h1 class="text-3xl font-bold text-primary" style="line-height: var(--leading-tight);">
          Вакансии УВЗ
        </h1>
        <p class="text-secondary mt-1">
          Найдено: <span class="font-semibold text-primary">{{ pagination?.total || 0 }}</span>
          | Активных: <span class="font-semibold text-secondary">{{ activeCount }}</span>
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <q-input
          v-model="searchQuery"
          @update:model-value="debouncedSearch"
          placeholder="Поиск по профессии, цеху, описанию..."
          dense
          clearable
          style="width: 100%; max-width: 400px;"
          prefix="<q-icon name='search' color='text-tertiary' />"
          class="input-modern"
        />
        <q-btn
          :label="showFilters ? 'Скрыть фильтры' : 'Показать фильтры'"
          @click="showFilters = !showFilters"
          outline
          class="whitespace-nowrap"
        />
      </div>
    </div>

    <!-- Filters Panel -->
    <q-expansion-item
      v-model="showFilters"
      :label="showFilters ? 'Фильтры' : 'Фильтры'"
      :icon="showFilters ? 'expand_less' : 'expand_more'"
      class="mb-6 animate-slide-down"
      dense
    >
      <div class="row q-col-gutter-md q-mt-md" style="max-width: 100%;">
        <div class="col-12 col-md-4">
          <q-select
            v-model="filters.tzeh"
            :options="uniqueTzehs || []"
            label="Цех"
            dense
            emit-value
            map-options
            option-value="value"
            option-label="label"
            clearable
            style="width: 100%"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="filters.schedule"
            :options="scheduleOptions"
            label="График"
            dense
            emit-value
            map-options
            option-value="value"
            option-label="label"
            clearable
            style="width: 100%"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="filters.experience_required"
            :options="experienceOptions"
            label="Опыт"
            dense
            emit-value
            map-options
            option-value="value"
            option-label="label"
            clearable
            style="width: 100%"
          />
        </div>
      </div>
    </q-expansion-item>

    <!-- Loading Skeleton -->
    <div v-if="loading && (!zayavki || zayavki.length === 0)" class="animate-fade-in">
      <div class="row q-col-gutter-md">
        <div v-for="i in 6" :key="i" class="col-12 col-md-6 col-lg-4">
          <div class="card p-5 skeleton-card animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Vacancies Grid -->
    <div v-else-if="zayavki && zayavki.length > 0" class="animate-slide-up">
      <div class="row q-col-gutter-md">
        <VacancyCard
          v-for="item in zayavki"
          :key="item._id || item.id"
          :item="item"
          class="col-12 col-md-6 col-lg-4"
        />
      </div>

      <!-- Pagination -->
      <div v-if="pagination?.pages > 1" class="flex justify-center mt-8 animate-fade-in">
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
      <q-icon name="work_off" size="80px" class="empty-state-icon" />
      <h3 class="empty-state-title">Вакансии не найдены</h3>
      <p class="empty-state-text">Попробуйте изменить фильтры или поиск</p>
      <q-btn
        color="primary"
        label="Сбросить фильтры"
        @click="clearFilters"
        class="mt-4"
      />
    </div>

    <!-- Error Toast -->
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
import { useZayavkaStore } from 'stores/zayavka'
import { useQuasar } from 'quasar'
import { debounce } from 'quasar'
import VacancyCard from 'components/ui/VacancyCard.vue'

export default {
  name: 'PageIndex',
  components: { VacancyCard },
  setup() {
    const $q = useQuasar()
    const zayavkaStore = useZayavkaStore()

    const {
      zayavki,
      loading,
      error,
      pagination,
      filters,
      uniqueTzehs,
      uniqueProfessias,
      activeZayavki
    } = storeToRefs(zayavkaStore)

    const searchQuery = ref('')
    const showFilters = ref(false)

    const activeCount = computed(() => (activeZayavki.value || []).length)

    const scheduleOptions = [
      { label: 'Полный день', value: 'Полный день' },
      { label: 'Сменный график', value: 'Сменный график' },
      { label: 'Гибкий график', value: 'Гибкий график' },
      { label: 'Удаленная работа', value: 'Удаленная работа' },
      { label: 'Не указано', value: 'Не указано' }
    ]

    const experienceOptions = [
      { label: 'Без опыта', value: 'Без опыта' },
      { label: '1-3 года', value: '1-3 года' },
      { label: '3-5 лет', value: '3-5 лет' },
      { label: '5+ лет', value: '5+ лет' },
      { label: 'Не указано', value: 'Не указано' }
    ]

    const debouncedSearch = debounce(async (value) => {
      await zayavkaStore.setFilters({
        search: value || undefined,
        page: 1
      })
    }, 300)

    async function onPageChange(page) {
      await zayavkaStore.fetchZayavki({ ...filters.value, page })
    }

    async function onLimitChange(limit) {
      await zayavkaStore.fetchZayavki({ ...filters.value, limit, page: 1 })
    }

    async function clearFilters() {
      filters.value = {}
      searchQuery.value = ''
      await zayavkaStore.fetchZayavki({})
    }

    onBeforeMount(async () => {
      await zayavkaStore.fetchZayavki()
      await zayavkaStore.fetchStats()
    })

    watch(() => zayavkaStore.error, (err) => {
      if (err) {
        $q.notify({ message: err, color: 'negative', position: 'top' })
        zayavkaStore.clearError()
      }
    })

    return {
      searchQuery,
      showFilters,
      zayavki,
      loading,
      error,
      pagination,
      filters,
      uniqueTzehs,
      uniqueProfessias,
      activeCount,
      scheduleOptions,
      experienceOptions,
      onPageChange,
      onLimitChange,
      clearFilters
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

.input-modern :deep(.q-field__prefix) {
  color: var(--text-tertiary) !important;
}

.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--border-medium);
}

.animate-fade-in { animation: fadeIn var(--transition-normal) ease-out; }
.animate-slide-up { animation: slideUp var(--transition-normal) ease-out; }
.animate-slide-down { animation: slideDown var(--transition-normal) ease-out; }
.animate-pulse { animation: pulse 1.5s ease-in-out infinite; }

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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-card {
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-lg);
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

/* Toast styling */
.toast-modern :deep(.q-toast) {
  background: var(--bg-elevated) !important;
  border: 1px solid var(--border-light) !important;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-lg) !important;
}
</style>