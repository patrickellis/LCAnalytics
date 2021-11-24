import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const numberToMonth = {
  '1' : 'Jan',
  '2' : 'Feb',
  '3' : 'Mar',
  '4' : 'Apr',
  '5' : 'May',
  '6' : 'Jun',
  '7' : 'Jul',
  '8' : 'Aug',
  '9' : 'Sep',
  '10' : 'Oct',
  '11' : 'Nov',
  '12' : 'Dec',
}
const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(0)}%`;

const getPercent = (value, total) => {
  const ratio = total > 0 ? value / total : 0;

  return toPercent(ratio, 2);
};

const renderTooltipContent = (o) => {
  const { payload, label } = o;
  const total = payload.reduce((result, entry) => result + entry.value, 0);
  var labeltest = label?label.split('.'):[];
  if(labeltest.length){
    labeltest[0] = numberToMonth[labeltest[0]];
    if(labeltest[1].length == 1) 
      labeltest[1] = '0'.concat(labeltest[1]);
    
      labeltest = labeltest[0] + ' ' + labeltest[1];
  }
  return (
    <div className="customized-tooltip-content">
      <div className="tooltip-content">
        <p style={{color:'#6973a1',fontWeight:'bold'}} className="total">{`${labeltest}`}</p>
          
          {payload.map((entry, index) => (
            <div class="payloadentry" key={`item-${index}`} style={entry.name=='Solved'?index==1?{marginBotton:'1rem',color: 'rgb(24, 189, 155)' }:{color: 'rgb(24, 189, 155)' }:{color: 'rgb(229, 71, 135)'}}>
              <span style={{color:'#233075',fontWeight:'bold'}} class="tooltipVal">{`${entry.value}`}</span><br/><span style={{color:'#6973a1',fontWeight:'bold'}}class="tooltipItem">{`${entry.name}`}</span>
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
         animationDuration={4000}
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
          <Area type="monotone" dataKey="Solved" stackId="1" stroke="#8884d8" fill="rgb(24, 189, 155)" />
          
          <Area type="monotone" dataKey="Remaining" stackId="1" stroke="#ffc658" fill="rgb(229, 71, 135)" />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    );
  }
}
