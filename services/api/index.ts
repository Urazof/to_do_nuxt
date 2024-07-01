import axios from 'axios';
import type { Todo } from '@/types/todo';

export default class Api {
    private static instance: Api;

    url: string;

    constructor(baseUrl: string) {
        this.url = baseUrl;
    }

    public static getInstance(baseUrl: string | undefined = undefined) {
        return Api.instance || (Api.instance = new Api(baseUrl || ''));
    }

    public async createTodo(todo: Todo) {
        try {
            const response = await axios.post(`${this.url}api/todos`, todo);
            return response.data;
        } catch (error) {
            console.error(`Error creating todo: ${error}`);
            throw error;
        }
    }

    public async getTodos() {
        try {
            const response = await axios.get(`${this.url}api/todos`);
            return response.data.todos;
        } catch (error) {
            console.error(`Error getting todos: ${error}`);
            throw error;
        }
    }

    public async updateTodo(id: string, isDone :boolean) {
        try {
            const response = await axios.put(`${this.url}api/todos/${id}`,{isDone});
            return response.data;
        } catch (error) {
            console.error(`Error updating todo: ${error}`);
            throw error;
        }
    }

    public async deleteTodo(id: string) {
        try {
            const response = await axios.delete(`${this.url}api/todos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting todo: ${error}`);
            throw error;
        }
    }

}

export function initApi(controllerLocation: string) {
    Api.getInstance(controllerLocation);
}

export const createTodo = (todo: Todo) => Api.getInstance().createTodo(todo);

export const getTodos = () => Api.getInstance().getTodos();

export const updateTodo = (id: string, isDone: boolean) => Api.getInstance().updateTodo(id, isDone);

export const deleteTodo = (id: string) => Api.getInstance().deleteTodo(id);
