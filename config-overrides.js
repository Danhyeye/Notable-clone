const { override, addWebpackPlugin, adjustWorkbox } = require("customize-cra");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = override(
    addWebpackPlugin(
        new WorkboxWebpackPlugin.InjectManifest({
            swSrc: "./public/service-worker.js",
            swDest: "service-worker.js",
        })
    ),
    adjustWorkbox(wb => {
        // This will copy the manifest.json from public/manifest.json to the build folder
        wb.manifestTransforms = [
            async manifestEntries => {
                return manifestEntries.map(entry => {
                    if (entry.url.endsWith(".js")) {
                        return { ...entry, url: entry.url + ".gz", revision: null };
                    }
                    return entry;
                });
            }
        ];
        return wb;
    })
);
