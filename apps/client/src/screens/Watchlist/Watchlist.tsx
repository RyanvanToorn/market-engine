import { Box } from "@components/Box/Box";
import { Paper } from "@components/Paper/Paper";
import { useBasicLayout } from "@layouts/BasicLayout";
import { useEffect } from "react";
import styles from "./Watchlist.module.css";

export interface WatchlistProps {
	temp?: string;
}

export function Watchlist(props: WatchlistProps): React.ReactElement | null {
	const { setLayout } = useBasicLayout();

	useEffect(() => {
		setLayout((prev) => ({
			...prev,
			title: "Watchlist",
		}));
	}, [setLayout]);

	return (
		<Box extendedClass={styles.Watchlist}>
			<Paper
				extendedClass={styles.WatchlistPaper}
				sx={{
					borderRadius: "0rem",
				}}
			>
				{props.temp}
			</Paper>
		</Box>
	);
}
