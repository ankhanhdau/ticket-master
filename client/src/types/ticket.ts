export interface Ticket {
    id: number;
    title: string;
    status: 'todo' | 'doing' | 'done';
}