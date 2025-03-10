export const handler = async ({locals:{ supabase }}) => {
    try {
        const url = 'https://lethabomaepa.netlify.app/api/getPortfolio';
        const response = await fetch(url, { method: "GET" });
        const res = await response.json();
        //also just call from the supabase api
        const { data, error } = await supabase
            .from('info')
            .select('*');
        if (error) throw new Error(error);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Supabase kept alive successfully" })
      };
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: e.message })
      };
    }
  };