import React from "react";
import { render } from "react-dom";
// Import Highcharts
import Highcharts from "highcharts/highstock";
//import HighchartsReact from "./HighchartsReact.min.js";
import HighchartsReact from "highcharts-react-official";

(function(H) {
  H.Pointer.prototype.reset = function() {
    return undefined;
  };

  /**
   * Highlight a point by showing tooltip, setting hover state and draw crosshair
   */
  H.Point.prototype.highlight = function(event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
  };

  H.syncExtremes = function(e) {
    var thisChart = this.chart;

    if (e.trigger !== "syncExtremes") {
      // Prevent feedback loop
      Highcharts.each(Highcharts.charts, function(chart) {
        if (chart && chart !== thisChart) {
          if (chart.xAxis[0].setExtremes) {
            // It is null while updating
            chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
              trigger: "syncExtremes"
            });
          }
        }
      });
    }
  };
})(Highcharts);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
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
      },
      options2: {
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
      }
    };
  }

  componentDidMount() {
    ["mousemove", "touchmove", "touchstart"].forEach(function(eventType) {
      document
        .getElementById("container")
        .addEventListener(eventType, function(e) {
          var chart, point, i, event;

          for (i = 0; i < Highcharts.charts.length; i = i + 1) {
            chart = Highcharts.charts[i];
            if (chart) {
              // Find coordinates within the chart
              event = chart.pointer.normalize(e);
              // Get the hovered point
              point = chart.series[0].searchPoint(event, true);

              if (point) {
                point.highlight(e);
              }
            }
          }
        });
    });
  }

  inputChange(e) {
    this.setState({
      options: {
        series: [{ data: [1, 1, 1] }, { data: [2, 2, 2] }]
      }
    });
  }

  render() {
    return (
      <div id="container">
        <HighchartsReact
          constructorType={"chart"}
          highcharts={Highcharts}
          options={this.state.options}
        />
        <HighchartsReact
          constructorType={"chart"}
          highcharts={Highcharts}
          options={this.state.options2}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
