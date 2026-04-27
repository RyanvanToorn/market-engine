import { router } from "@screens/routes";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./app.css";
import { AppThemeProvider } from "@theme/AppThemeProvider";
import { AppSettingsProvider } from "@context/AppSettingsProvider";





createRoot(document.getElementById("root")!).render(
	<StrictMode>
    <AppSettingsProvider>
					<AppThemeProvider>
						<RouterProvider router={router} />
					</AppThemeProvider>
    </AppSettingsProvider>
	</StrictMode>,
);
