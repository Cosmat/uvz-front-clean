<template>
  <div class="ai-assistant-page">
    <!-- Заголовок -->
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-icon name="smart_toy" size="md" class="q-mr-md" />
      <q-toolbar-title class="text-h5">AI-Помощник</q-toolbar-title>
      <q-space />
      <q-btn
        class="q-mr-lg"
        to="/"
        color="secondary"
        unelevated
        rounded
        icon="home"
        label="На главную"
      />
    </q-toolbar>

    <div class="container">
      <div class="row q-col-gutter-md">
        <!-- Левая панель с подсказками -->
        <div class="col-12 col-md-4">
          <q-card class="suggestions-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="lightbulb" class="q-mr-xs" />
                Популярные вопросы
              </div>

              <div class="q-gutter-sm">
                <q-btn
                  v-for="suggestion in suggestions"
                  :key="suggestion.id"
                  @click="sendSuggestion(suggestion.text)"
                  class="suggestion-btn"
                  flat
                  color="primary"
                  :label="suggestion.text"
                  icon="arrow_forward"
                />
              </div>

              <q-separator class="q-my-md" />

              <div class="text-subtitle2 text-weight-bold q-mb-sm">
                <q-icon name="info" class="q-mr-xs" />
                Что я могу:
              </div>

              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="search" color="primary" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">
                      Найти вакансии по профессии
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="business" color="primary" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">
                      Подсказать информацию о цехах
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="phone" color="primary" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">
                      Найти контакты отделов
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="help" color="primary" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">
                      Объяснить коды оплаты труда
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Правая панель с чатом -->
        <div class="col-12 col-md-8">
          <q-card class="chat-container">
            <q-card-section class="chat-header">
              <div class="text-h6 text-weight-bold">
                <q-icon name="chat" class="q-mr-xs" />
                Чат с AI-помощником
              </div>
              <div class="text-caption text-grey-6">
                Специализированный помощник по трудоустройству в Уралвагонзаводе
              </div>
            </q-card-section>

            <q-separator />

            <!-- Интерфейс чата -->
            <div class="chat-wrapper">
              <!-- Область сообщений -->
              <div class="messages-container">
                <div
                  v-for="message in messages"
                  :key="message.id"
                  :class="['message', message.isBot ? 'bot-message' : 'user-message']"
                >
                  <div class="message-content">
                    <div class="message-avatar">
                      <q-avatar :color="message.isBot ? 'primary' : 'secondary'">
                        <q-icon :name="message.isBot ? 'smart_toy' : 'person'" />
                      </q-avatar>
                    </div>
                    <div class="message-text">
                      <div class="message-bubble">
                        {{ message.text }}
                      </div>
                      <div class="message-time">
                        {{ message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Индикатор загрузки -->
                <div v-if="isLoading" class="message bot-message">
                  <div class="message-content">
                    <div class="message-avatar">
                      <q-avatar color="primary">
                        <q-icon name="smart_toy" />
                      </q-avatar>
                    </div>
                    <div class="message-text">
                      <div class="message-bubble">
                        <q-spinner-dots size="20px" color="primary" />
                        <span class="q-ml-sm">Думаю...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Поле ввода -->
              <div class="input-container">
                <q-input
                  v-model="newMessage"
                  @keypress="handleKeyPress"
                  placeholder="Введите ваш вопрос..."
                  filled
                  class="message-input"
                  :disabled="isLoading"
                >
                  <template v-slot:append>
                    <q-btn
                      @click="sendMessage"
                      :disable="!newMessage.trim() || isLoading"
                      color="primary"
                      icon="send"
                      round
                      dense
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useZayavkaStore } from 'stores/zayavka'
import { useDeshifeStore } from 'stores/deshife'
import { usePhoneStore } from 'stores/phone'

export default {
  name: 'AIAssistant',
  setup() {
    const $q = useQuasar()
    const zayavkaStore = useZayavkaStore()
    const deshifeStore = useDeshifeStore()
    const phoneStore = usePhoneStore()

    // Сообщения чата
    const messages = ref([])
    const newMessage = ref('')
    const isLoading = ref(false)

    // Популярные вопросы
    const suggestions = ref([
      { id: 1, text: 'Покажи все вакансии токаря' },
      { id: 2, text: 'Какой телефон у цеха 850?' },
      { id: 3, text: 'Объясни код оплаты 001' },
      { id: 4, text: 'Есть ли вакансии инженера?' },
      { id: 5, text: 'Какой график работы в цехе 563?' },
      { id: 6, text: 'Покажи вакансии с зарплатой от 50000' }
    ])

    // Инициализация - добавляем приветственное сообщение
    onMounted(() => {
      messages.value.push({
        id: 1,
        text: 'Привет! Я AI-помощник по трудоустройству в Уралвагонзаводе. Могу помочь найти вакансии, объяснить коды оплаты труда, подсказать контакты цехов и ответить на другие вопросы о работе на заводе. Что вас интересует?',
        isBot: true,
        timestamp: new Date()
      })
    })

    // Функция отправки сообщения
    const sendMessage = async () => {
      if (!newMessage.value.trim()) return

      const userMessage = {
        id: Date.now(),
        text: newMessage.value,
        isBot: false,
        timestamp: new Date()
      }

      messages.value.push(userMessage)
      const question = newMessage.value
      newMessage.value = ''
      isLoading.value = true

      try {
        // Простая логика ответов на основе данных в сторах
        await simulateAIResponse(question)
      } catch (error) {
        console.error('Ошибка при отправке сообщения:', error)
        messages.value.push({
          id: Date.now() + 1,
          text: 'Извините, произошла ошибка. Попробуйте еще раз.',
          isBot: true,
          timestamp: new Date()
        })
      } finally {
        isLoading.value = false
      }
    }

    // Симуляция ответа AI (использует данные из Pinia сторов)
    const simulateAIResponse = async (question) => {
      await new Promise(resolve => setTimeout(resolve, 800))

      let response = ''
      const q = question.toLowerCase()

      if (q.includes('токар')) {
        const vacancies = zayavkaStore.activeZayavki.filter(v => v.professia.toLowerCase().includes('токар'))
        if (vacancies.length) {
          response = `Найдено ${vacancies.length} вакансий для токаря:\n` + vacancies.slice(0, 3).map(v => `• Цеха ${v.tzeh}: ${v.professia}, ${v.salary_min ? `от ${v.salary_min}₽` : ''}`).join('\n')
        } else {
          response = 'Вакансий токаря пока нет. Попробуйте проверить позже или расширить поиск.'
        }
      } else if (q.includes('цех 850') || q.includes('850')) {
        const phone = phoneStore.byTzeh['850']
        response = phone 
          ? `Цех 850 — телефон табельной: ${phone.nuber_phone}`
          : 'Цех 850 есть в базе, но телефон не найден.'
      } else if (q.includes('код 001') || q.includes('001')) {
        const code = deshifeStore.deshife.find(d => d.shifr === '001')
        response = code 
          ? `Код 001: ${code.description} (категория: ${code.category})`
          : 'Код 001 не найден в дешифраторе.'
      } else if (q.includes('инженер')) {
        const vacancies = zayavkaStore.activeZayavki.filter(v => v.professia.toLowerCase().includes('инженер'))
        if (vacancies.length) {
          response = `Найдено ${vacancies.length} инженерных вакансий:\n` + vacancies.slice(0, 3).map(v => `• Цеха ${v.tzeh}: ${v.professia}`).join('\n')
        } else {
          response = 'Инженерных вакансий сейчас нет.'
        }
      } else if (q.includes('график') || q.includes('563')) {
        const vacancies = zayavkaStore.activeZayavki.filter(v => v.tzeh === '563')
        const phone = phoneStore.byTzeh['563']
        response = `Цех 563: ${vacancies.length} вакансий. Телефон: ${phone?.nuber_phone || 'не найден'}. График уточняйте по телефону.`
      } else if (q.includes('50000') || q.includes('зарплат')) {
        const vacancies = zayavkaStore.activeZayavki.filter(v => v.salary_min >= 50000)
        response = `Вакансий с зарплатой от 50000₽: ${vacancies.length}. Примеры: ` + vacancies.slice(0, 3).map(v => `${v.professia} (${v.tzeh}) — от ${v.salary_min}₽`).join(', ')
      } else {
        response = 'Я могу помочь с поиском вакансий, информацией о цехах, расшифровкой кодов оплаты труда и контактами подразделений. Попробуйте задать более конкретный вопрос или воспользуйтесь подсказками слева.'
      }

      messages.value.push({
        id: Date.now(),
        text: response,
        isBot: true,
        timestamp: new Date()
      })
    }

    // Функция отправки предложенного вопроса
    const sendSuggestion = (text) => {
      newMessage.value = text
      sendMessage()
    }

    // Функция отправки по Enter
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    }

    return {
      messages,
      newMessage,
      isLoading,
      suggestions,
      sendMessage,
      sendSuggestion,
      handleKeyPress
    }
  }
}
</script>

