import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Typography as MUITypography } from "@mui/material";
import styles from "./Typography.module.css";

export interface TypographyProps extends StandardComponentProps {
	noWrap?: boolean;
	variant?: "body1" | "body2" | "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "inherit" | "overline" | "subtitle1" | "subtitle2";
	text: string;
}

export function Typography(props: TypographyProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUITypography id={props.id} className={`${styles.Typography} ${props.extendedClass ?? ""}`} sx={props.sx} variant={props.variant}>
			{props.text}
		</MUITypography>
	);
}
