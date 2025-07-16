export const load = async ({ locals:{ supabase }, fetch }) => {
    
    const response = await fetch('/api/portfolio');
    const data = await response.json();
    return { data };
}