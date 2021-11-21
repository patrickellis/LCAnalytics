import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';



export default class RadarChartCustom extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-radar-chart-rjoc6';

  render() {
    return (
        <div class="radarContainer">
          <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={this.props.data}>
              <PolarGrid background={{fill: 'rgb(0,0,0)'}}/>
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis />
              <Radar name="Mike" dataKey="count" stroke="#88abf5" fill="#ecf1fe" fillOpacity={0.5} />
              </RadarChart>
          </ResponsiveContainer>
      </div>
    );
  }
}
