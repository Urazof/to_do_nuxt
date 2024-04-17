<template>
  <div class="app">
    <div class="input-group">
      <v-text-field class="input" hide-details v-model="newTodo" @keyup.enter="addTodo" placeholder="Add new todo"></v-text-field>
      <v-btn class="add-button" small @click="addTodo">Add</v-btn>
    </div>
    <v-list class="todo-list" v-if="todos.length">
      <TodoItem
          v-for="(todo, index) in todos"
          :key="index"
          :todo="todo"
          @toggleDone="todo.isDone ? markAsUndone(id) : markAsDone(id)"
          @remove="removeTodo(id)"
      />
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import  TodoItem  from '../components/TodoItem.vue'
import { useTodosStore } from '../stores/useTodoStore'

const todosStore = useTodosStore()
const todos = computed(() => todosStore.todos);
const newTodo = ref('')

todosStore.getTodos();

const addTodo = () => {
  todosStore.addTodo(newTodo.value)
  newTodo.value = ''
}
const removeTodo = (id: string) => {
  todosStore.removeTodo(id)
}

const markAsDone = (id: string) => {
  todosStore.markAsDone(id)
}

const markAsUndone = (id: string) => {
  todosStore.markAsUndone(id)
}
</script>

<style scoped>
.app {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.input-group {
  position: relative;
  display: flex;
}

.add-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.todo-list {
  width: 100%;
  list-style: none;
}
</style>
