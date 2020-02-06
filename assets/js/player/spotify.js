import { authorize } from "./spotify/spotify_auth"

const player_name = "Hillside Jukebox";
const token = 'BQD-XXuwz_Lr6pyZ9OWim84ZNRxBDsqJgkNAwMxn39NF-KUR8voD4a3n8L1R-sNF98bc6YfbmiFL1TO78VsZjPVk1ttDs9AQ64KDZrj8537MF5E-BxDfPPFFy4ZcznNKvSztzWtOlXsvOf-Bbm4U9WHCtxRUpIOZUqE';
const getOAuthToken = (cb) => {
    cb(token);
}

function onSpotifyWebPlaybackSDKReady() {
    const player = new Spotify.Player({
        name: player_name,
        getOAuthToken: getOAuthToken
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        play({
            playerInstance: player,
            spotify_uri: 'spotify:track:4guzyKDYdPJ5u82WcTPtoI',
        });
        authorize();
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
};

function play({
    spotify_uri,
    playerInstance
}) {
    let getOAuthToken = playerInstance._options.getOAuthToken;
    let id = playerInstance._options.id;
    console.log(spotify_uri, playerInstance);
    getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        });
    });
};

export {
    play as play_track,
    onSpotifyWebPlaybackSDKReady as ready_callback
}
