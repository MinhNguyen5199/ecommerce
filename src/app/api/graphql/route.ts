// src/app/api/graphql/route.ts

import { createYoga } from 'graphql-yoga'
import { schema } from '../../../../graphql/schema'
import { cookies } from 'next/headers'

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
})
let handlers;
export async function GET(req:any, res:any){
  const cookieStroke = cookies()
  const cookie = cookieStroke.get('user')
  if(Number(cookie?.value) == 1){
    handlers = {
      GET: handleRequest
    };
    return handlers.GET(req, res);
  }else{
    return new Response('YOU DO NOT HAVE PERMISSION TO ACCESS THIS PAGE', {
      status: 200,
    })
  }
}
export { handleRequest as POST}


