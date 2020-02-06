import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/app.css";
import { socket } from "./socket";
import "react-phoenix";
import { ready_callback } from "./player/spotify";

window.onSpotifyWebPlaybackSDKReady = ready_callback;