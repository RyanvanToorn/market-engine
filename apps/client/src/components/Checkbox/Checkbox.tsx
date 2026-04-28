import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Checkbox as MUICheckbox } from "@mui/material";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends StandardComponentProps {
	checked?: boolean;
	color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
	defaultChecked?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUICheckbox
			id={props.id}
			className={`${styles.Checkbox} ${props.extendedClass ?? ""}`}
			sx={props.sx}
			checked={props.checked}
			color={props.color}
			defaultChecked={props.defaultChecked}
			onChange={props.onChange}
		/>
	);
}
