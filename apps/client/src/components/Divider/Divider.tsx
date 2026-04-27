import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Divider as MUIDivider } from "@mui/material";
import styles from "./Divider.module.css";

export interface DividerProps extends StandardComponentProps {
	orientation: "horizontal" | "vertical";
	variant?: "fullWidth" | "inset" | "middle";
	absolute?: boolean;
	flexItem?: boolean;
}

export function Divider(props: DividerProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUIDivider
			id={props.id}
			className={`${styles.Divider} ${props.extendedClass ?? ""}`}
			sx={props.sx}
			variant={props.variant}
			absolute={props.absolute}
			flexItem={props.flexItem}
		/>
	);
}
