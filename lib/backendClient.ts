const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function fetchBackend<T>(path: string, options?: RequestInit): Promise<T | null> {
    try {
        const url = `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
        // console.log(`Backend Request: ${url}`);

        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!res.ok) {
            console.warn(`Backend Fetch Failed [${res.status}]: ${url}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        // console.error(`Backend Connection Error: ${(error as Error).message}`);
        return null; // Return null to trigger fallbacks in the caller
    }
}
