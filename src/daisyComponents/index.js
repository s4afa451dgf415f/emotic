import Vue from 'vue';
const requireComponent = require.context('./', true, /\.vue$/);
requireComponent.keys().forEach(filePath => {
    let componentName = requireComponent(filePath).default.name;
    Vue.component(componentName, requireComponent(filePath).default);
    Vue.prototype.$dsmessage = function (options) {
        console.log(options.message);
    };
});
