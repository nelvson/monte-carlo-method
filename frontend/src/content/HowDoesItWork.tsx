import React from "react";

export default function HowDoesItWork() {
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
}
