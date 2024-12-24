import { allSongs } from '@lib/songs'
import type { APIRoute } from 'astro'
export const prerender = false

console.log(`allSongs: ${JSON.stringify(allSongs)}`)

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(JSON.stringify(allSongs))
}
