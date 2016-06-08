import {blegh} from "shared/test";
import $ from "jquery";
import "./application.scss";

blegh();

$("body").html("Pretty rad");

if (module.hot) {
    module.hot.accept();
}
