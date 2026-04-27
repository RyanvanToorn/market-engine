import { Box } from "@components/Box/Box";
import { Paper } from "@components/Paper/Paper";
import { Typography } from "@components/Typography/Typography";
import { useBasicLayout } from "@layouts/BasicLayout";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import styles from "./Dashboard.module.css";

interface Tile {
	label: string;
	href: string;
}

// Keep parity with AssetType in src/types/asset-type
const tiles: Tile[] = [
	{ label: "Equities", href: "equities" },
	{ label: "ETFs", href: "etfs" },
	{ label: "Indices", href: "indices" },
	{ label: "Commodities", href: "commodities" },
	{ label: "Crypto", href: "crypto" },
	{ label: "Currencies", href: "currencies" },
	{ label: "Bonds", href: "bonds" },
	{ label: "Market Overview", href: "marketoverview" },
];

export function Dashboard(): React.ReactElement | null {
	const { setLayout } = useBasicLayout();
	const theme = useTheme();
	const navigate = useNavigate();

	const tileBorderRadius = typeof theme.shape.borderRadius === "number" ? theme.shape.borderRadius * 2 : `calc(${theme.shape.borderRadius} * 2)`;

	useEffect(() => {
		setLayout((prev) => ({
			...prev,
			title: "Dashboard",
		}));
	}, [setLayout]);

	const handleTileClick = (href: string) => {
		navigate({ to: "/browse", search: { market: href } });
	};

	return (
		<Box extendedClass={styles.Dashboard}>
			<Paper
				extendedClass={styles.DashboardPaper}
				sx={{
					p: { xs: 2, sm: 3, md: 4 },
					bgcolor: "background.default",
					borderRadius: "0rem",
				}}
			>
				<Box
					sx={{
						width: "min(1100px, 100%)",
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, minmax(0, 1fr))",
							md: "repeat(3, minmax(0, 1fr))",
						},
						gap: { xs: 2, sm: 2.5, md: 3 }, // theme spacing scale
					}}
				>
					{tiles.map((tile) => (
						<Paper
							key={tile.label}
							onClick={() => handleTileClick(tile.href)}
							sx={{
								borderRadius: tileBorderRadius,
								minHeight: 140,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								bgcolor: "background.paper",
								cursor: "pointer",
								boxShadow: 1,
								transition: theme.transitions.create(["transform", "box-shadow"], {
									duration: theme.transitions.duration.short,
								}),
								"&:hover": {
									transform: "translateY(-2px)",
									boxShadow: 4,
								},
							}}
						>
							<Typography
								text={tile.label}
								sx={{
									fontFamily: theme.typography.fontFamily,
									fontSize: { xs: "1.5rem", md: "2rem" },
									fontWeight: 700,
									color: "text.primary",
								}}
							/>
						</Paper>
					))}
				</Box>
			</Paper>
		</Box>
	);
}
