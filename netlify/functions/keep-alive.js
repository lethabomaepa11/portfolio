export const handler = async (req) => {
    const { next_run } = await req.json()
    try {
        const url = 'https://lethabomaepa.netlify.app/api/getPortfolio';

        const response = await fetch(url);
        const res = await response.json();
        if (!res.success) throw new Error("Keep-alive failed");
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Supabase kept alive successfully" })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };