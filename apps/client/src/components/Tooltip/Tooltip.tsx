import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Tooltip as MUITooltip } from "@mui/material";
import styles from "./Tooltip.module.css";

export interface TooltipProps extends StandardComponentProps {
	children?: React.ReactNode;
}

export function Tooltip(props: TooltipProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUITooltip id={props.id} className={`${styles.Tooltip} ${props.extendedClass ?? ""}`} sx={props.sx}>
			{props.children}
		</MUITooltip>
	);
}