<style scoped>
.ai-assistant-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.suggestions-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  background: #fff;
  height: fit-content;
  position: sticky;
  top: 24px;
}

.chat-container {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  background: #fff;
  min-height: 600px;
}

.chat-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 500px;
  padding: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
}

.message {
  margin-bottom: 16px;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.user-message .message-content {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.message-text {
  max-width: 70%;
}

.user-message .message-text {
  text-align: right;
}

.message-bubble {
  background: #1976d2;
  color: white;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.4;
}

.bot-message .message-bubble {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
}

.user-message .message-bubble {
  background: #1976d2;
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
  text-align: left;
}

.user-message .message-time {
  text-align: right;
}

.input-container {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background: white;
}

.message-input {
  width: 100%;
}

.suggestion-btn {
  width: 100%;
  justify-content: flex-start;
  text-align: left;
  padding: 8px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  background: rgba(25, 118, 210, 0.08);
  transform: translateX(4px);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .suggestions-card {
    position: static;
    margin-bottom: 16px;
  }

  .chat-container {
    min-height: 400px;
  }

  .chat-wrapper {
    height: 350px;
  }

  .messages-container {
    padding: 8px;
  }

  .input-container {
    padding: 8px;
  }

  .message-text {
    max-width: 85%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 8px;
  }

  .chat-wrapper {
    height: 300px;
  }

  .messages-container {
    padding: 4px;
  }

  .input-container {
    padding: 4px;
  }

  .message-text {
    max-width: 90%;
  }

  .message-bubble {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}
</style>