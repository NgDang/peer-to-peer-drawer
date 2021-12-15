import { registerApplication, start } from "single-spa";

// registerApplication({
//   name: "@single-spa/welcome",
//   app: () =>
//     System.import(
//       "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
//     ),
//   activeWhen: (location) => location.pathname === '/',
// });

registerApplication({
  name: "@root/demo",
  app: () => System.import("@root/demo"),
  activeWhen: ["/room/:id", "/"],
});

start({
  urlRerouteOnly: true,
});
