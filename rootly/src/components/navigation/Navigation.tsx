// src/components/navigation/Navigation.tsx
import { BookOpen, GraduationCap, Brain, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
	currentPage: string;
	onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
	const { theme, toggle } = useTheme();
	const location = useLocation();
	const navItems = [
		{ id: "dashboard", label: "Dashboard", icon: Brain, href: "/dashboard" },
		{ id: "notes", label: "Notes", icon: BookOpen, href: "/notes" },
		{ id: "courses", label: "Courses", icon: GraduationCap, href: "/courses" },
		{ id: "review", label: "Review", icon: Brain, href: "/review" },
	];

	return (
		<nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container">
				<div className="flex items-center justify-between h-16">
					{/* Logo and Brand */}
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
							<BookOpen className="w-5 h-5 text-primary-foreground" />
						</div>
						<div className="flex flex-col">
							<span className="font-bold text-lg leading-none text-foreground">Rootly</span>
							<span className="text-xs text-muted-foreground font-medium">Track your learning journey</span>
						</div>
					</div>
					
					{/* Navigation Items */}
					<div className="flex items-center gap-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.href;
							return (
								<Link key={item.id} to={item.href} onClick={() => onPageChange(item.id)} className="no-underline">
									<Button
										variant={isActive ? "default" : "ghost"}
										size="sm"
										className={`relative px-3 ${isActive ? 'shadow-sm' : 'hover:bg-accent'} transition-colors`}
									>
										<Icon className="w-4 h-4 mr-1" />
										<span className="text-sm font-medium">{item.label}</span>
										{isActive && <span className="sr-only">Current page</span>}
									</Button>
								</Link>
							);
						})}
						<Separator orientation="vertical" className="mx-2 h-6" />
						<Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
							{theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}
