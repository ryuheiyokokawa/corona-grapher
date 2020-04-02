'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const GraphQLServer = use('GraphQLServer')


Route.on('/').render('index')

Route.post('/', (context) => {
    return GraphQLServer.handle(context)
})

Route.get('/graphs', async ({response}) => {
  response.redirect('/')
})

Route.get('/graphs/:id', async ({response}) => {
  response.redirect('/')
})


//Route.get('/graphiql', (context) => {
//    return GraphQLServer.handleUI(context)
//})
  
// or add options (example)
// Route.get("/graphiql", (context) => {
// return GraphQLServer.handleUI(context, {
//     passHeader: `'Authorization': '${context.request.header("Authorization")}'`
// })
// })
