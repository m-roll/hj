import '@forevolve/bootstrap-dark/dist/css/bootstrap-dark.min.css';
import 'jquery/dist/jquery.min.js';
import '@forevolve/bootstrap-dark/dist/js/bootstrap.bundle.min.js';
import "../css/app.css";
import JukeboxController from "./controller/jukebox";
import QueueController from "./controller/queue";
import "react-phoenix";


let controller;
if (page === "QUEUE") {
    controller = new QueueController();
} else if (page === "JUKEBOX") {
    controller = new JukeboxController();
}