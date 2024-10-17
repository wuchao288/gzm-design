import {App, createApp} from 'vue';
import { Icon } from '@arco-design/web-vue';

const IconFont = Icon.addFromIconFontCn({ src: './font_4462597_v1tcyl0gwl.js'});

export default {
    install(app: App) {
        app.component('AliIcon', IconFont);
    }
}
