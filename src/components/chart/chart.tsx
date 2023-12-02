import * as React from "react";

import { appTheme } from "scichart-example-dependencies";
import {
    NumericAxis,
    SciChartSurface,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    HeatmapColorMap,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    HeatmapLegend,
    CursorModifier
} from "scichart";
import * as Styles from "./HeatmapChart.styles";

import { mockData1 } from "./mockdata1.js";
import { mockData2 } from "./mockdata2.js";
import { mockData3 } from "./mockdata3.js";
import { mockData4 } from "./mockdata4.js";
import { mockData5 } from "./mockdata5.js";
import { mockData6 } from "./mockdata6.js";
const divElementId = "chart";
const divHeatmapLegend = "heatmapLegend";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const initialZValues: number[][] = mockData1;
    console.log("initialZValues1",initialZValues);
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: initialZValues
    });

    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        useLinearTextureFiltering: false,
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 200,
            gradientStops: [
                { offset: 1, color: appTheme.VividPink },
                { offset: 0.9, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.MutedRed },
                { offset: 0.5, color: appTheme.VividGreen },
                { offset: 0.3, color: appTheme.VividSkyBlue },
                { offset: 0.2, color: appTheme.Indigo },
                { offset: 0, color: appTheme.DarkIndigo }
            ]
        })
    });

    // Add heatmap to the chart
    sciChartSurface.renderableSeries.add(heatmapSeries);

    // Add interaction
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    const cursorModifier = new CursorModifier({
        showTooltip: true,
        showAxisLabels: true,
        showXLine: true,
        showYLine: true,
        axisLabelFill: "#b36200",
        axisLabelStroke: "#fff",
        crosshairStroke: "#ff6600",
        crosshairStrokeThickness: 1,
        tooltipContainerBackground: "#000",
        tooltipTextStroke: "#ff6600",
        tooltipDataTemplate: (seriesInfos) => {
            const lineItems: string[] = [];
            seriesInfos.forEach(si => {
                if (si.isHit) {
                    console.log("seriesInfos=", seriesInfos)
                    lineItems.push(`X: ${si.xValue.toFixed(2)}`);
                    lineItems.push(`Y: ${si.yValue.toFixed(2)}`);
                    lineItems.push(`z- temperature: ${si.zValue.toFixed(2)}`);
                    lineItems.push(`time: ${time}`);
                }
            });

            return lineItems;
        }
    });

    sciChartSurface.chartModifiers.add(cursorModifier);

    let timerId: number | undefined;
    let time: number = 0;

    const updateChart = () => {
        time = time + 1;
        const allMockData = [mockData1, mockData2, mockData3, mockData4, mockData5, mockData6, mockData2, mockData3]
        const newZValues = allMockData[time] ;
        heatmapDataSeries.setZValues(newZValues);
        if (time == 7) {
            time = 0;
            stopDemo();
            return
        }
        timerId = setTimeout(updateChart, 1000);
    };

    const startDemo = () => {
        if (!timerId) {
            updateChart();
        }
    };

    const stopDemo = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };

    return { sciChartSurface, wasmContext, heatmapDataSeries, controls: { startDemo, stopDemo } };
};

// Draws a Heatmap legend over the <div id={divHeatmapLegend}></div>
const drawHeatmapLegend = async () => {
    const { heatmapLegend } = await HeatmapLegend.create(divHeatmapLegend, {
        theme: {
            ...appTheme.SciChartJsTheme,
            sciChartBackground: appTheme.DarkIndigo + "BB",
            loadingAnimationBackground: appTheme.DarkIndigo + "BB"
        },
        yAxisOptions: {
            axisBorder: {
                borderLeft: 1,
                color: appTheme.ForegroundColor + "77"
            },
            majorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 6,
                strokeThickness: 1
            },
            minorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 3,
                strokeThickness: 1
            }
        },
        colorMap: {
            minimum: 0,
            maximum: 200,
            gradientStops: [
                { offset: 1, color: appTheme.VividPink },
                { offset: 0.9, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.MutedRed },
                { offset: 0.5, color: appTheme.VividGreen },
                { offset: 0.3, color: appTheme.VividSkyBlue },
                { offset: 0.2, color: appTheme.Indigo },
                { offset: 0, color: appTheme.DarkIndigo }
            ]
        }
    });

    return heatmapLegend;
};

export default function HeatmapChart() {
    const controlsRef = React.useRef({
        startDemo: () => { },
        stopDemo: () => { }
    });
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const heatmapLegendRef = React.useRef<HeatmapLegend>();

    React.useEffect(() => {
        const chartInitializationPromise = Promise.all([drawExample(), drawHeatmapLegend()]).then(([res, legend]) => {
            sciChartSurfaceRef.current = res.sciChartSurface;
            heatmapLegendRef.current = legend;
            controlsRef.current = res.controls;

  
            res.controls.startDemo();
        });

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                controlsRef.current.stopDemo();
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                controlsRef.current.stopDemo();
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
            });
        };
    }, []);


    return (
        <Styles.Container>
        <Styles.ControlsContainer>
            <Styles.Button onClick={() => controlsRef.current.startDemo()}>Start</Styles.Button>
            <Styles.Button onClick={() => controlsRef.current.stopDemo()}>Stop</Styles.Button>
            <span style={{ margin: 12, minWidth: "200px" }}>Heatmap chart</span>
        </Styles.ControlsContainer>
        <Styles.HeatmapChartContainer>
            <Styles.HeatmapChart id="chart"></Styles.HeatmapChart>
            <Styles.HeatmapLegendContainer id="heatmapLegend"></Styles.HeatmapLegendContainer>
        </Styles.HeatmapChartContainer>
    </Styles.Container>
    );
}
