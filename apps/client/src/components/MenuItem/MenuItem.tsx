import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { MenuItem as MUIMenuItem } from "@mui/material";
import type { MenuItemProps as MUIMenuItemProps } from "@mui/material/MenuItem";
import styles from "./MenuItem.module.css";

export type MenuItemProps = StandardComponentProps &
	Omit<MUIMenuItemProps, "id" | "className" | "sx" | "style" | "children"> & {
		contents?: React.ReactNode;
		children?: React.ReactNode;
	};

export function MenuItem(props: MenuItemProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	const { isVisible, id, extendedClass, sx, style, contents, children, ...muiProps } = props;

	return (
		<MUIMenuItem {...muiProps} id={id} className={`${styles.MenuItem} ${extendedClass ?? ""}`} sx={sx} style={style}>
			{contents ?? children}
		</MUIMenuItem>
	);
}
