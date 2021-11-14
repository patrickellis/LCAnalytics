import {React,Component} from 'react';
import CompanyTable from './CompanyTable';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import ActiveShapePieChart from './CustomActivePieChart';
import PieChart from './PieChart';
import PercentAreaChart from './PercentAreaChart';
import RadarChartCustom from './RadarChart';

const easy = 23
const medium = 45
const hard = 54

class ProblemBar extends Component {
    constructor(props){
        super(props);
        this.state = {
  
        };
    }
    componentWillReceiveProps(nextProps){
        
    }
    async componentDidMount(){                
    }
    render(){       
        let sum = this.props.easy+this.props.medium+this.props.hard;
        let ew = (this.props.easy/sum)*100;
        let mw = (this.props.medium/sum)*100;        
        let dividerTwoLeft = ew + mw; 
        ew = ew.toString()+'%';
        mw = mw.toString()+'%';
        dividerTwoLeft = dividerTwoLeft.toString()+'%';
        let barwidth = this.props.width != undefined ? (this.props.width / 100) * 35 + 'rem' : '18rem'; 
        console.log(barwidth);
        return(            
            <>
                <div class='m-1rmcrqn'>
                    <div class="m-1spa8xs">
                        <div class="m-15leskn">
                            {this.props.width == undefined ?
                            <div class="m-18xjao8">
                                {this.props.easy}<span class="m-dytaiz green">E</span>
                                &nbsp;
                                {this.props.medium}<span class="m-dytaiz orange">M</span>
                                &nbsp;
                                {this.props.hard}<span class="m-dytaiz red">H</span>                                                        
                            </div>
                            : null
                            }
                            <div style={ {width: barwidth}} class="m-1s5vw6 e5mzqaz1">
                                <div data-progress="47" class="m-148kaov e5mzqaz0" style={{width: ew}}></div>
                                <div data-progress="47" class="m-148kaov e5mzqaz0 orangebar" style={{width: mw, left:ew}}></div>
                                <div class="m-oxskvv" style={{left: ew}}></div>
                                <div class="m-oxskvv " style={{left: dividerTwoLeft}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ProblemBar
