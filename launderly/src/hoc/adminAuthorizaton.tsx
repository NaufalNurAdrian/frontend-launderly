'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuthorization = (WrappedComponent: React.ComponentType<any>, allowedRoles: string[]) => {
  const WithAuthorization: React.FC<any> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);

        if (!allowedRoles.includes(payload.role)) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        router.push("/");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return WithAuthorization;
};

export const withSuperAdmin = (Component: React.ComponentType<any>) =>
  withAuthorization(Component, ["SUPER_ADMIN"]);

export const withOutletAdmin = (Component: React.ComponentType<any>) =>
  withAuthorization(Component, ["OUTLET_ADMIN"]);

export const withSuperAndOutletAdmin = (Component: React.ComponentType<any>) =>
  withAuthorization(Component, ["SUPER_ADMIN", "OUTLET_ADMIN"]);

export default withAuthorization;
