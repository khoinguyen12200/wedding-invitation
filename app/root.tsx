import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/favicon.svg" },
  { rel: "mask-icon", href: "/favicon.svg", color: "#231A12" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500&family=Prata&family=Pinyon+Script&display=swap&subset=vietnamese",
  },
  {
    rel: "preload",
    as: "image",
    href: "/photos/ld3_0608-1280.jpg",
    media: "(max-width: 767px)",
  },
  {
    rel: "preload",
    as: "image",
    href: "/photos/hero-landscape-1280.jpg",
    media: "(min-width: 768px)",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#EDE6D8" />
        <title>Gia Khôi & Huyền Trân — 02.08.2026</title>
        <meta name="description" content="Trân trọng kính mời quý quan khách đến chung vui ngày trọng đại của Gia Khôi & Huyền Trân." />
        <meta property="og:title" content="Gia Khôi & Huyền Trân" />
        <meta property="og:description" content="Lễ Cưới · Chủ Nhật, 02.08.2026" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
