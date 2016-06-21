import "./application.scss";

import * as services from "./services";

//-----------------------
// PLAYGROUND
services.server.emitAction$("login", {username: "foo", password: "bar"})
    .subscribe(result => {
        if (result.error)
            console.log(result.error);
        else
            console.log("We're logged in");
    });



//-----------------------
// Auth

//-----------------------
// Components

//-----------------------
// Bootstrap
services.socket.connect();
