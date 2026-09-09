<template>
  <q-page class="flex flex-center">
    <!-- Loading skeleton -->
    <div v-if="loading && (zayavki?.length === 0)" class="full_width" style="height: 100vh">
      <div class="row q-col-gutter-md q-px-md">
        <div v-for="i in 6" :key="i" class="col-12 col-md-6 col-lg-4">
          <q-card class="my-card q-mb-md animate-pulse">
            <q-card-section>
              <q-skeleton-tag type="rect" width="60%" height="24px" />
              <q-skeleton-tag type="rect" width="100%" height="16px" />
              <q-skeleton-tag type="rect" width="80%" height="16px" />
              <q-skeleton-tag type="rect" width="100%" height="16px" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div v-else class="q-pa-md full-width" style="max-width: 1400px; margin: 0 auto;">
      <!-- Header with stats and search -->
      <div class="row q-mb-md items-center">
        <div class="col-auto">
          <h4 class="text-h6 q-mb-none">Вакансии УВЗ</h4>
          <div class="text-caption text-grey-7">
            Найдено: {{ pagination?.total || 0 }} | Активных: {{ activeCount }}
          </div>
        </div>
        <q-space />
        <div class="col-auto">
          <q-input
            v-model="searchQuery"
            @update:model-value="debouncedSearch"
            placeholder="Поиск по профессии, цеху, описанию..."
            dense
            clearable
            style="width: 300px"
            prefix="<q-icon name='search' />"
          />
        </div>
      </div>

      <!-- Filters row -->
      <div class="row q-col-gutter-sm q-mb-md" v-if="showFilters">
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
          />
        </div>
      </div>

      <div class="row q-mb-md">
        <div class="col-auto">
          <q-btn
            :label="showFilters ? 'Скрыть фильтры' : 'Показать фильтры'"
            @click="showFilters = !showFilters"
            outline
            size="sm"
          />
        </div>
        <q-space />
        <div class="col-auto">
          <q-select
            v-model="pagination.limit"
            :options="[10, 20, 50, 100]"
            label="На странице"
            dense
            style="width: 140px"
            @update:model-value="onLimitChange"
          />
        </div>
      </div>

      <!-- Simple list instead of virtual scroll for stability -->
      <div class="row q-col-gutter-md" style="min-height: 400px;">
        <div v-for="item in zayavki" :key="getItemKey(item)" class="col-12 col-md-6 col-lg-4">
          <q-card class="my-card q-mb-md">
            <q-card-section>
              <ZayavkaCard
                :tzeh="item.tzeh"
                :professia="item.professia"
                :description="item.description"
                :date="item.date"
                :id="item._id || item.id"
                :requirements="item.requirements"
                :salary_min="item.salary_min"
                :salary_max="item.salary_max"
                :schedule="item.schedule"
                :experience_required="item.experience_required"
                :contact_name="item.contact_name"
                :contact_phone="item.contact_phone"
                :contact_email="item.contact_email"
                :status="item.status"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination?.pages > 1" class="row q-mt-md justify-center">
        <q-pagination
          v-model="pagination.page"
          :max="pagination.pages"
          :boundary-links="true"
          :boundary-numbers="true"
          @input="onPageChange"
        />
      </div>

      <!-- Empty state -->
      <div v-if="!loading && (!zayavki || zayavki.length === 0)" class="text-center q-pa-xl">
        <q-icon name="work_off" size="64px" class="text-grey-4" />
        <div class="text-h6 q-mt-md">Вакансии не найдены</div>
        <div class="text-grey-7 q-mt-sm">
          Попробуйте изменить фильтры или поиск
        </div>
      </div>
    </div>

    <!-- Error toast -->
    <q-toast v-if="error" :message="error" color="negative" position="top" />
  </q-page>
</template>

<script>
import { ref, computed, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useZayavkaStore } from 'stores/zayavka'
import ZayavkaCard from 'components/ui/Zayavka.vue'
import { debounce } from 'quasar'

export default {
  name: 'PageIndex',
  components: { ZayavkaCard },
  setup() {
    const $q = useQuasar()
    const zayavkaStore = useZayavkaStore()

    // Use storeToRefs for proper reactivity
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

    // Local state
    const searchQuery = ref('')
    const showFilters = ref(false)

    // Computed with defensive checks
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

    const getItemKey = (item) => item._id || item.id || `temp-${Math.random()}`

    // Debounced search
    const debouncedSearch = debounce(async (value) => {
      await zayavkaStore.setFilters({
        search: value || undefined,
        page: 1
      })
    }, 300)

    // Pagination handlers
    async function onPageChange(page) {
      await zayavkaStore.fetchZayavki({ ...filters.value, page })
    }

    async function onLimitChange(limit) {
      await zayavkaStore.fetchZayavki({ ...filters.value, limit, page: 1 })
    }

    // Initial load
    onBeforeMount(async () => {
      await zayavkaStore.fetchZayavki()
      await zayavkaStore.fetchStats()
    })

    // Watch for errors
    watch(() => zayavkaStore.error, (err) => {
      if (err) {
        $q.notify({ message: err, color: 'negative', position: 'top' })
        zayavkaStore.clearError()
      }
    })

    return {
      // Local state
      searchQuery,
      showFilters,
      // Store state (refs)
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
      getItemKey,
      // Methods
      onPageChange,
      onLimitChange
    }
  }
}
</script>

<style scoped>
.full_width {
  display: flex;
  justify-content: center;
  align-items: center;
}
.full-width {
  width: 100%;
}
.my-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;
}
.my-card:hover {
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.15);
  transform: translateY(-2px);
}
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>