import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Tab as MUITab } from "@mui/material";
import type { TabProps as MUITabProps } from "@mui/material/Tab";
import * as React from "react";
import styles from "./Tab.module.css";

export type TabProps = StandardComponentProps & Omit<MUITabProps, "className" | "id" | "sx" | "style">;

export const Tab = React.forwardRef<HTMLDivElement, TabProps>(function Tab(props: TabProps, ref): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	const { extendedClass, isVisible, id, sx, style, ...muiProps } = props;

	return <MUITab ref={ref} id={id} sx={sx} style={style} className={`${styles.Tab} ${extendedClass ? extendedClass : ""}`} {...muiProps} />;
});
