import { BasicLayout } from "@layouts/BasicLayout";
import { Dashboard } from "@screens/Dashboard/Dashboard";
import { Home } from "@screens/Home/Home";
import { Settings } from "@screens/Settings/Settings";
import { Watchlist } from "@screens/Watchlist/Watchlist";
import { createRouter, RootRoute, Route, redirect } from "@tanstack/react-router";
import { Browse } from "./Browse/Browse";

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

// Dashboard route
const dashboardRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/dashboard",
	component: Dashboard,
});

// Settings route
const settingsRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/settings",
	component: Settings,
});

// Watchlist route
const watchlistRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/watchlist",
	component: Watchlist,
});

// Home route
const homeRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/home",
	component: Home,
});

// Browse route
const browseRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/browse",
	component: Browse,
	validateSearch: (search: Record<string, unknown>) => {
		const market = typeof search.market === "string" ? search.market : undefined;

		return { market };
	},
});

// Create the route tree
const routeTree = rootRoute.addChildren([dashboardRoute, settingsRoute, watchlistRoute, homeRoute, browseRoute]);

// Create and export the router
export const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
