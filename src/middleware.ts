import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Récupération des cookies
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  console.log("Cookies:", userCookie); // Log des cookies
  console.log("Token:", token); // Log du token
  console.log("User:", user); // Log de l'utilisateur

  const url = request.nextUrl;

  // 🔹 Autoriser tout le monde à accéder à /interface/home et /interface/event/:id
  if (url.pathname === "/interface/home" || url.pathname.startsWith("/interface/event")) {
    return NextResponse.next();
  }

  // 🔹 Rediriger un utilisateur déjà authentifié hors de la page de login
  if (token && user && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/interface/home", request.url));
  }

  // 🔹 Redirection si l'utilisateur n'est pas connecté (sauf pour les pages autorisées)
  if (!token || !user) {
    if (url.pathname.startsWith("/interface")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // 🔹 Gestion des rôles
  const { role } = user;

  // Redirection pour les routes admin
  if (url.pathname.startsWith("/interface/admin") && role !== "ADMINISTRATEUR") {
    return NextResponse.redirect(new URL("/interface/home", request.url));
  }

  // Redirection pour les routes new-event
  if (url.pathname.startsWith("/interface/new-event")) {
    if (role !== "ORGANISATEUR") {
      if (role === "PARTICIPANT") {
        return NextResponse.redirect(new URL("/interface/become-organizer", request.url));
      }
      return NextResponse.redirect(new URL("/interface/home", request.url));
    }
  }

  return NextResponse.next();
}

// Configurer les routes protégées
export const config = {
  matcher: [
    "/interface/admin/:path*",
    "/interface/new-event/:path*",
    "/interface/:path*", // Protéger toutes les autres routes sous /interface
    "/login",
  ],
};
