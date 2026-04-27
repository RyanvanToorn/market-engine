import { Box } from "@components/Box/Box";
import { Paper } from "@components/Paper/Paper";
import { TabBrowser } from "@features/tab-browser/TabBrowser";
import { useBasicLayout } from "@layouts/BasicLayout";
import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import styles from "./Browse.module.css";

export function Browse(): React.ReactElement | null {
	const { setLayout } = useBasicLayout();

	const { market } = useSearch({ from: "/browse" });

	useEffect(() => {
		setLayout((prev) => ({
			...prev,
			title: market ? `Browse: ${market}` : "Browse",
		}));
	}, [setLayout, market]);

	return (
		<Box extendedClass={styles.Browse}>
			<Paper
				extendedClass={styles.BrowsePaper}
				sx={{
					bgcolor: "background.default",
					borderRadius: "0rem",
				}}
			>
				<TabBrowser />
			</Paper>
		</Box>
	);
}
