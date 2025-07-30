<template>
  <div class="auth-container">
    <WarningAlert 
      v-if="errorMessage"
      :message="errorMessage"
      type="error"
    />
    <h1 class="text-h4 text-center mb-8">Login</h1>
    <LoginForm @submit="handleLogin" />
  </div>
</template>

<script setup>
import WarningAlert from '~/components/WarningAlert.vue';

const authStore = useAuthStore();
const errorMessage = ref('');

const handleLogin = async (credentials) => {
  try {
    errorMessage.value = '';
    await authStore.login(credentials);
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
