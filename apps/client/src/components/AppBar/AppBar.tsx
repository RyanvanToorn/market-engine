import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { AppBar as MUIAppBar, type SxProps, type Theme } from "@mui/material";
import styles from "./AppBar.module.css";

export interface AppBarProps extends StandardComponentProps {
	children?: React.ReactNode;
}

export function AppBar(props: AppBarProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUIAppBar
			position="relative"
			id={props.id}
			className={`${styles.AppBar} ${props.extendedClass ?? ""}`}
			sx={props.sx ? (Array.isArray(props.sx) ? [appBarSx, ...props.sx] : [appBarSx, props.sx]) : appBarSx}
		>
			{props.children}
		</MUIAppBar>
	);
}

const appBarSx: SxProps<Theme> = {
	display: "flex",
	flexDirection: "row",
};
