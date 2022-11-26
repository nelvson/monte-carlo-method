import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

import "./App.css";

import HowDoesItWork from "./content/HowDoesItWork"
import Footer from './content/Footer';
import { appendUrlQuery, fetch } from "./helper";

function calc(data: Array<AxisXY>) {
  let circlePoints = 0;

  data.forEach((datum) => {
    let d = datum.x * datum.x + datum.y * datum.y;
    if (d <= 1) {
      circlePoints++;
    }
  });

  const totalPointsNode = document.getElementById("totalPointsNode");
  const inside = document.getElementById("pointsInside");
  const out = document.getElementById("piEstimation");

  if (!inside) return;
  if (!out) return;
  if (!totalPointsNode) return;

  totalPointsNode.innerHTML = String(data.length);
  out.innerHTML = String((4 * circlePoints) / data.length);
  inside.innerHTML = String(circlePoints ? circlePoints : 0);
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

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(90);
    arcGenerator({
      endAngle: Math.PI / 2,
      startAngle: -Math.PI / 2,
      innerRadius: 0,
      outerRadius: 100,
    });

    svgElement
      .append("path")
      .attr(
        "d",
        d3.arc()({
          endAngle: Math.PI / 2,
          startAngle: 0,
          innerRadius: 0,
          outerRadius: 200,
        })
      )
      .attr("fill", "#F5FFF5")
      .style("stroke", "#6B6565")
      .attr("transform", "translate(0,200)");

    const xAxisGenerator = d3.axisBottom(xScale);
    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement
      .append("g")
      .call(xAxisGenerator)
      .attr("transform", "translate(0, 200)");
    svgElement.append("g").call(yAxisGenerator).attr("transform");

    data.forEach((datum) => {
      let color = "red";
      let d = datum.x * datum.x + datum.y * datum.y;
      if (d <= 1) {
        color = "green";
      }
      svgElement
        .append("circle")
        .attr("cx", xScale(datum.x))
        .attr("cy", yScale(datum.y))
        .attr("r", 2)
        .attr("fill", color);
    });
  }, [data]);

  return <svg ref={ref} />;
}

function App() {
  let [numberOfPoints, setNumberOfPoints] = useState(0);
  let [points, setPoints] = useState<Array<AxisXY>>([]);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    calc(points);
  }, [points]);

  return (
    <div className="App">
      <h3>Monte Carlo Method</h3>
      <h4>for Pi Estimation</h4>
      <div className="App-content">
        <Axis data={points} />

        <div className="inputPoints">
          <p>Enter a number ( n {'>'} 0),then click Generate Points to randomly generated points</p>
          <div>
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
              disabled={loading}
              onClick={() => {
                setLoading(true);
                d3.selectAll("circle").attr("r", 0);
                setPoints([]);
                let forFetch = [];

                for (let i = 0; numberOfPoints / 200 > i; i++) {
                  let currentLength = numberOfPoints - 200 * i;
                  forFetch.push(
                    fetch(
                      appendUrlQuery("/generatePoints", {
                        numberOfPoints:
                          200 * (i + 1) > numberOfPoints ? currentLength : 200,
                      })
                    )
                  );
                }

                Promise.all(forFetch).then(
                  (
                    data: Array<{
                      status: string;
                      data: Array<AxisXY>;
                      message: string;
                    }>
                  ) => {
                    data.forEach(({ data }) => {
                      setPoints((prevData) => {
                        let newArr = [...prevData];
                        newArr.push(...data);
                        return newArr;
                      });
                    });
                  }
                );

                setLoading(false);
              }}
            >
              Generate Points
            </button>
          </div>

          <div>
            {loading ? (
              <img
                width={20}
                height={20}
                alt="spinner from wikimedia"
                src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif?20170503175831"
              />
            ) : (
              <div>
                <text>
                  n: <text id="totalPointsNode" />{" "}
                </text>
                <text>
                  number of points inside circle: <text id="pointsInside" />
                </text>
                <text>
                  pi estimation: <text id="piEstimation" />
                </text>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr color="#4153C9" style={{ height: 5 }} />
      <HowDoesItWork />

      <Footer />
    </div>
  );
}

export default App;
