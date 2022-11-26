import { useState, useRef, useEffect } from "react";
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

const HowDoesItWork = () => {
  return (
    <div className="how-does-it-work">
      <h3>How does this work?</h3>
      <div>
        <figure>
          <img
            alt="wiki"
            height={200}
            width={200}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Pi_30K.gif/440px-Pi_30K.gif"
          />
          <figcaption>Monte Carlo method for estimating Pi</figcaption>
        </figure>

        <div>
          <p>
            Given a square with a squadrant inside of it, uniformly scatter a
            given number of points <i>n</i> over the square.
          </p>
          <p>
            The ratio of the inside-count and the total-sample-count is an
            estimate of the ratio of the two areas times 4 equals to estimate π.
          </p>
        </div>
      </div>

      <div>
        <div>
          <p>
            By the{" "}
            <a href="https://en.wikipedia.org/wiki/Law_of_large_numbers">
              law of large numbers (LLN),
            </a>{" "}
            the larger the number of <i>n</i>, the closer the pi estimation to
            actual value of π.
          </p>
          <p>
            Try different value of <i>n</i>, and try it by yourself!
          </p>
        </div>
        <figure>
          <img
            alt="Law of large numbers"
            height={200}
            width={300}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Lawoflargenumbers.svg/1920px-Lawoflargenumbers.svg.png"
          />
          <figcaption>LLN for rolls of a single dice</figcaption>
        </figure>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="footer">
      <div className="citations">
        <h4>Citations & Sources</h4>
        <a href="https://en.wikipedia.org/wiki/Monte_Carlo_method">
          <p>Monte Carlo Method - Wikipedia</p>
        </a>
        <a href="https://en.wikipedia.org/wiki/Law_of_large_numbers">
          <p>Law of Large Numbers - Wikipedia</p>
        </a>
      </div>
      <div className="readmore">
        <h4>Read more about Monte Carlo Method!</h4>
        <a href="https://www.jstor.org/stable/2686489">
          <p>
            Determining Sample Sizes for Monte Carlo Integration. Neal, David.
            1993
          </p>
        </a>
        <a href="https://blogs.sas.com/content/iml/2016/03/14/monte-carlo-estimates-of-pi.html">
          <p>Monte Carlo estimates of pi and an important statistical lesson | Blog SAS</p>
        </a>
      </div>
    </div>
  );
};

function App() {
  let [numberOfPoints, setNumberOfPoints] = useState(0);
  let [points, setPoints] = useState<Array<AxisXY>>([]);

  return (
    <div className="App">
      <h3>Monte Carlo Method</h3>
      <h4>for Pi Estimation</h4>
      <div className="App-content">
        <Axis data={points} />

        <div className="inputPoints">
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
      </div>

      <hr color="#4153C9" style={{ height: 5 }} />
      <HowDoesItWork />

      <Footer />
    </div>
  );
}

export default App;
