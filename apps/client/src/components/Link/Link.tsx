import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Link as MUILink } from "@mui/material";
import styles from "./Link.module.css";

export interface LinkProps extends StandardComponentProps {
	href?: string;
	contents?: React.ReactNode;
	underline?: "none" | "hover" | "always";
	onClick?: () => void;
}

export function Link(props: LinkProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUILink
			onClick={props.onClick}
			href={props.href}
			id={props.id}
			className={`${styles.Link} ${props.extendedClass ?? ""}`}
			sx={props.sx}
			underline={props.underline}
		>
			{props.contents}
		</MUILink>
	);
}
