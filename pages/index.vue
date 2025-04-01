<template>
  <div class="app">
    <div class="login-bar" >
      <v-btn v-if="authStore.loggedIn" @click="authStore.logout()">Logout</v-btn>
      <template v-else>
        <v-btn to="/login" text>Login</v-btn>
        <v-btn to="/register" text>Register</v-btn>
      </template>
    </div>
    <div class="application-wrapper" :class="{ 'blur-effect': !authStore.loggedIn}">
      <Input @add-todo="addTodo" />
      <TodoList
        @toggle-done="toggleTodo"
        @remove="removeTodo"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import Input from '@/components/Input.vue';
import TodoList from '@/components/TodoList.vue';
import { useTodosStore } from '@/stores/useTodoStore';
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();
const todosStore = useTodosStore();
todosStore.getTodos();

const todos = computed(() => todosStore.todos);

const addTodo = (todo: string) => {
  todosStore.addTodo(todo);
};

const removeTodo = (id: string) => {
  todosStore.removeTodo(id);
};

const toggleTodo = (id: string) => {
  const todo = todos.value.find(todo => todo.id === id);
  if (todo) {
    if (todo.isDone) {
      todosStore.markAsUndone(id);
    } else {
      todosStore.markAsDone(id);
    }
  }
};
</script>

<style scoped>
.app {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
.blur-effect {
  filter: blur(5px); /* Blur intensity */
  transition: filter 0.3s; /* Smooth transition */
}
</style>
