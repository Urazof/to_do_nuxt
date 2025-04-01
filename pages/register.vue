<template>
  <div class="auth-container">
    <h1 class="text-h4 text-center mb-8">Register</h1>
    <RegisterForm @submit="handleRegister" />
  </div>
</template>

<script setup>
const authStore = useAuthStore();

const handleRegister = async (credentials) => {
  try {
    await authStore.register(credentials);
  } catch (error) {
    console.error('Registration error:', error.message);
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
