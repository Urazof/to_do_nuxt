export interface Todo {
    title: string;
    id: string;
    isDone: boolean;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TodoCreateDto {
    title: string;
}

export interface TodoUpdateDto {
    title?: string;
    isDone?: boolean;
}
