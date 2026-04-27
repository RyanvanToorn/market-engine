import type { StandardComponentProps } from "@interfaces/standard-component-props";
import type { SvgIconProps } from "@mui/material";
import { SvgIcon as MUIIcon } from "@mui/material";
import styles from "./Icon.module.css";

export interface IconProps extends StandardComponentProps {
	icon: React.ElementType<SvgIconProps>;
}

export function Icon(props: IconProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return <MUIIcon id={props.id} component={props.icon} className={`${styles.Icon} ${props.extendedClass ?? ""}`} sx={props.sx} />;
}
