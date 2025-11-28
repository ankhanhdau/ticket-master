import { useState, useEffect } from "react";
import type { Ticket } from "../types/ticket";
import AddTicketForm from './AddTicketForm';

const getNextStatus = (currentStatus: Ticket['status']): Ticket['status'] => {
    if (currentStatus === 'todo') return 'doing';
    if (currentStatus === 'doing') return 'done';
    return 'done';
}
const Column = ({ title, tickets, onMoveTicket, onDeleteTicket }: { title: string, tickets: Ticket[], onMoveTicket: (id: number, newStatus: Ticket['status']) => void, onDeleteTicket: (id: number) => void }) => {
    return (
        <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-black text-lg font-semibold mb-4">{title}</h2>
            <div className="space-y-2">
                {tickets.map(ticket => <div key={ticket.id} className="bg-white p-2 rounded shadow">
                    <h3 className ="text-black break-words">{ticket.title}</h3>
                    <div className="flex gap-2 mt-2 flex-wrap justify-center">
                        {ticket.status !== 'done' && (<button className="mt-2 bg-green-500 text-white px-2 py-1 rounded" onClick={() => onMoveTicket(ticket.id, getNextStatus(ticket.status))}> Change Status </button>
                        )}
                        <button className="mt-2 bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDeleteTicket(ticket.id)}> Delete </button>
                    </div>
                </div>)}
            </div>
        </div>
    )
};

function TicketBoard() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const handleUpdateTicket = async (id: number, newStatus: Ticket['status']) => {
        const API_URL = import.meta.env.VITE_API_URL;
        try {
            await fetch(`${API_URL}/tickets/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const updatedTicket: Ticket[] = tickets.map(ticket => {
                if (ticket.id === id) {
                    return { ...ticket, status: newStatus };
                }
                return ticket;
            })
            setTickets(updatedTicket);
        } catch (error) {
            console.error('Error updating ticket:', error);

        }
    }

    const handleDeleteTicket = async (id: number) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            await fetch(`${API_URL}/tickets/${id}`, {
                method: 'DELETE'
            });
            const remainingTickets = tickets.filter(ticket => ticket.id !== id);
            setTickets(remainingTickets);
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    }
    useEffect(() => {
        async function fetchTickets() {
            const API_URL = import.meta.env.VITE_API_URL;
            try {
                const response = await fetch(`${API_URL}/tickets`);
                const data: Ticket[] = await response.json();
                setTickets(data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        }
        fetchTickets();

    }, []);
    const todoTickets = tickets.filter(ticket => ticket.status === 'todo');
    const doingTickets = tickets.filter(ticket => ticket.status === 'doing');
    const doneTickets = tickets.filter(ticket => ticket.status === 'done');
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-8">Project Board</h1>
            <AddTicketForm onTicketAdded={(newTicket: Ticket) => setTickets([...tickets, newTicket])} />
            <div className="grid grid-cols-3 gap-6">
                <Column title="To Do" tickets={todoTickets} onMoveTicket={handleUpdateTicket} onDeleteTicket={handleDeleteTicket} />
                <Column title="Doing" tickets={doingTickets} onMoveTicket={handleUpdateTicket} onDeleteTicket={handleDeleteTicket} />
                <Column title="Done" tickets={doneTickets} onMoveTicket={handleUpdateTicket} onDeleteTicket={handleDeleteTicket} />
            </div>
        </div>
    )
}
export default TicketBoard;