import type { SxProps, Theme } from "@mui/material";

export interface StandardComponentProps {
	id?: string;
	extendedClass?: string;
	style?: React.CSSProperties;
	sx?: SxProps<Theme>;
	isVisible?: boolean;
}
