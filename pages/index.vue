<template>
  <div class="app">
    <Input @add-todo="addTodo" />
    <TodoList
        @toggle-done="toggleTodo"
        @remove="removeTodo"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Input from '../components/Input.vue';
import TodoList from '../components/TodoList.vue';
import { useTodosStore } from '../stores/useTodoStore';

const todosStore = useTodosStore();
todosStore.getTodos();

const todos = computed(() => todosStore.todos.todos);

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
</style>
