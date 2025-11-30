/**
 * Middleware для защиты страниц, требующих аутентификации
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Если пытаемся попасть на /todos без авторизации
  if (to.path === '/todos' && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Если авторизованы и пытаемся попасть на login/register
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    return navigateTo('/todos')
  }
})

