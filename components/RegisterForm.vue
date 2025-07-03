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

      <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
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
          Create Account
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WarningAlert from './WarningAlert.vue'
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const alertType = ref('error')
const isSubmitting = ref(false)

const emit = defineEmits(['submit']);

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    alertType.value = 'error'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    await emit('submit', {
      email: email.value,
      password: password.value
    });
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.'
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
