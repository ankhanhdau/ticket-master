import { useState, useEffect } from 'react';
import type { User } from '../types/user';

function UserProfile() {
    const [users, setUser] = useState<User[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await fetch(`${API_URL}/users`);
                const data: User[] = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
                {users.map(user => (
                    <div key={user.id} className="mb-2">
                        {user.name}
                    </div>
                ))}

        </div>
    )
};
export default UserProfile;