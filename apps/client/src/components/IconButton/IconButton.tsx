import type { StandardComponentProps } from "@interfaces/standard-component-props";
import MUIIconButton from "@mui/material/IconButton";
import styles from "./IconButton.styles.module.css";

export interface IconButtonProps extends StandardComponentProps {
	children?: React.ReactNode;
	onClick?: () => void;
}

export function IconButton(props: IconButtonProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUIIconButton id={props.id} className={`${styles.IconButton} ${props.extendedClass ?? ""}`} sx={props.sx}>
			{props.children}
		</MUIIconButton>
	);
}
