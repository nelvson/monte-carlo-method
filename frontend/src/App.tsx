import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

import { appendUrlQuery, fetch } from "./helper";

function calc(data: Array<AxisXY>) {
  let circlePoints = 0;

  data.forEach((datum) => {
    let d = datum.x * datum.x + datum.y * datum.y;
    if (d <= 1) {
      circlePoints++;
    }
  });

  console.log((4 * circlePoints) / data.length);
}

type AxisXY = { x: number; y: number };

function Axis(props: { data: Array<AxisXY> }) {
  let { data } = props;
  const ref = useRef(null);

  useEffect(() => {
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, 200]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([200, 0]);
    const svgElement = d3
      .select(ref.current)
      .attr("width", 400)
      .attr("height", 400);
    const axisGenerator = d3.axisBottom(xScale);
    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement
      .append("g")
      .call(axisGenerator)
      .attr("transform", "translate(0, 200)");
    svgElement.append("g").call(yAxisGenerator);

    data.forEach((datum) => {
      let color = 'red';
      let d = datum.x * datum.x + datum.y * datum.y;
      if (d <= 1) {
        color = 'green';
      }
      svgElement
        .append("circle")
        .attr("cx", xScale(datum.x))
        .attr("cy", yScale(datum.y))
        .attr("r", 2)
        .attr('fill', color);
    });
  }, [data]);

  return <svg ref={ref} />;
}

function App() {
  let [numberOfPoints, setNumberOfPoints] = useState(0);
  let [points, setPoints] = useState<Array<AxisXY>>([]);

  return (
    <div className="App">
      <header className="App-header">
        <Axis data={points} />
        <input
          type="number"
          id="numberOfPoints"
          name="numberOfPoints"
          value={numberOfPoints}
          onChange={(e) => {
            const val = e.target.value;

            if (Number.isNaN(Number(val))) {
              setNumberOfPoints(0);
            } else {
              setNumberOfPoints(Number(val));
            }
          }}
          placeholder="Number of Points"
        />

        <button
          onClick={async () => {
            d3.selectAll("circle").attr("r", 0);

            let fetchData: {
              status: string;
              data: Array<AxisXY>;
              message: string;
            } = await fetch(
              appendUrlQuery("/generatePoints", {
                numberOfPoints,
              })
            ); //TODO:handle error

            setPoints(fetchData.data);
            calc(fetchData.data);
          }}
        >
          fetch
        </button>
      </header>
    </div>
  );
}

export default App;
