# Corona Virus Grapher
This is a toy project that I'm doing as a way to get used to some advancements in React and to get a better grasp of how crazy this situation is.

Its not entirely pre-architected so there's a lot to be desired, but it works.
That said, if you're curious about how bad Coronavirus is doing in different countries/provinces, this code will let you compare them.


## Packages/Tech used
Backend:
- Adonis (Laravel in Node.js)
- GraphQL Server from Apollo
- SQL of choice (MySQL works, Sqlite probably does too)

Frontend:
- React / React starter kit
- Functional components (getting better at hooks instead of classic life cycle/Redux)
- Apollo Client/Cache
- Victory from Formidable
- Momentjs

## Data Source
John's Hopkin's Github: https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series

## How to run it.
1. `npm install` in both the `api` and `client` directories
2. `npm i -g @adonisjs/cli` to install the adonis client
3. Go into the api directory and run: `adonis migration:run`
4. Make sure to look at the `env.example` file in the api dir and make your own version as `.env` inside of the `api` dir.  (I have this working with MySQL, but it should work out of the box with sqlite if you're not in a position to standup a real SQL server.) If the configs aren't exactly working for you, checkout the Adonis js docs: https://adonisjs.com/
5. Run `adonis process`  This downloads the covid data and puts it into your SQL DB of choice.
6. `npm start` in both places using two terminal windows
7. The client portion should just open a window for you.
8. Mess around with it.

## Is there an online demo?
Should I put one up? Let me know.

## Frontend crashes a lot
Yup, I haven't had time to add in validation.  I'm working on it.
No tests either.  I'm probably going to re-write the input code.

