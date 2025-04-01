<template>
  <div class="text-center py-8">
    <h1 class="text-h4 mb-8">Welcome to Todo App</h1>
    <div class="auth-links">
      <NuxtLink 
        to="/login"
        class="text-primary text-decoration-none"
      >
        Login
      </NuxtLink>
      <span class="mx-2">|</span>
      <NuxtLink 
        to="/register"
        class="text-secondary text-decoration-none"
      >
        Register
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.auth-links {
  font-size: 1.2rem;
}
</style>
