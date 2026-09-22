<template>
  <q-page class="page-wrap">
    <!-- Hero header -->
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1 class="hero-title">Дешифратор кодов зарплаты</h1>
          <p class="hero-sub">
            Расшифровка кодов видов оплат ·
            <span class="hero-count">{{ pagination?.total || 0 }}</span> кодов
          </p>
        </div>
      </div>
    </div>

    <!-- Search toolbar (always visible) -->
    <div class="toolbar">
      <q-input
        v-model="searchQuery"
        @update:model-value="debouncedSearch"
        placeholder="Код или описание…"
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
        v-if="(categories?.length || 0) > 0"
        v-model="selectedCategory"
        :options="categoryOptions"
        label="Категория"
        dense
        outlined
        emit-value
        map-options
        option-value="value"
        option-label="label"
        clearable
        class="toolbar-select"
        @update:model-value="onCategoryChange"
      />

      <q-btn
        v-if="selectedCategory || searchQuery"
        flat
        dense
        label="Сбросить"
        icon="restart_alt"
        class="toolbar-reset"
        @click="clearAll"
      />
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading && (deshife?.length === 0)" class="table-card">
      <div v-for="i in 10" :key="'sk' + i" class="sk-row">
        <div class="sk-line" style="width: 60px"></div>
        <div class="sk-line" style="flex: 1"></div>
      </div>
    </div>

    <!-- Table -->
    <div v-else-if="deshife && deshife.length > 0" class="table-card">
      <table class="desh-table">
        <thead>
          <tr>
            <th class="col-shifr">Код</th>
            <th>Описание</th>
            <th v-if="hasCategory" class="col-cat">Категория</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in deshife"
            :key="item.shifr"
            class="desh-row"
            @click="copyShifr(item.shifr)"
          >
            <td class="col-shifr">
              <code class="shifr-code">{{ item.shifr }}</code>
            </td>
            <td class="col-desc">{{ item.description }}</td>
            <td v-if="hasCategory" class="col-cat">
              <span class="cat-chip">{{ item.category }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <i class="fas fa-font empty-icon"></i>
      <h3>Коды не найдены</h3>
      <p>Попробуйте изменить поисковый запрос</p>
      <q-btn unelevated rounded color="primary" label="Сбросить" @click="clearAll" />
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

    <!-- Copy toast -->
    <q-toast v-if="copiedShifr" :message="'Код ' + copiedShifr + ' скопирован'" color="positive" position="top" />
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

    const hasCategory = computed(() =>
      (deshife.value || []).some(d => d.category)
    )

    const categoryOptions = computed(() => [
      { label: 'Все', value: null },
      ...(categories.value || []).map(c => ({ label: c, value: c }))
    ])

    const debouncedSearch = debounce(async (value) => {
      await deshifeStore.fetchDeshife({
        search: value || undefined,
        category: selectedCategory.value || undefined,
        page: 1
      })
    }, 300)

    async function onCategoryChange() {
      await deshifeStore.fetchDeshife({
        search: searchQuery.value || undefined,
        category: selectedCategory.value || undefined,
        page: 1
      })
    }

    async function onPageChange(page) {
      await deshifeStore.fetchDeshife({
        search: searchQuery.value || undefined,
        category: selectedCategory.value || undefined,
        page
      })
    }

    async function clearAll() {
      selectedCategory.value = null
      searchQuery.value = ''
      await deshifeStore.fetchDeshife({ page: 1 })
    }

    async function copyShifr(shifr) {
      if (!shifr) return
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
      hasCategory,
      onCategoryChange,
      onPageChange,
      clearAll
    }
  }
}
</script>

<style scoped>
.page-wrap {
  max-width: 1000px;
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
  max-width: 968px;
  margin: 0 auto;
}

.hero-title {
  margin: 0 0 6px;
  font-size: 26px;
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
  flex: 1 1 260px;
}

.toolbar-select {
  flex: 0 1 180px;
  min-width: 150px;
}

.toolbar-icon {
  color: #94a3b8;
}

.toolbar-reset {
  color: #64748b;
  white-space: nowrap;
}

/* Table card */
.table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 16px;
}

.desh-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.desh-table th,
.desh-table td {
  padding: 11px 16px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.desh-table th {
  font-weight: 700;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  background: #f8fafc;
}

.desh-row {
  cursor: pointer;
  transition: background 0.12s ease;
}

.desh-row:hover {
  background: #f4f7fd;
}

.desh-row:last-child td {
  border-bottom: none;
}

.col-shifr {
  width: 90px;
}

.shifr-code {
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 13.5px;
  font-weight: 700;
  color: #1d4ed8;
  background: #eff6ff;
  border-radius: 6px;
  padding: 3px 9px;
}

.col-desc {
  color: #334155;
  line-height: 1.5;
}

.col-cat {
  width: 130px;
}

.cat-chip {
  font-size: 11.5px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 3px 10px;
  white-space: nowrap;
}

/* Skeleton */
.sk-row {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
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