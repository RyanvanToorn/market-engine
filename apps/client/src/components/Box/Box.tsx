import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Box as MUIBox } from "@mui/material";
import styles from "./Box.module.css";

export interface BoxProps extends StandardComponentProps {
	children?: React.ReactNode;
	onClick?: () => void;
}

export function Box(props: BoxProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUIBox id={props.id} className={`${styles.Box} ${props.extendedClass ?? ""}`} sx={props.sx} onClick={props.onClick}>
			{props.children}
		</MUIBox>
	);
}
