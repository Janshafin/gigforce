"use client";

import { useEffect } from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function GoogleAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Load the Google Identity Services script
    if (GOOGLE_CLIENT_ID && typeof window !== "undefined") {
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }, []);

  return <>{children}</>;
}
