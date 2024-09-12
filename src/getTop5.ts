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

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);