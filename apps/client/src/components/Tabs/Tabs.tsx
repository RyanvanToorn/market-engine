import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { Tabs as MUITabs } from "@mui/material";
import styles from "./Tabs.module.css";

export interface TabsProps extends StandardComponentProps {
	children: React.ReactNode;
	value?: false | any;
	centered?: boolean;
	indicatorColor?: "primary" | "secondary";
	onChange: (event: React.SyntheticEvent, value: any) => void;
	orientation?: "horizontal" | "vertical";
	scrollButtons?: boolean | "auto";
	visibleScrollbar?: boolean;
}

export function Tabs(props: TabsProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUITabs
			id={props.id}
			className={`${styles.Tabs} ${props.extendedClass ?? ""}`}
			sx={props.sx}
			value={props.value}
			centered={props.centered}
			indicatorColor={props.indicatorColor}
			onChange={props.onChange}
			orientation={props.orientation}
			scrollButtons={props.scrollButtons}
			visibleScrollbar={props.visibleScrollbar}
			children={props.children}
		/>
	);
}
