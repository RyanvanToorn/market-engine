import type { StandardComponentProps } from "@interfaces/standard-component-props";
import styles from "./Image.module.css";

export interface ImageProps extends StandardComponentProps {
	url: string;
	alt?: string;
	width?: number;
	height?: number;
}

export function Image(props: ImageProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<img
			id={props.id}
			src={props.url}
			alt={props.alt}
			width={props.width ? props.width : 600}
			height={props.height ? props.height : 600}
			className={`${styles.Image} ${props.extendedClass ? props.extendedClass : ""}`}
		/>
	);
}
