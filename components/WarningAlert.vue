<template>
  <div 
    v-if="visible"
    class="warning-alert"
    :class="[typeClass, { 'with-button': showButton }]"
    :style="{ top: `${position.top}px`, left: `${position.left}px` }"
  >
    <div class="alert-content">
      <span class="alert-message">{{ message }}</span>
      <button v-if="showButton" class="dismiss-button" @click="dismiss">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'error' }, // 'error', 'warning', 'success'
  timeout: { type: Number, default: 5000 }, // milliseconds
  position: { type: Object, default: () => ({ top: 20, left: '50%' }) },
  showButton: { type: Boolean, default: true }
})

const emit = defineEmits(['dismissed'])

const visible = ref(true)
const timer = ref<NodeJS.Timeout | null>(null)

const typeClass = ref('')
switch (props.type) {
  case 'success':
    typeClass.value = 'success'
    break
  case 'warning':
    typeClass.value = 'warning'
    break
  default:
    typeClass.value = 'error'
}

const dismiss = () => {
  visible.value = false
  emit('dismissed')
}

onMounted(() => {
  if (props.timeout > 0) {
    timer.value = setTimeout(() => {
      dismiss()
    }, props.timeout)
  }
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearTimeout(timer.value)
  }
})
</script>

<style scoped>
.warning-alert {
  position: fixed;
  z-index: 1000;
  transform: translateX(-50%);
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  transition: opacity 0.3s ease;
}

.alert-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alert-message {
  flex-grow: 1;
}

.dismiss-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 15px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.dismiss-button:hover {
  opacity: 1;
}

.error {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  color: #b71c1c;
}

.warning {
  background-color: #fff8e1;
  border-left: 4px solid #ffc107;
  color: #7d6608;
}

.success {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  color: #2e7d32;
}
</style>
