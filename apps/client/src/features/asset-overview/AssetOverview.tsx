import { Box } from "@components/Box/Box";
import { IconButton } from "@components/IconButton/IconButton";
import { LineChart } from "@components/LineChart/LineChart";
import { Paper } from "@components/Paper/Paper";
import { Typography } from "@components/Typography/Typography";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { LineSeries } from "@mui/x-charts/LineChart";
import { useTimeSeriesDailyQuery, useTimeSeriesMonthlyQuery, useTimeSeriesWeeklyQuery } from "@query/cached-api-controller-methods";
import type { TimeSeriesData } from "@services/alpha-vantage-client";
import type { AssetType } from "@type/asset-type";
import { useEffect } from "react";
import * as Styles from "./AssetOverview.styles";

/* Parity needs to be ensured with AssetTypes from src/types/AssetTypes */
function toLineSeries(data: TimeSeriesData | undefined): LineSeries[] {
	if (!data?.timeSeries) return [];
	const sorted = Object.entries(data.timeSeries).sort(([a], [b]) => a.localeCompare(b));
	return [{ data: sorted.map(([, point]) => point.close) }];
}

export interface AssetOverviewProps {
	/** The asset's type */
	assetType: AssetType;
	/** The asset's unique identifier @example symbol value or coin name */
	symbol: string;
	/** The asset's name */
	name: string | undefined;
	/** The asset's description */
	description?: string;
}

export function AssetOverview(props: AssetOverviewProps): React.ReactElement | null {
	const timeSeriesDailyQuery = useTimeSeriesDailyQuery({
		assetSymbol: props.symbol,
		assetType: props.assetType,
		enabled: false,
	});
	const timeSeriesWeeklyQuery = useTimeSeriesWeeklyQuery({
		assetSymbol: props.symbol,
		assetType: props.assetType,
		enabled: false,
	});
	const timeSeriesMonthlyQuery = useTimeSeriesMonthlyQuery({
		assetSymbol: props.symbol,
		assetType: props.assetType,
		enabled: false,
	});

	const { refetch: refetchDaily } = timeSeriesDailyQuery;
	const { refetch: refetchWeekly } = timeSeriesWeeklyQuery;
	const { refetch: refetchMonthly } = timeSeriesMonthlyQuery;

	useEffect(() => {
		if (!props.symbol) return;

		const controller = new AbortController();
		async function fetchSequentially() {
			await refetchDaily();
			if (controller.signal.aborted) return;
			// Wait for the first fetch + 2s to avoid hitting the API rate limit
			await new Promise((resolve) => setTimeout(resolve, 2000));
			await refetchWeekly();
			if (controller.signal.aborted) return;
			// Wait for the first fetch + 2s to avoid hitting the API rate limit
			await new Promise((resolve) => setTimeout(resolve, 2000));
			await refetchMonthly();
		}
		fetchSequentially();
		return () => controller.abort();
	}, [props.symbol, refetchDaily, refetchWeekly, refetchMonthly]);

	const dailySeries = toLineSeries(timeSeriesDailyQuery.data);
	const weeklySeries = toLineSeries(timeSeriesWeeklyQuery.data);
	const monthlySeries = toLineSeries(timeSeriesMonthlyQuery.data);

	function dailyRefresh() {
		timeSeriesDailyQuery.refetch();
		return;
	}

	function weeklyRefresh() {
		timeSeriesWeeklyQuery.refetch();
		return;
	}

	function monthlyRefresh() {
		timeSeriesMonthlyQuery.refetch();
		return;
	}

	return (
		<Box sx={Styles.AssetOverviewRootSx} extendedClass="AssetOverview">
			{props.symbol && (
				<Box extendedClass="TitleRow" sx={Styles.TitleRowSx}>
					<Typography text={`${props.symbol} - ${props.name}`} variant="h5" />
				</Box>
			)}
			{props.symbol && (
				<Box extendedClass="GraphRow" sx={Styles.GraphRowSx}>
					<Paper>
						<Box extendedClass="GraphTitleRow" sx={Styles.GraphTitleRowSx}>
							<Typography text="Daily" sx={Styles.GraphTitleTitleSx} />
							<Box>
								<IconButton id="daily-graph-refresh-btn" onClick={dailyRefresh}>
									<RefreshIcon />
								</IconButton>
								<IconButton id="daily-graph-expand-btn">
									<OpenInFullIcon />
								</IconButton>
							</Box>
						</Box>

						<LineChart series={dailySeries} loading={timeSeriesDailyQuery.isFetching} width={500} height={300} />
					</Paper>

					<Paper>
						<Box extendedClass="GraphTitleRow" sx={Styles.GraphTitleRowSx}>
							<Typography text="Weekly" sx={Styles.GraphTitleTitleSx} />
							<Box>
								<IconButton id="weekly-graph-refresh-btn" onClick={weeklyRefresh}>
									<RefreshIcon />
								</IconButton>
								<IconButton id="weekly-graph-expand-btn">
									<OpenInFullIcon />
								</IconButton>
							</Box>
						</Box>

						<LineChart series={weeklySeries} loading={timeSeriesWeeklyQuery.isPending} width={500} height={300} />
					</Paper>

					<Paper>
						<Box extendedClass="GraphTitleRow" sx={Styles.GraphTitleRowSx}>
							<Typography text="Monthly" sx={Styles.GraphTitleTitleSx} />
							<Box>
								<IconButton id="monthly-graph-refresh-btn" onClick={monthlyRefresh}>
									<RefreshIcon />
								</IconButton>
								<IconButton id="monthly-graph-expand-btn">
									<OpenInFullIcon />
								</IconButton>
							</Box>
						</Box>

						<LineChart series={monthlySeries} loading={timeSeriesMonthlyQuery.isPending} width={500} height={300} />
					</Paper>
				</Box>
			)}
			<Box extendedClass="DetailRow" sx={Styles.DetailRowSx}></Box>
		</Box>
	);
}
