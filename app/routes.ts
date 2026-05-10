import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("groom", "routes/home.tsx", { id: "groom" }),
  route("bride", "routes/home.tsx", { id: "bride" }),
] satisfies RouteConfig;
