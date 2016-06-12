import "./application.scss";

import * as services from "./services";

//-----------------------
// PLAYGROUND
services.server.on$("test")
    .map(d => d + " whoa")
    .subscribe(item => {
        console.log(`Got ${item} from server!`);
    });

window.setTimeout(() => {
    services.server.status$
      .subscribe(status => console.log(status));
}, 3000);



//-----------------------
// Auth

//-----------------------
// Components

//-----------------------
// Bootstrap
services.socket.connect();
