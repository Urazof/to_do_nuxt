<template>
  <div>
    <WarningAlert
      v-if="errorMessage"
      :message="errorMessage"
      :type="alertType"
      :position="{ top: 20, left: '50%' }"
      @dismissed="clearError"
    />
    
    <v-form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        :rules="[v => /.+@.+\..+/.test(v) || 'Valid email required']"
        required
        outlined
        class="mb-4"
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        :rules="[v => v.length >= 3 || 'Min 3 characters']"
        required
        outlined
        class="mb-4"
      ></v-text-field>

      <div class="button-container">
        <v-btn
          class="equal-btn"
          color="secondary"
          variant="flat"
          @click="navigateTo('/')"
        >
          Back
        </v-btn>
        <v-btn
          class="equal-btn"
          type="submit"
          color="primary"
          variant="flat"
          :loading="isSubmitting"
        >
          Sign In
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import WarningAlert from './WarningAlert.vue'

const props = defineProps({
  error: { type: String, default: '' }
})

const emit = defineEmits(['submit']);

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const alertType = ref('error')
const isSubmitting = ref(false)

watch(() => props.error, (newError) => {
  if (newError) {
    errorMessage.value = newError
    alertType.value = 'error'
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    await emit('submit', {
      email: email.value,
      password: password.value
    });
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
    alertType.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const clearError = () => {
  errorMessage.value = ''
}
</script>
<style scoped>
.button-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.equal-btn {
  flex: 1;
}
</style>
