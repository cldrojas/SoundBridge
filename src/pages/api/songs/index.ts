import type { APIRoute } from 'astro'
export const prerender = false

const allAudioFiles = []

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(JSON.stringify({ message: 'GETTING LIST OF SONGS' }))
}
