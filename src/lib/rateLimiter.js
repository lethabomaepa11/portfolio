const store = new Map();

export function rateLimit(ip, { requests, windowMinutes }) {
    const current = store.get(ip) || { count: 0, expires: 0 };
    
    if (Date.now() > current.expires) {
        store.set(ip, { 
            count: 1, 
            expires: Date.now() + (windowMinutes * 60 * 1000)
        });
        return true;
    }
    
    if (current.count >= requests) return false;
    
    current.count++;
    store.set(ip, current);
    return true;
}