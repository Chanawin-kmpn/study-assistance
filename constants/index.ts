import { Facebook, Github, LucideIcon, Mail } from "lucide-react";

interface NavItem {
	name: string;
	href: string;
}

interface NavSection {
	title: string;
	items: NavItem[];
}

const FOOTER_LINKS: NavSection[] = [
	{
		title: "Product",
		items: [{ name: "Pricing", href: "#" }],
	},
	{
		title: "Company",
		items: [
			{ name: "About", href: "#" },
			{ name: "Blog", href: "#" },
			{ name: "Contact", href: "#" },
		],
	},
	{
		title: "Legal",
		items: [
			{ name: "Privacy Policy", href: "#" },
			{ name: "Terms of Service", href: "#" },
			{ name: "Cookie Policy", href: "#" },
		],
	},
];

interface SocialLink {
	href: string;
	icon: LucideIcon;
	ariaLabel: string;
}

const SOCIAL_LINKS: SocialLink[] = [
	{
		href: "https://github.com/Chanawin-kmpn/study-assistance",
		icon: Github,
		ariaLabel: "GitHub profile",
	},
	{
		href: "https://facebook.com",
		icon: Facebook,
		ariaLabel: "Facebook profile",
	},
	{ href: "mailto:chanawin.k@gmail.com", icon: Mail, ariaLabel: "Email us" },
];

export { FOOTER_LINKS, SOCIAL_LINKS };
