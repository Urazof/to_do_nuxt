<template>
  <v-list class="todo-list">
    <TodoItem
        v-for="(todo, index) in todos"
        :key="index"
        :todo="todo"
        @toggle-done="onToggleDone(todo.id)"
        @remove="onRemove(todo.id)"
    />
  </v-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTodosStore } from '@/stores/useTodoStore';
import TodoItem from './TodoItem.vue';

const todosStore = useTodosStore();
const todos = computed(() => todosStore.todos.todos);

const emit = defineEmits(['toggle-done', 'remove']);

const onToggleDone = (id: string) => {
  emit('toggle-done', id);
};

const onRemove = (id: string) => {
  emit('remove', id);
};
</script>

<style scoped>
.todo-list {
  width: 100%;
  list-style: none;
}
</style>
