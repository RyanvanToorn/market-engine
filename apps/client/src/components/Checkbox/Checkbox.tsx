import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Checkbox as MUICheckbox } from "@mui/material";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends StandardComponentProps {}

export function Checkbox(props: CheckboxProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUICheckbox
			id={props.id}
			className={`${styles.Checkbox} ${props.extendedClass ?? ""}`}
			sx={props.sx}
		/>
	);
}
