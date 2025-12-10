import Footer from "@/components/sections/Footer";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			{children}
			<Footer />
		</div>
	);
};

export default Layout;
