import { BasicLayout } from "@layouts/BasicLayout";
import { Home } from "@screens/Home/Home";
import { Settings } from "@screens/Settings/Settings";
import { Scraper } from "@screens/Scraper/Scraper";
import { createRouter, RootRoute, Route, redirect } from "@tanstack/react-router";

// Root route wraps the persistent layout
const rootRoute = new RootRoute({
	component: BasicLayout,
	beforeLoad: async ({ location }) => {
		if (location.pathname === "/") {
			throw redirect({
				to: "/home",
			});
		}
	},
});

// Settings route
const settingsRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/settings",
	component: Settings,
});

// Scraper route
const scraperRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/scraper",
	component: Scraper,
});

// Home route
const homeRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/home",
	component: Home,
});


// Create the route tree
const routeTree = rootRoute.addChildren([ settingsRoute, scraperRoute, homeRoute]);

// Create and export the router
export const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
