/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";

const decodeBase64 = (base64: string) => {
  try {
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error("Error decoding base64:", error);
    return null;
  }
};

const decodeToken = (token: string | null) => {
  if (!token) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  return decodeBase64(parts[1]); // Décoder le payload du JWT
};

interface WithAuthProps {
  requiredRoles: string[];
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>, requiredRoles: string[]) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      const token = localStorage.getItem("token");
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");

      // Vérification de la validité du token
      if (!token) {
        alert("Accès non autorisé. Veuillez vous connecter.");
        router.replace("/login");
        return;
      }

      const payload = decodeToken(token);
      const expiryTime = payload?.exp ? payload.exp * 1000 : 0;
      const currentTime = Date.now();

      if (!payload || currentTime >= expiryTime) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        localStorage.clear(); // Nettoyage du token expiré
        router.replace("/login");
        return;
      }

      // Vérification des rôles
      if (!requiredRoles.some((role) => roles.includes(role))) {
        alert("Vous n'avez pas les permissions nécessaires pour accéder à cette page.");
        router.replace("/login");
        return;
      }

      setIsAuthorized(true);
    }, [router]);

    if (isAuthorized === null) {
      return null; // En attendant la vérification, on ne rend rien (ou un spinner si nécessaire)
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
