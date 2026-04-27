import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { ToggleButtonGroup as MUIToggleButtonGroup } from "@mui/material";
import styles from "./ToggleButtonGroup.module.css";

export interface ToggleButtonGroupProps extends StandardComponentProps {
	children?: React.ReactNode;
	value?: any;
	onChange?: (event: React.MouseEvent<HTMLElement>, value: any) => void;
	orientation?: "horizontal" | "vertical";
	size?: "small" | "medium" | "large";
	exclusive?: boolean;
	fullWidth?: boolean;
}

export function ToggleButtonGroup(props: ToggleButtonGroupProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUIToggleButtonGroup
			id={props.id}
			className={`${styles.ToggleButtonGroup} ${props.extendedClass ?? ""}`}
			sx={props.sx}
			onChange={props.onChange}
			children={props.children}
			orientation={props.orientation}
			size={props.size}
			value={props.value}
			exclusive={props.exclusive}
			fullWidth={props.fullWidth}
		/>
	);
}
