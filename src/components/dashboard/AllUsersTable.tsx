"use client";

import { useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { MoreVertical, Shield, UserCheck, UserX, Mail, User as UserIcon, Calendar, AlertTriangle } from "lucide-react";
import { updateUserStatus } from "@/lib/actions/adminActions";
import { toast } from "sonner";
import { TUpdateUser } from "@/app/types/updateUser";

interface AllUsersTableProps {
    users: TUpdateUser[];
    currentUserId?: string;
    currentUserEmail?: string;
}

export default function AllUsersTable({ users, currentUserId, currentUserEmail }: AllUsersTableProps) {
    const [statusMap, setStatusMap] = useState<Record<string, string>>({});
    const [activeDropdown, setActiveDropdown] = useState<{
        userId: string;
        top: number;
        right: number;
    } | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const [confirmModal, setConfirmModal] = useState<{
        user: TUpdateUser;
        targetStatus: "ACTIVE" | "BLOCKED";
    } | null>(null);

    const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
        e.stopPropagation();
        if (activeDropdown?.userId === userId) {
            setActiveDropdown(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setActiveDropdown({
                userId,
                top: rect.bottom + 4,
                right: Math.max(16, window.innerWidth - rect.right),
            });
        }
    };

    const triggerStatusConfirmation = (user: TUpdateUser, targetStatus: "ACTIVE" | "BLOCKED") => {
        setActiveDropdown(null);

        const isSelf = Boolean(
            (currentUserId && user.id === currentUserId) ||
            (currentUserEmail && user.email === currentUserEmail)
        );

        if (isSelf && targetStatus === "BLOCKED") {
            toast.error("You cannot block your own admin account!");
            return;
        }

        setConfirmModal({ user, targetStatus });
    };

    const handleConfirmStatusChange = async () => {
        if (!confirmModal) return;

        const { user, targetStatus } = confirmModal;
        const userId = user.id;

        setIsUpdating(userId);
        setConfirmModal(null);

        setStatusMap((prev) => ({ ...prev, [userId]: targetStatus }));

        try {
            const res = await updateUserStatus(userId, targetStatus);
            if (res?.success) {
                toast.success(res.message || `User status updated to ${targetStatus}`);
            } else {
                toast.success(`User status updated to ${targetStatus}`);
            }
        } catch {
            toast.error("Failed to update user status");
        } finally {
            setIsUpdating(null);
        }
    };

    if (!users || users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
                <UserIcon className="h-12 w-12 text-slate-600 mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No Users Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-1">
                    There are currently no registered users in the platform.
                </p>
            </div>
        );
    }

    const selectedUser = confirmModal?.user;
    const isTargetingBlock = confirmModal?.targetStatus === "BLOCKED";

    return (
        <div className="relative">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User Details</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, idx) => {
                        const userId = user.id || `user-${idx}`;
                        const currentStatus = statusMap[userId] || user.userStatus?.toUpperCase() || "ACTIVE";
                        const isBlocked = currentStatus === "BLOCKED";
                        const isSelf = Boolean(
                            (currentUserId && user.id === currentUserId) ||
                            (currentUserEmail && user.email === currentUserEmail)
                        );

                        const formattedDate = user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                            : "N/A";

                        return (
                            <TableRow key={userId} className="group hover:bg-slate-800/50 transition-colors">

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-teal-400 font-bold text-sm">
                                            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                                                    {user.name || "N/A"}
                                                </p>
                                                {isSelf && (
                                                    <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded font-mono font-semibold">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 font-mono">ID: {userId.slice(-6)}</p>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                                        <span>{user.email}</span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${user.role?.toUpperCase() === "ADMIN"
                                                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                                : user.role?.toUpperCase() === "PROVIDER"
                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                                    : "bg-teal-500/10 text-teal-400 border-teal-500/30"
                                            }`}
                                    >
                                        <Shield className="h-3 w-3" />
                                        {user.role || "CUSTOMER"}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${isBlocked
                                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${isBlocked ? "bg-rose-500" : "bg-emerald-500 animate-pulse"
                                                }`}
                                        />
                                        {currentStatus}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                        <span>{formattedDate}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <button
                                        onClick={(e) => handleDropdownClick(e, userId)}
                                        disabled={isUpdating === userId}
                                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
                                        aria-label="Actions menu"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {activeDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setActiveDropdown(null)}
                    />
                    <div
                        style={{
                            top: `${activeDropdown.top}px`,
                            right: `${activeDropdown.right}px`,
                        }}
                        className="fixed z-50 w-48 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
                    >
                        <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Manage Status
                        </p>
                        {(() => {
                            const user = users.find((u) => u.id === activeDropdown.userId);
                            if (!user) return null;

                            const userId = user.id;
                            const currentStatus = statusMap[userId] || user.userStatus?.toUpperCase() || "ACTIVE";
                            const isSelf = Boolean(
                                (currentUserId && user.id === currentUserId) ||
                                (currentUserEmail && user.email === currentUserEmail)
                            );

                            return (
                                <>
                                    <button
                                        onClick={() => triggerStatusConfirmation(user, "ACTIVE")}
                                        disabled={currentStatus === "ACTIVE"}
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${currentStatus === "ACTIVE"
                                                ? "text-slate-600 cursor-not-allowed"
                                                : "text-emerald-400 hover:bg-emerald-500/10"
                                            }`}
                                    >
                                        <UserCheck className="h-4 w-4" />
                                        Set Active
                                    </button>

                                    <button
                                        onClick={() => triggerStatusConfirmation(user, "BLOCKED")}
                                        disabled={currentStatus === "BLOCKED" || isSelf}
                                        title={isSelf ? "You cannot block your own account" : undefined}
                                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${currentStatus === "BLOCKED" || isSelf
                                                ? "text-slate-600 cursor-not-allowed opacity-60"
                                                : "text-rose-400 hover:bg-rose-500/10"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <UserX className="h-4 w-4" />
                                            <span>Block User</span>
                                        </div>
                                        {isSelf && <span className="text-[10px] text-slate-500 font-mono">(Self)</span>}
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </>
            )}

            <Dialog open={!!confirmModal} onOpenChange={(open) => !open && setConfirmModal(null)}>
                <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className={`p-2.5 rounded-xl border ${isTargetingBlock
                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    }`}
                            >
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <DialogTitle className="text-lg font-bold text-white">
                                {isTargetingBlock ? "Block User Account" : "Activate User Account"}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-400 text-sm">
                            {isTargetingBlock ? (
                                <>
                                    Are you sure you want to block{" "}
                                    <strong className="text-slate-200">{selectedUser?.name}</strong> (
                                    <span className="font-mono text-slate-300">{selectedUser?.email}</span>)?
                                    <br />
                                    This user will be prevented from logging in and accessing their dashboard.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to reactivate{" "}
                                    <strong className="text-slate-200">{selectedUser?.name}</strong> (
                                    <span className="font-mono text-slate-300">{selectedUser?.email}</span>)?
                                    <br />
                                    Full account access will be restored immediately.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 gap-2">
                        <button
                            type="button"
                            onClick={() => setConfirmModal(null)}
                            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmStatusChange}
                            className={`px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-lg transition-all ${isTargetingBlock
                                    ? "bg-rose-600 hover:bg-rose-500 shadow-rose-900/30"
                                    : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30"
                                }`}
                        >
                            {isTargetingBlock ? "Yes, Block User" : "Yes, Activate User"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
