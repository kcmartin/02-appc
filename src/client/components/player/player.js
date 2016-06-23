import $ from "jquery";
import {ElementComponent} from "../../lib/component";

class PlayerComponent extends ElementComponent {
    constructor() {
        super();
    }

    _onAttach() {
        const $title = this._$mount.find("h1");
        $title.text("Player!");

        this.$element.append("<h1>HEY1234</h1>");
    }
}

// hot reloading - but force component to be self-contained
let component;
try {
    component = new PlayerComponent();
    component.attach($("section.player"));
} catch (e) {
    console.error(e);
    if (component)
        component.detach();
}
finally {
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => component && component.detach());
    }
}