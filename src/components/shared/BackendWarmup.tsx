"use client";

import { useEffect } from "react";

export default function BackendWarmup() {
    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API || "https://gearup-backend-4eca.onrender.com/api";
        fetch(baseUrl, { mode: "no-cors" }).catch(() => {
        });
    }, []);

    return null;
}
