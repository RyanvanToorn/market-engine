import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { ToggleButton as MUIToggleButton } from "@mui/material";
import styles from "./ToggleButton.module.css";

export interface ToggleButtonProps extends StandardComponentProps {
	value: string;
	contents?: React.ReactNode;
	ariaLabel?: string;
}

export function ToggleButton(props: ToggleButtonProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUIToggleButton
			value={props.value}
			id={props.id}
			className={`${styles.ToggleButtonGroup} ${props.extendedClass ?? ""}`}
			sx={props.sx}
			aria-label={props.ariaLabel}
		>
			{props.contents}
		</MUIToggleButton>
	);
}
