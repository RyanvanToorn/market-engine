import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Menu as MUIMenu } from "@mui/material";
import styles from "./Menu.module.css";

export interface MenuProps extends StandardComponentProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
}

export function Menu(props: MenuProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUIMenu open={props.isOpen} onClose={props.onClose} id={props.id} className={`${styles.Menu} ${props.extendedClass ?? ""}`} sx={props.sx}>
			{props.children}
		</MUIMenu>
	);
}
