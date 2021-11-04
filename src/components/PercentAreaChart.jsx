import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    {date: 'Mon Aug 09 2021', remaining: 91, solved: 0},
    {date: 'Mon Aug 09 2021', remaining: 91, solved: 23},
    {date: 'Mon Aug 09 2021', remaining: 91, solved: 34}
  
];

const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(0)}%`;

const getPercent = (value, total) => {
  const ratio = total > 0 ? value / total : 0;

  return toPercent(ratio, 2);
};

const renderTooltipContent = (o) => {
  const { payload, label } = o;
  const total = payload.reduce((result, entry) => result + entry.value, 0);

  return (
    <div className="customized-tooltip-content">
      <div className="tooltip-content">
        <p className="total">{`${label}`}</p>
        
          {payload.map((entry, index) => (
            <div key={`item-${index}`} style={entry.name=='Solved'?{ color: 'rgb(24, 189, 155)' }:{color: 'rgb(229, 71, 135)'}}>
              <span class="tooltipItem">{`${entry.name}:`}</span><span class="tooltipVal">{`${entry.value}`}</span>
            </div>
          ))}
        
        </div>
    </div>
  );
};

export default class PercentAreaChart extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/percent-stacked-area-chart-pelcs';

  render() {
    return (
        <div class="pieChartContainer">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={this.props.data}
          stackOffset="expand"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={toPercent} />
          <Tooltip content={renderTooltipContent} />
          <Area type="monotone" dataKey="Solved" stackId="1" stroke="#8884d8" fill="rgb(24, 189, 155)" />
          
          <Area type="monotone" dataKey="Remaining" stackId="1" stroke="#ffc658" fill="rgb(229, 71, 135)" />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    );
  }
}
