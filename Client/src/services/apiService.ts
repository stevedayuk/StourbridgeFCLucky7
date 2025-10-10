import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiService {
    private static async getAuthHeaders(): Promise<HeadersInit> {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Get the current ID token (Firebase handles refresh automatically)
        const token = await user.getIdToken();

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    static async get<T>(endpoint: string): Promise<T> {
        const headers = await this.getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    }

    static async post<T>(endpoint: string, data: any): Promise<T> {
        const headers = await this.getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    }

    static async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Get the auth token
        const token = await user.getIdToken();

        // Don't set Content-Type header - let the browser set it with boundary
        const headers: HeadersInit = {
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    }

    static async put<T>(endpoint: string, data: any): Promise<T> {
        const headers = await this.getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    }

    static async delete<T>(endpoint: string): Promise<T> {
        const headers = await this.getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    }
}