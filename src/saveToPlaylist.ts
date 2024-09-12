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

const tracksUri = [
  'spotify:track:6k6Fm0n1jI1A6OFbMFMW2G','spotify:track:0SiuM4lkWnbBlXi81LqYk8','spotify:track:1jR0UA2MT5KCtB2wAK3Omj','spotify:track:6XekrCAu1m81kbK2vs3YXR','spotify:track:5NwSA0Br6Y1fvKKFxBx0Mh','spotify:track:79hV9YHayd2RIzpgrxNVd8','spotify:track:4u2cpX7EWWTtQNB7qLiYdE','spotify:track:3rAYRsOGxKp06eKVf8Pubt','spotify:track:2uFOGFTmoh2eZRUKf9l2vF','spotify:track:1jR0UA2MT5KCtB2wAK3Omj'
];

async function createPlaylist(tracksUri){
  const { id: user_id } = await fetchWebApi('v1/me', 'GET')

  const playlist = await fetchWebApi(
    `v1/users/${user_id}/playlists`, 'POST', {
      "name": "My recommendation playlist",
      "description": "Playlist created by the tutorial on developer.spotify.com",
      "public": false
  })

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
    'POST'
  );

  return playlist;
}

const createdPlaylist = await createPlaylist(tracksUri);
console.log(createdPlaylist.name, createdPlaylist.id);
