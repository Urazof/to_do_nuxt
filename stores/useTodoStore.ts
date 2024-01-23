import { defineStore } from 'pinia';
import { Todo } from '../types/todo';
import { createTodo, getTodos, updateTodo, deleteTodo } from "../services/api";

export const useTodosStore = defineStore('todoStore', {
    state: () => ({
        todos: [] as Todo[],
    }),
    actions: {
        async getTodos() {
            this.todos = await getTodos();
        },

        async addTodo(todoText: string) {
            const newTodo: Todo = {
                text: todoText,
                isDone: false,
            }
            this.todos.push(newTodo);
            await createTodo(newTodo);
            await this.getTodos();
        },

        async removeTodo(index: number) {
            this.todos.splice(index, 1);
            await deleteTodo(index);
            await this.getTodos();
        },

        async markAsDone(index: number) {
            this.todos[index].isDone = true;
            await updateTodo(index, true);
            await this.getTodos();
        },

        async markAsUndone(index: number) {
            this.todos[index].isDone = false;
            await updateTodo(index, false);
            await this.getTodos();
        },
    },
})
