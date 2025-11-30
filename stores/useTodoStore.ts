import { defineStore } from 'pinia';
import type { Todo } from '@/types/todo';
import { createTodo, getTodos, updateTodo, deleteTodo } from "@/services/api";
import { generateUID } from "@/helpers/uuid";
import { useAuthStore } from '@/stores/useAuthStore';

export const useTodosStore = defineStore('todoStore', {
    state: () => ({
        todos: [] as Todo[],
        error: null as string | null,
        loading: false,
    }),
    actions: {
        async getTodos() {
            const authStore = useAuthStore();
            if (!authStore.user) return;

            this.loading = true;
            this.error = null;

            try {
                this.todos = await getTodos();
            } catch (error: any) {
                const message = error.response?.data?.message ||
                               error.message ||
                               'Failed to load todos';
                this.error = message;
                console.error('Failed to load todos:', error);
            } finally {
                this.loading = false;
            }
        },

        async addTodo(todoText: string) {
            const authStore = useAuthStore();
            if (!authStore.user) return;

            this.error = null;

            try {
                const newTodo: Todo = {
                    title: todoText,
                    id: generateUID(),
                    isDone: false
                }
                await createTodo(newTodo);
                await this.getTodos();
            } catch (error: any) {
                const message = error.response?.data?.message ||
                               error.message ||
                               'Failed to create todo';
                this.error = message;
                console.error('Failed to create todo:', error);
                throw error; // Пробрасываем для UI обработки
            }
        },

        async removeTodo(id: string) {
            this.error = null;

            try {
                await deleteTodo(id);
                await this.getTodos();
            } catch (error: any) {
                const message = error.response?.data?.message ||
                               error.message ||
                               'Failed to delete todo';
                this.error = message;
                console.error('Failed to delete todo:', error);
                throw error;
            }
        },

        async markAsDone(id: string) {
            this.error = null;

            try {
                await updateTodo(id, true);
                await this.getTodos();
            } catch (error: any) {
                const message = error.response?.data?.message ||
                               error.message ||
                               'Failed to update todo';
                this.error = message;
                console.error('Failed to update todo:', error);
                throw error;
            }
        },

        async markAsUndone(id: string) {
            this.error = null;

            try {
                await updateTodo(id, false);
                await this.getTodos();
            } catch (error: any) {
                const message = error.response?.data?.message ||
                               error.message ||
                               'Failed to update todo';
                this.error = message;
                console.error('Failed to update todo:', error);
                throw error;
            }
        },
    },
})
