import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Paper as MUIPaper } from "@mui/material";
import styles from "./Paper.module.css";

export interface PaperProps extends StandardComponentProps {
	children?: React.ReactNode;
	onClick?: () => void;
}

export function Paper(props: PaperProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUIPaper id={props.id} className={`${styles.Paper} ${props.extendedClass ?? ""}`} sx={props.sx} onClick={props.onClick}>
			{props.children}
		</MUIPaper>
	);
}
