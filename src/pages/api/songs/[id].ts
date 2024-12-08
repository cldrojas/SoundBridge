import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  const id = params.id
  return new Response(JSON.stringify({ message: `GETTING SONG ${id}` }))
}
