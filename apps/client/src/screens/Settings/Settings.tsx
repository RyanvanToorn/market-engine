import { Box } from "@components/Box/Box";
import { Divider } from "@components/Divider/Divider";
import { Icon } from "@components/Icon/Icon";
import { Paper } from "@components/Paper/Paper";
import { TextField } from "@components/TextField/TextField";
import { ToggleButton } from "@components/ToggleButtonGroup/ToggleButton";
import { ToggleButtonGroup } from "@components/ToggleButtonGroup/ToggleButtonGroup";
import { Typography } from "@components/Typography/Typography";
import { useAppSettings } from "@context/AppSettingsContext";
import { useBasicLayout } from "@layouts/BasicLayout";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useEffect } from "react";
import styles from "./Settings.module.css";

export function Settings(): React.ReactElement | null {
	const { setLayout } = useBasicLayout();
	const { settings, updateSettings } = useAppSettings();

	useEffect(() => {
		setLayout((prev) => ({
			...prev,
			title: "Settings",
		}));
	}, [setLayout]);

	const labels = {
		coinCapApiKey: "Coin Cap API Key",
		alphaVantageApiKey: "Alpha Vantage API Key",
		themePreference: "Theme Preference",
		integrations: "Integrations",
		light: "Light",
		dark: "Dark",
		system: "System",
		settings: "Settings",
	};

	const fontSx = {
		fontFamily: "'Fjalla One', sans-serif",
	};

	const settingRowSx = {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	};

	return (
		<Box extendedClass={styles.Settings}>
			<Paper
				extendedClass={styles.SettingsPaper}
				sx={{
					borderRadius: "0rem",
					backgroundColor: "background.paper",
				}}
			>
				<form className={styles.SettingsForm}>
					<Box extendedClass={styles.SettingsHeading}>
						<Typography text={labels.settings} variant="h4" sx={fontSx} />
					</Box>

					<Divider orientation="horizontal" variant="fullWidth" flexItem />

					<Box extendedClass={styles.SettingsSubHeading}>
						<Typography text={labels.integrations} variant="h5" sx={fontSx} />
					</Box>

					<Box extendedClass={styles.SettingsFormRow} sx={settingRowSx}>
						<TextField
							extendedClass={styles.SettingsTextField}
							label={labels.alphaVantageApiKey}
							value={settings.apiKeys.alphaVantageKey ?? ""}
							onChange={(event: any) => {
								const value = event.target.value as string;
								updateSettings({
									apiKeys: {
										...settings.apiKeys,
										alphaVantageKey: value,
									},
								});
							}}
						/>
					</Box>

					<Box extendedClass={styles.SettingsFormRow} sx={settingRowSx}>
						<TextField
							extendedClass={styles.SettingsTextField}
							label={labels.coinCapApiKey}
							value={settings.apiKeys.coinCapKey ?? ""}
							onChange={(event: any) => {
								const value = event.target.value as string;
								updateSettings({
									apiKeys: {
										...settings.apiKeys,
										coinCapKey: value,
									},
								});
							}}
						/>
					</Box>

					<Divider orientation="horizontal" variant="fullWidth" flexItem />

					<Box extendedClass={styles.SettingsSubHeading}>
						<Typography text={labels.themePreference} variant="h5" sx={fontSx} />
					</Box>

					<Box extendedClass={styles.SettingsFormRow}>
						<ToggleButtonGroup
							exclusive={true}
							value={settings.themeMode}
							onChange={(_, value) => {
								if (value === null) return;
								updateSettings({ themeMode: value });
							}}
						>
							<ToggleButton
								value={"light"}
								contents={
									<>
										<Typography text={labels.light} extendedClass={styles.SettingsToggleButtonText} sx={fontSx} />
										<Icon icon={LightModeIcon} extendedClass={styles.SettingsToggleButtonIcon} />
									</>
								}
							/>

							<ToggleButton
								value={"dark"}
								contents={
									<>
										<Typography text={labels.dark} extendedClass={styles.SettingsToggleButtonText} sx={fontSx} />
										<Icon icon={DarkModeIcon} extendedClass={styles.SettingsToggleButtonIcon} />
									</>
								}
							/>

							<ToggleButton
								value={"system"}
								contents={
									<>
										<Typography text={labels.system} extendedClass={styles.SettingsToggleButtonText} sx={fontSx} />
										<Icon icon={AutoModeIcon} extendedClass={styles.SettingsToggleButtonIcon} />
									</>
								}
							/>
						</ToggleButtonGroup>
					</Box>
				</form>
			</Paper>
		</Box>
	);
}
