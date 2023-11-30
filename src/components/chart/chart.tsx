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
    zeroArray2D,
    HeatmapLegend,
    CursorModifier
} from "scichart";
import { mockData } from "./mockdata.js"
const divElementId = "chart";
const divHeatmapLegend = "heatmapLegend";
const MAX_SERIES = 100;
const WIDTH = 600;
const HEIGHT = 300;

// Draws a Heatmap chart in real-time over the <div id={divElementId}>
const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Add XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    const initialZValues: number[][] = generateExampleData(WIDTH, HEIGHT, 200, 16.5, MAX_SERIES);
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: initialZValues
    });

    // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
    // HeatmapDataSeries which correspond to gradient stops at 0..1
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
        // Optional properties to configure what parts are shown
        showTooltip: true,
        showAxisLabels: true,
        showXLine: true,
        showYLine: true,
        // How close to a datapoint to show the tooltip? 10 = 10 pixels. 0 means always
        // Optional properties to configure the axis labels
        axisLabelFill: "#b36200",
        axisLabelStroke: "#fff",
        // Optional properties to configure line and tooltip style
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
                    lineItems.push(`time: ${updateIndex / 16.5}`);
                }
            });

            return lineItems;
        }
    });

    sciChartSurface.chartModifiers.add(cursorModifier);

    // Functions for running the example in real-time
    let timerId: number | undefined;
    let updateIndex: number = 0;
    let time: number = 0;

    const updateChart = () => {
        time = time + 1;
        // Cycle through pre-generated data on timer tick
        const newZValues = generateExampleData(WIDTH, HEIGHT, 200, updateIndex += 16.5, MAX_SERIES);
        // Update the heatmap z-values
        heatmapDataSeries.setZValues(newZValues);
        if (updateIndex >= MAX_SERIES) {
            updateIndex = 0;
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

// This function generates data for the heatmap series example
// because data-generation is not trivial, we generate once before the example starts
// so you can see the speed & power of SciChart.js
function generateExampleData(
    width: number,
    height: number,
    cpMax: number,
    index: number,
    maxIndex: number
): number[][] {
    // Returns a 2-dimensional javascript array [height (y)] [width (x)] size
    const zValues = zeroArray2D([height, width]);


    // math.round but to X digits
    function roundTo(number: number, digits: number) {
        return number;
        // return parseFloat(number.toFixed(digits));
    }

    const angle = roundTo(Math.PI * 2 * index, 3) / maxIndex;

    // When appending data to a 2D Array for the heatmap, the order of appending (X,Y) does not matter
    // but when accessing the zValues[][] array, we set data [y] then [x]
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const v =
                (1 + roundTo(Math.sin(x * 0.04 + angle), 3)) * 50 +
                (1 + roundTo(Math.sin(y * 0.1 + angle), 3)) * 50 * (1 + roundTo(Math.sin(angle * 2), 3));
            const cx = width / 2;
            const cy = height / 2;
            const r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
            const exp = Math.max(0, 1 - r * 0.008);
            const zValue = v * exp + Math.random() * 10;
            zValues[y][x] = zValue > cpMax ? cpMax : zValue;
        }
    }
    return zValues;
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function HeatmapChart() {
    const controlsRef = React.useRef({
        startDemo: () => { },
        stopDemo: () => { }
    });
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const heatmapLegendRef = React.useRef<HeatmapLegend>();
    const [stats, setStats] = React.useState({ xSize: 0, ySize: 0, fps: 0 });

    React.useEffect(() => {
        const chartInitializationPromise = Promise.all([drawExample(), drawHeatmapLegend()]).then(([res, legend]) => {
            sciChartSurfaceRef.current = res.sciChartSurface;
            heatmapLegendRef.current = legend;
            controlsRef.current = res.controls;

            // Handle drawing/updating FPS
            let lastRendered = Date.now();
            res.sciChartSurface.rendered.subscribe(() => {
                const currentTime = Date.now();
                const timeDiffSeconds = new Date(currentTime - lastRendered).getTime() / 1000;
                lastRendered = currentTime;
                const fps = 1 / timeDiffSeconds;
                setStats({
                    xSize: res.heatmapDataSeries.arrayWidth,
                    ySize: res.heatmapDataSeries.arrayHeight,
                    fps
                });
            });
            res.controls.startDemo();
        });

        // Delete sciChartSurface on unmount component to prevent memory leak
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
        <React.Fragment>
            <div>
                <div style={{
                    width: "1000px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: appTheme.DarkIndigo
                }}>
                    <div style={{
                        display: "flex",
                        flex: "auto",
                        flexBasis: "70px",
                        padding: 3,
                        gap: 8,
                        width: "100%",
                        color: appTheme.ForegroundColor

                    }}>
                        <button
                            onClick={() => controlsRef.current.startDemo()}
                        >
                            Start
                        </button>
                        <button
                            onClick={() => controlsRef.current.stopDemo()}
                        >
                            Stop
                        </button>
                        <span style={{ margin: 12, minWidth: "200px" }}>
                            Heatmap chart
                        </span>
                        <span style={{ margin: 12 }}>FPS: {stats.fps.toFixed(0)}</span>
                    </div>
                    <div style={{ position: "relative" }}>
                        <div id={divElementId} style={{ width: "100%", height: "100%" }}></div>
                        <div
                            id={divHeatmapLegend}
                            style={{
                                position: "absolute",
                                height: "90%",
                                width: "100px",
                                top: 0,
                                right: "75px",
                                margin: "20"
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
