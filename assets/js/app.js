import 'jquery/dist/jquery.min.js';
import '../scss/bootstrap-custom.scss';
import '@forevolve/bootstrap-dark/dist/css/bootstrap-dark.min.css';
import '@forevolve/bootstrap-dark/dist/js/bootstrap.min.js';
import "../scss/app.scss";
import {
  library,
  dom
} from '@fortawesome/fontawesome-svg-core'
import {
  faHeadphonesAlt
} from '@fortawesome/free-solid-svg-icons'
import JukeboxController from "./controller/jukebox";
library.add(faHeadphonesAlt);
dom.watch();
let controller = new JukeboxController();