"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

export const getAllGears = async () => {
    try {
        const res = await fetch(`${baseUrl}/gear`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching gears:", error);
        return { success: false, data: [] };
    }
};

export const getSingleGear = async (id: string) => {
    try {
        const res = await fetch(`${baseUrl}/gear/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching gear:", error);
        return { success: false, data: [] };
    }
};

export const getAllCategories = async () => {
    try {
        const res = await fetch(`${baseUrl}/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "force-cache",
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, data: [] };
    }
};