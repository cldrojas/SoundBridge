// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQDB0VtdBSgi1TRwOiqE_n5J6H4iEyxcZCamjC_d8ZjvRvVe0_8cvZ8rt4WAohcsx2jCxP51xCA5POavMZrGCDnSNrFGAgZ6nz6e95OXhENiWLFlC243KeaQ5sszJyK-ZaZ3ucyOsRo5CtiGitDUehUbmbeKW1qxzYKoRNgzctmFkZECPGvxBZswejaub3hjTKK2_cJxVDTvPk97_aPOt3YBNgiAFi4-RPCNafGG79Hezh0wmiR5zHeVV2sLiJ0NXX5t3n5xSoWSPi9ooDiV_hUlO6Y9Wcw0';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

const topTracksIds = [
  '6k6Fm0n1jI1A6OFbMFMW2G','1jR0UA2MT5KCtB2wAK3Omj','5NwSA0Br6Y1fvKKFxBx0Mh','4u2cpX7EWWTtQNB7qLiYdE','2uFOGFTmoh2eZRUKf9l2vF'
];

async function getRecommendations(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (await fetchWebApi(
    `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
  )).tracks;
}

const recommendedTracks = await getRecommendations();
console.log(
  recommendedTracks.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);