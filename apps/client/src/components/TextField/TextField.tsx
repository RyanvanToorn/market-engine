import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { TextField as MUITextField } from "@mui/material";
import type { TextFieldProps as MUITextFieldProps } from "@mui/material/TextField";
import styles from "./TextField.module.css";

export type TextFieldProps = StandardComponentProps & Omit<MUITextFieldProps, "id" | "className" | "sx" | "style">;

export function TextField(props: TextFieldProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	const { isVisible, id, extendedClass, sx, style, ...muiProps } = props;

	return <MUITextField {...muiProps} id={id} className={`${styles.TextField} ${extendedClass ?? ""}`} sx={sx} style={style} />;
}
