import { useState } from "react";
import type { Ticket } from "../types/ticket";

interface Props {
    onTicketAdded: (ticket: Ticket) => void;
}
function AddTicketForm({ onTicketAdded }: Props) {
    const [title, setTitle] = useState<string>('');
    const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void = async (event) => {
        event.preventDefault();
        const API_URL = import.meta.env.VITE_API_URL;
        try {
            const response = await fetch(`${API_URL}/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });
            const newTicket: Ticket = await response.json();
            onTicketAdded(newTicket);
            setTitle('');

        } catch (error) {
            console.error('Error adding ticket:', error);
        }
    }
    return (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" className="border p-2 rounded w-full" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add Ticket
            </button>
        </form>

    )
}
export default AddTicketForm;