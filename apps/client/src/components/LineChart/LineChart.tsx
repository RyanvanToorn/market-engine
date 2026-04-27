import type { StandardComponentProps } from "@interfaces/standard-component-props";
import { type LineSeries, LineChart as MUILineChart } from "@mui/x-charts/LineChart";
import styles from "./LineChart.module.css";

export interface LineChartProps extends StandardComponentProps {
	series: LineSeries[];
	axisHighlight?: {
		x?: "band" | "line" | "none";
		y?: "band" | "line" | "none";
	};
	grid?: {
		horizontal?: boolean;
		vertical?: boolean;
	};
	height?: number;
	width?: number;
	loading?: boolean;
}

export function LineChart(props: LineChartProps): React.ReactElement | null {
	if (props.isVisible === false) {
		return null;
	}

	return (
		<MUILineChart
			series={props.series}
			axisHighlight={props.axisHighlight}
			grid={props.grid}
			height={props.height}
			width={props.width}
			loading={props.loading}
			className={`${styles.LineChart} ${props.extendedClass ? props.extendedClass : ""}`}
		/>
	);
}
