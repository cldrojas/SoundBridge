import type { APIRoute } from 'astro'
export const prerender = false

const allSongs = [
  { index: 0, title: 'comlpex-desire' },
  { index: 1, title: 'digital-clouds' },
  { index: 2, title: 'sleepy-cat' },
  { index: 3, title: 'yoga-music' }
]

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(JSON.stringify(allSongs))
}
