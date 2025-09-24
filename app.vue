<template>
  <div>
    <!-- Markup shared across all pages, ex: NavBar -->
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
import { initApi } from "./services/api";
import { useAuthStore } from "./stores/useAuthStore";

initApi('http://localhost:3000/');

const authStore = useAuthStore();
onMounted(() => {
  authStore.initialize();
});
</script>
