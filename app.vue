<template>
  <div>
    <!-- Markup shared across all pages, ex: NavBar -->
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from "./stores/useAuthStore";

const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});
</script>
