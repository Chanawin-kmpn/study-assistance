"use client";

import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

type ConfirmDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string | React.ReactNode;
	cancelLabel?: string;
	actionLabel?: string;
	onAction: () => void | Promise<void>;
	variant?: "default" | "destructive";
	disabled?: boolean;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	onOpenChange,
	title,
	description,
	cancelLabel = "Cancel",
	actionLabel = "Continue",
	onAction,
	variant = "default",
	disabled = false, // ✅ default false
}) => {
	const handleAction = async () => {
		await onAction();
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={(newOpen) => {
				// ✅ ป้องกันการปิดเมื่อกำลัง disabled
				if (!disabled) {
					onOpenChange(newOpen);
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription asChild={typeof description !== "string"}>
						{typeof description === "string" ? (
							<span>{description}</span>
						) : (
							<div>{description}</div>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={disabled}>
						{cancelLabel}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleAction}
						disabled={disabled}
						className={
							variant === "destructive"
								? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
								: ""
						}
					>
						{/* ✅ แสดง loading spinner เมื่อ disabled */}
						{disabled && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						{actionLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
