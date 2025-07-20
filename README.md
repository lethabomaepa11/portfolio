# My Portfolio

<img src="https://github.com/lethabomaepa11/lethabomaepa11/blob/main/assets/image.png" style="width: 100%; height: auto;" />

[`View Live Here`](https://lethabomaepa.netlify.app).

# Features

- AI Assistant to guide my visitors about my skills, projects, experiences and services.
- AI can auto redirect you to pages and explain the contents of that page
- PWA, meaning offline access
- Multipages on Desktop url/pathname based routing, single page on mobile hash based routing

# Use this repo as template

Follow this to use this repo as a template.

- Technologies used: Sveltekit, TailwindCss, BitsUI, Brevo, Supabase, Groq
- If you are comfortable with the above listed technologies, you may proceed to read how to use this repo as a template for your portfolio
- Groq models for the AI assistant, you will need to create an account here: [`Groq.com`](https://groq.com/)
- Brevo transactional emails for the contact form, you will also need an account: ['Brevo'](https://brevo.com/)
- I will not provide tutorials on how to get the api keys from groq or brevo.
- Fork this repository
- Open this repository in your code editor of choice, I used vscode
- Create a .env at the root of the project, its contents must be like this
  ```env.example
  PUBLIC_SUPABASE_URL='https://<your supabase project id>.supabase.co'
  PUBLIC_SUPABASE_ANON_KEY='<your supabase api key>'
  GROQ_API_KEY='<your groq api key>'
  BREVO_API_KEY='<your brevo api key>'
  ```
- When you are done, Run

```bash
# installs the dependencies/packages such as nprogress, supabase, marked, bitsUI
npm install

# Run the local server
npm run dev
```

- Then go to [`localhost:5173`](https://localhost:5173).

---

# Setting up your email api

- Go to [`/src/routes/api/contact/message/+server.js`](/src/routes/api/contact/message/%2Bserver.js)

  ```javascript
    //edit your logo to your liking
    const logo = "https://lethabomaepa.netlify.app/coder.png"; // Logo URL
    //replace the email and name with a sender you have set up in your brevo account
    export const POST = async ({request}) => {
    let { data } = await request.json(); //data sent through the api as json
    //data object {email: string, subject: string, message: string}

    // Use the Brevo API
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { email: '<your sender email>', name: '<your sender name>' },
          to: [{ email: data.email }],
          subject: data.subject,
          htmlContent: emailTemplate(data.message, data.name),
        }),
      });
    ... you can edit the emailTemplate to suit your needs.
  ```

  # Setting up the AI assistant

  Head over to [`/src/lib/states.svelte.js`](/src/lib/states.svelte.js)
  Locate the models state

  ```javascript
  export let models = $state({
  	data: [], //you do not have to worry about this, in the root layout, all the models for your groq plan will be populated here.

  	question: '', //this will be the question from the visitor

  	promptMessage: () => {
  		//this will return the prompt sent to the model, containing all the context it needs
  		return `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to
  	 answer the question, You may use your own words, but stick to the context. If you don't know the answer, just 
  	 say that you don't know. Use three sentences maximum and keep the answer concise.You may return markdown\n
  	 ${models.redirectRule()}\n
    	Question: ${models.question}
    	Context: ${JSON.stringify(portfolioContext)}`;
  	},
  	//note that there's a portfolioContext variable here, this will be all the data about your porfolio, must be in an object form, see below.
  	getRandomModel: () => {
  		//returns a random model from the list of models for your plan
  		return models.data[Math.floor(Math.random() * models.data.length)];
  	},

  	redirectRule: () => {
  		//tells the assistant the rule they have to follow to redirect the user, in our code, we will use string manipulation to check for the code to redirect.
  		return `If you wish to navigate the user to a specific page say: "redirect({page})", 
  		replace {page} with any of the pages here [about me, projects, about, skills, experience, services, contact]
  		and note that for a specific project, you can use its slug like so redirect({page/slug})`;
  	},

  	getModel: (index) => {
  		//returns a specific model based on its index
  		if (index >= models.data.length) return null;
  		return models.data[index];
  	}
  });

  //the porfolio context object
  export const portfolioContext = $state({
  	//your portfolio info, it can be in any form, but must be an object, else, make sure that its sent as a string.
  	skills: [],
  	info: null,
  	experience: [],
  	services: []
  });
  ```

  Note that this code is used in the AIChat.svelte component in the custom_components folder in the lib dir
