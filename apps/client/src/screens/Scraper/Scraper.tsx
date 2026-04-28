import { Box } from "@components/Box/Box";
import { Paper } from "@components/Paper/Paper";
import { Typography } from "@components/Typography/Typography";
import styles from "./Scraper.module.css";
import { IconButton } from "@components/IconButton/IconButton";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StopIcon from '@mui/icons-material/Stop';

/** Stop the scraper */
function stopScraper() {
	console.log("Stopping scraper...");
}

/** Start the scraper */
function startScraper() {
	console.log("Starting scraper...");
}

/** Restart the scraper */
function restartScraper() {
	console.log("Restarting scraper...");
}

function ScraperControls(): React.ReactElement {
	return (
	<Box extendedClass={styles.ScraperControls}>
		<IconButton onClick={stopScraper} aria-label="Stop scraper">
			<StopIcon />
		</IconButton>
		
		<IconButton onClick={startScraper} aria-label="Start scraper">
			<PlayArrowIcon />
		</IconButton>

		<IconButton onClick={restartScraper} aria-label="Restart scraper">
			<RestartAltIcon />
		</IconButton>
	</Box>);
}



export function Scraper(): React.ReactElement | null {
	const fontSx = {
		fontFamily: "'Fjalla One', sans-serif",
	};


	return (
		<Box extendedClass={styles.Scraper}>
			<Paper
				extendedClass={styles.ScraperPaper}
				sx={{
					borderRadius: "0rem",
					backgroundColor: "background.paper",
				}}
			>
				<form className={styles.ScraperForm}>
					<Box extendedClass={styles.ScraperHeading}>
						<Typography text={"Scraper"} variant="h4" sx={fontSx} />
						<ScraperControls />
					</Box>

					<Box extendedClass={styles.ScraperConsole}>
						<Box extendedClass={styles.ScraperConsoleHeading}>
							<Typography text={"Console"} variant="h6" sx={fontSx} />
						</Box>
						<Box extendedClass={styles.ScraperConsoleConsole}></Box>
					</Box>

					

					<Box extendedClass={styles.ScraperSettings}>
						<Box extendedClass={styles.ScraperSettingsRow}>

						</Box>

						<Box extendedClass={styles.ScraperSettingsRow}>

						</Box>

						<Box extendedClass={styles.ScraperSettingsRow}>

						</Box>
					</Box>
				</form>
			</Paper>
		</Box>
	);
}
