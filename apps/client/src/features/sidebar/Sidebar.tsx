import { Box } from "@components/Box/Box";
import { Button } from "@components/Button/Button";
import { Icon } from "@components/Icon/Icon";
import { Paper } from "@components/Paper/Paper";
import CloseIcon from "@mui/icons-material/Close";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useState } from "react";
import styles from "./sidebar.module.css";

export interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	startExpanded?: boolean;
	headerContents?: React.ReactNode;
	bodyContents?: React.ReactNode;
}

export function Sidebar(props: SidebarProps): React.ReactElement | null {
	let startExpanded = false;
	if (!props.startExpanded) {
		startExpanded = false;
	} else {
		startExpanded = props.startExpanded;
	}

	const [isExpanded, setIsExpanded] = useState<boolean>(startExpanded);

	function toggleExpand() {
		setIsExpanded(!isExpanded);
	}

	function detailOnClick() {
		console.log("Detail clicked");
	}

	if (!props.isOpen) {
		return null;
	}

	return (
		<Box extendedClass={`${styles.SidebarContainer} ${isExpanded ? styles.SidebarContainerExpanded : ""}`}>
			<Box extendedClass={styles.Sidebar}>
				<Box extendedClass={styles.SidebarHeader}>
					<Paper extendedClass={styles.SidebarPaper}>
						<Box extendedClass={styles.SidebarHeaderButtonBox}>
							<Button extendedClass="standard-button" onClick={detailOnClick} variant="contained" sx={actionButtonSx}>
								<Icon icon={MoreVertIcon} />
							</Button>
							<Button extendedClass="standard-button" onClick={toggleExpand} variant="contained" sx={actionButtonSx}>
								<Icon icon={isExpanded ? CloseFullscreenIcon : OpenInFullIcon} />
							</Button>
							<Button extendedClass="standard-button" onClick={props.onClose} variant="contained" sx={actionButtonSx}>
								<Icon icon={CloseIcon} />
							</Button>
						</Box>
						{props.headerContents}
					</Paper>
				</Box>
				<Box extendedClass={styles.SidebarBody}>
					<Paper extendedClass={styles.SidebarPaper}>{props.bodyContents}</Paper>
				</Box>
			</Box>
		</Box>
	);
}

const actionButtonSx = {
	padding: "0.5rem",
	marginLeft: "0.25rem",
	marginRight: "0.25rem",
	minWidth: "2rem",
};
