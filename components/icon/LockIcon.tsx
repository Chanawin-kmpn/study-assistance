// LockIcon.tsx
import gsap from "gsap";
import React, { useEffect, useRef } from "react";

interface LockIconProps {
	className?: string;
	isHovering?: boolean; // รับ prop เพิ่ม
}

const LockIcon = ({ className = "", isHovering = false }: LockIconProps) => {
	const lockedPath = "M7 10V7a5 5 0 0 1 10 0v3";
	const unlockedPath = "M7 10V7a5 5 0 0 1 9.33-2.5 ";

	const pathRef = useRef<SVGPathElement | null>(null);

	useEffect(() => {
		gsap.to(pathRef.current, {
			attr: { d: isHovering ? unlockedPath : lockedPath },
			duration: 0.5,
			ease: "power2.out",
		});
	}, [isHovering]);
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`lucide lucide-lock-keyhole ${className}`}
		>
			<circle cx="12" cy="16" r="1" />
			<rect x="3" y="10" width="18" height="12" rx="2" />

			{/* ใช้ CSS Class ตามค่า isHovering */}
			<path ref={pathRef} d={"M7 10V7a5 5 0 0 1 10 0v3"} />
		</svg>
	);
};

export default LockIcon;
