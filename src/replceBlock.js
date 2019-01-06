'use strict';

module.exports = {original: {
initialize: "public function initialize()\n\
    {\n\
        $this->modExtra = $this->modx->getService('modExtra', 'modExtra', MODX_CORE_PATH . 'components/modextra/model/');\n\
        parent::initialize();\n\
    }",
loadCustomCssJs: "public function loadCustomCssJs()\n\
    {\n\
        $this->addCss($this->modExtra->config['cssUrl'] . 'mgr/main.css');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/modextra.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/misc/utils.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/misc/combo.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/widgets/items.grid.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/widgets/items.windows.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/widgets/home.panel.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/sections/home.js');\n\
\n\
        $this->addHtml('<script type=\"text/javascript\">\n\
        modExtra.config = ' . json_encode($this->modExtra->config) . ';\n\
        modExtra.config.connector_url = \"' . $this->modExtra->config['connectorUrl'] . '\";\n\
        Ext.onReady(function() {MODx.load({ xtype: \"modextra-page-home\"});});\n\
        </script>');\n\
    }",
},

vue: {
initialize: "public function initialize()\n\
    {\n\
        #$this->modExtra = $this->modx->getService('modExtra', 'modExtra', MODX_CORE_PATH . 'components/modextra/model/');\n\
        $this->modExtra = $this->modx->getService('modExtra', 'modExtra', MODX_BASE_PATH . 'modExtra/core/components/modextra/model/');\n\
        parent::initialize();\n\
}",
loadCustomCssJs: "public function loadCustomCssJs()\n\
    {\n\
        $this->addCss('../modExtra/assets/components/modextra/css/mgr/main.css');\n\
        $this->addJavascript('../modExtra/assets/components/modextra/js/mgr/app.js');\n\
        /*\n\
        $this->addCss($this->modExtra->config['cssUrl'] . 'mgr/main.css');\n\
        $this->addCss($this->modExtra->config['jsUrl'] . 'mgr/dist/css/app.css');\n\
        $this->addCss($this->modExtra->config['jsUrl'] . 'mgr/dist/css/chunk-vendors.css');\n\
 \n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/dist/js/chunk-vendors.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/dist/js/app.js');\n\
        */\n\
        $this->addHtml('<script type=\"text/javascript\">\n\
            var modExtra = {\n\
                connector_url: \"' . $this->modExtra->config['connectorUrl'] . '\",\n\
                modAuth: \"' . $this->modx->user->getUserToken($this->modx->context->get('key')) . '\",\n\
            };\n\
        </script>');\n\
    }"
},

extjs: {
initialize: "public function initialize()\n\
    {\n\
        #$this->modExtra = $this->modx->getService('modExtra', 'modExtra', MODX_CORE_PATH . 'components/modextra/model/');\n\
        $this->modExtra = $this->modx->getService('modExtra', 'modExtra', MODX_BASE_PATH . 'modExtra/core/components/modextra/model/');\n\
        parent::initialize();\n\
    }",
loadCustomCssJs: "public function loadCustomCssJs()\n\
    {\n\
        /*\n\
        $this->addCss($this->modExtra->config['cssUrl'] . 'mgr/main.css');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/modextra.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/misc/utils.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/misc/combo.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/widgets/items.grid.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/widgets/items.windows.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/widgets/home.panel.js');\n\
        $this->addJavascript($this->modExtra->config['jsUrl'] . 'mgr/sections/home.js');\n\
        */\n\
 \n\
        $this->addCss('../modExtra/assets/components/modextra/css/mgr/main.css');\n\
        $this->addJavascript('../modExtra/assets/components/modextra/js/mgr/modextra.js');\n\
        $this->addJavascript('../modExtra/assets/components/modextra/js/mgr/misc/utils.js');\n\
        $this->addJavascript('../modExtra/assets/components/modextra/js/mgr/misc/combo.js');\n\
        $this->addJavascript('../modExtra/assets/components/modextra/js/mgr/widgets/items.grid.js');\n\
        $this->addJavascript('../modExtra/assets/components/modextra/js/mgr/widgets/items.windows.js');\n\
        $this->addJavascript('../modExtra/assets/components/modextra/js/mgr/widgets/home.panel.js');\n\
        $this->addJavascript('../modExtra/assets/components/modextra/js/mgr/sections/home.js');\n\
 \n\
        $this->addHtml('<script type=\"text/javascript\">\n\
        modExtra.config = ' . json_encode($this->modExtra->config) . ';\n\
        modExtra.config.connector_url = \"' . $this->modExtra->config['connectorUrl'] . '\";\n\
        Ext.onReady(function() {MODx.load({ xtype: \"modextra-page-home\"});});\n\
        </script>');\n\
    }"
}
};