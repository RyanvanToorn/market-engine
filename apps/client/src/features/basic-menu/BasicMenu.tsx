import { Box } from "@components/Box/Box";
import { Button } from "@components/Button/Button";
import { Icon } from "@components/Icon/Icon";
import { Menu } from "@components/Menu/Menu";
import { MenuItem } from "@components/MenuItem/MenuItem";
import { Typography } from "@components/Typography/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import { useState } from "react";
import styles from "./BasicMenu.styles.module.css";

export interface BasicMenuItem {
	label: string;
	icon?: React.ElementType<SvgIconProps>;
	onClick?: () => void;
}

export interface BasicMenuProps {
	menuItems: BasicMenuItem[];
}

export function BasicMenu(props: BasicMenuProps): React.ReactElement | null {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	function toggleMenu() {
		setIsMenuOpen(!isMenuOpen);
	}

	function closeMenu() {
		setIsMenuOpen(false);
	}

	return (
		<>
			<Button onClick={toggleMenu} variant="contained">
				<Icon icon={MenuIcon} />
			</Button>
			<Menu isOpen={isMenuOpen} onClose={closeMenu}>
				{props.menuItems.map((menuItem, index) => (
					<MenuItem
						key={`${menuItem.label}-${index}`}
						extendedClass={styles.MenuItem}
						contents={
							<Box
								extendedClass={styles.MenuItemBox}
								onClick={() => {
									menuItem.onClick?.();
									closeMenu();
								}}
							>
								{menuItem.icon ? <Icon icon={menuItem.icon} /> : null}
								<Typography text={menuItem.label} />
							</Box>
						}
					/>
				))}
			</Menu>
		</>
	);
}
