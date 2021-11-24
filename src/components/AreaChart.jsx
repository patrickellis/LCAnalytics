import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
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
const renderTooltipContent = (o) => {
  const { payload, label } = o;
  const total = payload?.reduce((result, entry) => result + entry.value, 0);
  var labeltest = label?label.split('.'):[];
  if(labeltest?.length){
    labeltest[0] = numberToMonth[labeltest[0]];
    if(labeltest[1].length == 1) 
      labeltest[1] = '0'.concat(labeltest[1]);
    
      labeltest = labeltest[0] + ' ' + labeltest[1];
  }
  return (
    <div className="customized-tooltip-content">
      <div className="tooltip-content">
        <p style={{color:'#6973a1',fontWeight:'bold'}} className="total">{`${labeltest}`}</p>
          
          {payload?.map((entry, index) => (
            <div class="payloadentry" key={`item-${index}`} style={entry.name=='Solved'?index==1?{marginBotton:'1rem',color: 'rgb(24, 189, 155)' }:{color: 'rgb(24, 189, 155)' }:{color: 'rgb(229, 71, 135)'}}>
              <span style={{color:'#233075',fontWeight:'bold'}} class="tooltipVal">{`${entry.value}`}</span><br/><span style={{color:'#6973a1',fontWeight:'bold'}}class="tooltipItem">{`${entry.name}`}</span>
            </div>
          ))}
        
        </div>
    </div>
  );
};
export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-area-chart-4ujxw';

  render() {
    return (
      <div class="pieChartContainer statsPage">
        <h1>Progress Tracking</h1>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={this.props.data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >          
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={renderTooltipContent}/>
          <Area type="monotone" dataKey="Solved" stroke="#8884d8" fill="rgb(24, 189, 155)" />
        </AreaChart>      
        </ResponsiveContainer>
        </div>
    );
  }
}
