import React from "react";

export default function Footer() {
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
          <p>
            Monte Carlo estimates of pi and an important statistical lesson |
            Blog SAS
          </p>
        </a>
      </div>
    </div>
  );
}
