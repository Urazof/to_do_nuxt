import axios from 'axios';
import { Todo } from '../../types/todo';

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
            const response = await axios.post(`${this.url}/api/todos`, todo);
            return response.data;
        } catch (error) {
            console.error(`Error creating todo: ${error}`);
            throw error;
        }
    }

    public async getTodos() {
        try {
            const response = await axios.get(`${this.url}/api/todos`);
            return response.data;
        } catch (error) {
            console.error(`Error getting todos: ${error}`);
            throw error;
        }
    }

    public async updateTodo(index: number, isDone :boolean) {
        try {
            const response = await axios.put(`${this.url}/api/todos/${index}`, isDone);
            return response.data;
        } catch (error) {
            console.error(`Error updating todo: ${error}`);
            throw error;
        }
    }

    public async deleteTodo(index: number) {
        try {
            const response = await axios.delete(`${this.url}/api/todos/${index}`);
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

export const updateTodo = (index: number, isDone: boolean) => Api.getInstance().updateTodo(index, isDone);

export const deleteTodo = (index: number) => Api.getInstance().deleteTodo(index);
