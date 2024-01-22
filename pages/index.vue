<template>
  <div class="app">
    <div class="input-group">
      <v-text-field class="input" hide-details v-model="newTodo" @keyup.enter="addTodo" placeholder="Add new todo"></v-text-field>
      <v-btn class="add-button" small @click="addTodo">Add</v-btn>
    </div>
    <v-list class="todo-list">
      <v-list-item class="todo-item" v-for="(todo, index) in todos" :key="index">
        <v-row no-gutters>
          <v-col cols="7">
            <v-list-item-content>
              <span :class="{ 'done': todo.isDone }">{{ todo.text }}</span>
            </v-list-item-content>
          </v-col>
          <v-col cols="5" class="text-right">
            <v-list-item-action class="buttons">
              <v-btn class="done-button" small @click="todo.isDone ? markAsUndone(index) : markAsDone(index)" :color="todo.isDone ? 'grey' : 'success'">
                {{ todo.isDone ? 'Undone' : 'Done' }}
              </v-btn>
              <v-btn small @click="removeTodo(index)" >Remove</v-btn>
            </v-list-item-action>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodosStore } from '../stores/useTodoStore'
import  TodoItem  from '../components/TodoItem.vue'

const newTodo = ref('')
const todosStore = useTodosStore()
const todos = todosStore.todos

const addTodo = () => {
  todosStore.addTodo(newTodo.value)
  newTodo.value = ''
}
const removeTodo = (index: number) => {
  todosStore.removeTodo(index)
}

const markAsDone = (index: number) => {
  todosStore.markAsDone(index)
}

const markAsUndone = (index: number) => {
  todosStore.markAsUndone(index)
}
</script>

<style scoped>
.app {
  width: 100%;
  max-width: 600px;
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

.todo-item {
  background: #f9f9f9;
  margin-bottom: 3px;
  border-radius: 4px;
}

.done {
  text-decoration: line-through;
}

.buttons{
  display: flex;
  justify-content: end;
}

.done-button{
  margin-right: 5px;
}

.text-right {
  text-align: right;
}
</style>
