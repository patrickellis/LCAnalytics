import {React,Component} from 'react';
import CompanyData from '../data/companies/6mo/json/linkedin';
import CompanyTable from './CompanyTable';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import ActiveShapePieChart from './CustomActivePieChart';
import PieChart from './PieChart';
import PercentAreaChart from './PercentAreaChart';
import RadarChartCustom from './RadarChart';
import ProblemBar from './ProblemBar';
class CompanyDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
  
        };
    }

    async componentDidMount(){                
    }
    render(){        
        return(
            <>
                <div>
                    <div class="m-yjkzh e1pfij5r6">
                        <div class="m-bxtrut">
                            <div class="m-a3hkcb">
                                <div class="e7v3szw0 m-11al0g7 e7v3szw2">
                                    <span>
                                        <div class="m-1kvt2p1" role="img">
                                            <span>
                                                <img src="//logo.clearbit.com/linkedin.com" alt="sizzvpaul" loading="lazy" class="m-0"/>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div class="m-h0893i">
                                <h1 class="m-lu2isw">LinkedIn</h1>                                
                            </div>
                        </div>
                        <div class="problemDistribution">
                          <ProblemBar
                            easy={this.props.easy}
                            medium={this.props.medium}
                            hard={this.props.hard}
                            />
                        </div>
                        <RadarChartCustom data={this.props.radarData}/>
                    </div>
                </div>

            </>
        )
    }
}

export default CompanyDashboard
