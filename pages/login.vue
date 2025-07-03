<template>
  <div class="auth-container">
    <h1 class="text-h4 text-center mb-8">Login</h1>
    <LoginForm @submit="handleLogin" :error="authStore.error" />
  </div>
</template>

<script setup>
const authStore = useAuthStore();

const handleLogin = async (credentials) => {
  try {
    await authStore.login(credentials);
  } catch (error) {
    console.error('Login error:', error.message);
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
