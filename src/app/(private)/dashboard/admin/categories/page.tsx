import { getAllCategories } from "@/lib/actions/publicActions";
import CategoryManagement from "@/components/dashboard/CategoryManagement";
import { TCategory } from "@/app/types/category";

export const dynamic = "force-dynamic";

const CategoriesPage = async () => {
    const result = await getAllCategories();
    const categories: TCategory[] = Array.isArray(result)
        ? result
        : result?.data || result?.result || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Gear Categories</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage and create product categories for rentals and equipment listings.
                </p>
            </div>

            <CategoryManagement initialCategories={categories} />
        </div>
    );
};

export default CategoriesPage;