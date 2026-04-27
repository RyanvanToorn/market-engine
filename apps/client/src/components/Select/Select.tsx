import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Select as MUISelect } from "@mui/material";
import type { SelectProps as MUISelectProps } from "@mui/material/Select";
import styles from "./Select.module.css";

export type SelectProps<TValue = unknown> = StandardComponentProps & Omit<MUISelectProps<TValue>, "id" | "className" | "sx" | "style">;

export function Select<TValue = unknown>(props: SelectProps<TValue>): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	const { isVisible, id, extendedClass, sx, style, ...muiProps } = props;

	return <MUISelect {...muiProps} id={id} className={`${styles.Select} ${extendedClass ?? ""}`} sx={sx} style={style} />;
}
