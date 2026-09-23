<template>
  <q-page class="page-wrap">
    <!-- Hero header -->
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1 class="hero-title">Работа на УВЗ</h1>
          <p class="hero-sub">
            Актуальные вакансии Уралвагонзавода ·
            <span class="hero-count">{{ pagination?.total || 0 }}</span> предложений
          </p>
        </div>
      </div>
    </div>

    <!-- Search + filters toolbar (always visible) -->
    <div class="toolbar">
      <q-input
        v-model="searchQuery"
        @update:model-value="debouncedSearch"
        placeholder="Начните вводить профессию…"
        dense
        clearable
        outlined
        class="toolbar-search"
      >
        <template v-slot:prepend>
          <q-icon name="search" class="toolbar-icon" />
        </template>
      </q-input>

      <q-select
        v-model="filters.tzeh"
        :options="uniqueTzehs || []"
        label="Цех"
        dense
        outlined
        clearable
        class="toolbar-select"
        @update:model-value="onFilterChange"
      />

      <q-select
        v-model="filters.schedule"
        :options="scheduleOptions"
        label="График"
        dense
        outlined
        emit-value
        map-options
        option-value="value"
        option-label="label"
        clearable
        class="toolbar-select"
        @update:model-value="onFilterChange"
      />

      <q-select
        v-model="filters.experience_required"
        :options="experienceOptions"
        label="Опыт"
        dense
        outlined
        emit-value
        map-options
        option-value="value"
        option-label="label"
        clearable
        class="toolbar-select"
        @update:model-value="onFilterChange"
      />

      <q-btn
        v-if="hasActiveFilters"
        flat
        dense
        label="Сбросить"
        icon="restart_alt"
        class="toolbar-reset"
        @click="clearFilters"
      />
    </div>

    <!-- Result summary -->
    <div class="result-line">
      <span>Найдено: <b>{{ pagination?.total || 0 }}</b></span>
      <span class="dot">·</span>
      <span>Активных: <b>{{ activeCount }}</b></span>
      <span v-if="loading" class="loading-note">загрузка…</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading && (zayavki?.length === 0)" class="card-grid">
      <div v-for="i in 6" :key="'sk' + i" class="skeleton-card">
        <div class="sk-line" style="width: 40%"></div>
        <div class="sk-line" style="width: 70%; height: 22px"></div>
        <div class="sk-line" style="width: 35%"></div>
        <div class="sk-line" style="width: 95%"></div>
        <div class="sk-line" style="width: 85%"></div>
      </div>
    </div>

    <!-- Vacancies grid -->
    <div v-else-if="zayavki && zayavki.length > 0" class="card-grid">
      <VacancyCard
        v-for="item in zayavki"
        :key="item._id || item.id"
        :item="item"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <i class="fas fa-briefcase empty-icon"></i>
      <h3>Вакансии не найдены</h3>
      <p>Попробуйте изменить фильтры или поисковый запрос</p>
      <q-btn unelevated rounded color="primary" label="Сбросить фильтры" @click="clearFilters" />
    </div>

    <!-- Pagination -->
    <div v-if="pagination?.pages > 1 && !loading" class="pagination-wrap">
      <q-pagination
        v-model="pagination.page"
        :max="pagination.pages"
        :boundary-links="true"
        :boundary-numbers="true"
        @input="onPageChange"
        color="primary"
        rounded
      />
    </div>
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

    const activeCount = computed(() => (activeZayavki.value || []).length)

    const hasActiveFilters = computed(() => {
      const f = filters.value || {}
      return !!(f.tzeh || f.schedule || f.experience_required || f.professia)
    })

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
      // Search matches ONLY profession name, reactively as user types
      filters.value = {
        ...filters.value,
        professia: value || undefined,
        page: 1
      }
      await zayavkaStore.fetchZayavki(filters.value)
    }, 200)

    async function onFilterChange() {
      await zayavkaStore.fetchZayavki({ ...filters.value, page: 1 })
    }

    async function onPageChange(page) {
      await zayavkaStore.fetchZayavki({ ...filters.value, page })
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
      zayavki,
      loading,
      error,
      pagination,
      filters,
      uniqueTzehs,
      uniqueProfessias,
      activeCount,
      hasActiveFilters,
      scheduleOptions,
      experienceOptions,
      debouncedSearch,
      onFilterChange,
      onPageChange,
      clearFilters
    }
  }
}
</script>

<style scoped>
.page-wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  margin: 0 -16px;
  padding: 36px 16px 32px;
}

.hero-inner {
  max-width: 1208px;
  margin: 0 auto;
}

.hero-title {
  margin: 0 0 6px;
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.hero-sub {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.hero-count {
  font-weight: 700;
  color: #ffffff;
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  margin-top: -22px;
  position: relative;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
}

.toolbar-search {
  flex: 1 1 280px;
}

.toolbar-select {
  flex: 0 1 160px;
  min-width: 140px;
}

.toolbar-icon {
  color: #94a3b8;
}

.toolbar-reset {
  color: #64748b;
  white-space: nowrap;
}

/* Result line */
.result-line {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 4px 12px;
  font-size: 13.5px;
  color: #64748b;
}

.result-line b {
  color: #0f172a;
}

.dot {
  color: #cbd5e1;
}

.loading-note {
  color: #94a3b8;
  font-style: italic;
}

/* Card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}

/* Skeleton */
.skeleton-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sk-line {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 64px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 14px;
  display: block;
}

.empty-state h3 {
  margin: 0 0 6px;
  font-size: 18px;
  color: #0f172a;
}

.empty-state p {
  margin: 0 0 18px;
  font-size: 14px;
}

/* Pagination */
.pagination-wrap {
  display: flex;
  justify-content: center;
  padding: 28px 0 8px;
}
</style>