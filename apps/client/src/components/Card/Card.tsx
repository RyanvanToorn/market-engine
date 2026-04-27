import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Card as MUICard } from "@mui/material";
import styles from "./Card.module.css";

export interface CardProps extends StandardComponentProps {
	children?: React.ReactNode;
	raised?: boolean;
}

export function Card(props: CardProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUICard id={props.id} className={`${styles.Card} ${props.extendedClass ?? ""}`} sx={props.sx}>
			{props.children}
		</MUICard>
	);
}
