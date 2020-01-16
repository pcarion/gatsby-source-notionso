const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---src-templates-page-js": hot(preferDefault(require("/Users/pcarion/pierre/gatsby-source-notionso/workspaces/example-gatsbyplugins-com/src/templates/page.js"))),
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/pcarion/pierre/gatsby-source-notionso/workspaces/example-gatsbyplugins-com/.cache/dev-404-page.js"))),
  "component---src-pages-index-js": hot(preferDefault(require("/Users/pcarion/pierre/gatsby-source-notionso/workspaces/example-gatsbyplugins-com/src/pages/index.js")))
}

