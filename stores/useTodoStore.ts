import { defineStore } from 'pinia';
import { Todo } from '../types/todo';

export const useTodosStore = defineStore('todoStore', {
    state: () => ({
        todos: [] as Todo[],
    }),
    actions: {
        addTodo(todoText: string) {
            const newTodo: Todo = {
                text: todoText,
                isDone: false,
            }
            this.todos.push(newTodo)
        },
        removeTodo(index: number) {
            this.todos.splice(index, 1)
        },
        markAsDone(index: number) {
            this.todos[index].isDone = true;
        },
        markAsUndone(index: number) {
            this.todos[index].isDone = false;
        },

    },
})
