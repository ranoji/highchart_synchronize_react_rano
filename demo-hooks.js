import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

(function(H) {
  H.Pointer.prototype.reset = function() {
    return undefined;
  };

  H.Point.prototype.highlight = function(event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver();
    this.series.chart.tooltip.refresh(this);
    this.series.chart.xAxis[0].drawCrosshair(event, this);
  };

  H.syncExtremes = function(e) {
    var thisChart = this.chart;

    if (e.trigger !== "syncExtremes") {
      Highcharts.each(Highcharts.charts, function(chart) {
        if (chart && chart !== thisChart) {
          if (chart.xAxis[0].setExtremes) {
            chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
              trigger: "syncExtremes"
            });
          }
        }
      });
    }
  };
})(Highcharts);

const App = () => {
  const [options, setOptions] = useState({
    chart: {
      type: "line",
      zoomType: "x",
      panning: true,
      panKey: "shift"
    },
    xAxis: {
      events: {
        setExtremes: function(e) {
          Highcharts.syncExtremes(e);
        }
      }
    },
    series: [
      {
        data: [
          29.9,
          71.5,
          106.4,
          129.2,
          144.0,
          176.0,
          135.6,
          148.5,
          216.4,
          194.1,
          95.6,
          54.4
        ]
      }
    ]
  });

  const [options2, setOptions2] = useState({
    chart: {
      zoomType: "x"
    },
    series: [
      {
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      }
    ],
    xAxis: {
      events: {
        setExtremes: function(e) {
          Highcharts.syncExtremes(e);
        }
      }
    }
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const eventTypes = ["mousemove", "touchmove", "touchstart"];
      const handleChartPointHighlight = (chart, event) => {
        const normalizedEvent = chart.pointer.normalize(event);
        const point = chart.series[0].searchPoint(normalizedEvent, true);
        if (point) {
          point.highlight(event);
        }
      };

      eventTypes.forEach((eventType) => {
        document.getElementById("container").addEventListener(eventType, (event) => {
          Highcharts.charts.forEach((chart) => {
            if (chart) {
              handleChartPointHighlight(chart, event);
            }
          });
        });
      });
    };

    handleMouseMove();

    return () => {
      const eventTypes = ["mousemove", "touchmove", "touchstart"];
      eventTypes.forEach((eventType) => {
        document.getElementById("container").removeEventListener(eventType);
      });
    };
  }, []);

  const inputChange = () => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      series: [{ data: [1, 1, 1] }, { data: [2, 2, 2] }]
    }));
  };

  return (
    <div id="container">
      <HighchartsReact
        constructorType={"chart"}
        highcharts={Highcharts}
        options={options}
      />
      <HighchartsReact
        constructorType={"chart"}
        highcharts={Highcharts}
        options={options2}
      />
    </div>
  );
};

render(<App />, document.getElementById("root"));
