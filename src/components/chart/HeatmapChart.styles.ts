import styled from '@emotion/styled';
import { appTheme } from "scichart-example-dependencies";

export const Container = styled.div`
    width: 1000px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${appTheme.DarkIndigo};
`;

export const ControlsContainer = styled.div`
    position: relative;
    padding: 3px;
    gap: 8px;
    width: 100%;
    color: ${appTheme.ForegroundColor};
`;

export const Button = styled.button`
    cursor: pointer;
    height: 55px;
    margin: 5px;
`;

export const HeatmapChartContainer = styled.div`
    position: relative;
`;

export const HeatmapChart = styled.div`
    width: 100%;
    height: 100%;
`;

export const HeatmapLegendContainer = styled.div`
    position: absolute;
    height: 90%;
    width: 100px;
    bottom: 700px;
    margin: 20px;
`;
