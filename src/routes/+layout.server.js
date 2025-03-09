export const load = async ({ locals:{ supabase }, fetch }) => {
    //call the /api/getPortfolio api
    const response = await fetch('/api/getPortfolio');
    const data = await response.json();
    return { data };
}