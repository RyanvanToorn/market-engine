import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Avatar as MUIAvatar } from "@mui/material";
import styles from "./Avatar.module.css";

export interface AvatarProps extends StandardComponentProps {
	children?: React.ReactNode;
}

export function Avatar(props: AvatarProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUIAvatar id={props.id} className={`${styles.Avatar} ${props.extendedClass ?? ""}`} sx={props.sx}>
			{props.children}
		</MUIAvatar>
	);
}
