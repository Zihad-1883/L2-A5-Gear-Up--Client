import { getAllGears, getAllCategories } from "@/lib/actions/publicActions";
import { TGear } from "@/app/types/gear";
import { TCategory } from "@/app/types/category";
import BrowseGearClient from "@/components/gear/BrowseGearClient";

export default async function BrowseGearPage() {
    const [gearsRes, catRes] = await Promise.all([
        getAllGears(),
        getAllCategories(),
    ]);

    const initialGears: TGear[] = Array.isArray(gearsRes)
        ? gearsRes
        : gearsRes?.data || gearsRes?.result || [];

    const initialCategories: TCategory[] = Array.isArray(catRes)
        ? catRes
        : catRes?.data || catRes?.result || [];

    return (
        <BrowseGearClient
            initialGears={initialGears}
            initialCategories={initialCategories}
        />
    );
}
