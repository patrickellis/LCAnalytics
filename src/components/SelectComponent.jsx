import CompanyData from '../data/companies/6mo/json/linkedin';
import CompanyTable from './CompanyTable';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import ActiveShapePieChart from './CustomActivePieChart';
import PieChart from './PieChart';
import PercentAreaChart from './PercentAreaChart';
import RadarChartCustom from './RadarChart';
import {React,Component} from 'react';
import Select from "react-select";


class SelectComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            text: this.props.options[0]
        };
    }

    async componentDidMount(){                
    }
    onChange = e => {                
        this.props.updateProgress(document.getElementById('time-period').value);
        //this.props.updateProgress(12);
    }
    render(){       
        return(
            <div class="selectContainer">
                                <select onChange={this.onChange}
                                 name="time-period" id="time-period">
                                    <option value="4">1 Month</option>
                                    <option value="12">3 Months</option>
                                    <option value="24">6 Months</option>
                                    <option value="48">1 Year</option>
                                </select>
                                </div>
                            

                            
        )
    }
}

export default SelectComponent
