import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
  {
    subject: 'Math',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Chinese',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'English',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Geography',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Physics',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'History',
    A: 65,
    B: 85,
    fullMark: 150,
  },
  {
    subject: 'Another',
    A: 130
  },
  {
    subject: 'Another2',
    A: 95
  },
  
];

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
