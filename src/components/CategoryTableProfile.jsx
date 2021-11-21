import {React,Component} from 'react';
import CompanyTable from './CompanyTable';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import ActiveShapePieChart from './CustomActivePieChart';
import PieChart from './PieChart';
import PercentAreaChart from './PercentAreaChart';
import RadarChartCustom from './RadarChart';
import ProblemBar from './ProblemBar';

class CategoryTableProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            goal : 25
        };
        this.handleListClick = this.handleListClick.bind(this);
    }
    handleListClick(item){
        console.log("handling list click", item);
        
    }
    componentWillReceiveProps(nextProps){
        
    }
    async componentDidMount(){                
    }

    render(){       
        let data = this.props.data;
        return(
            <div class="tableContainer">               
                <table class="m-3gmgrq mainTable">
                    <thead class="thead">
                    <th class="m-1itvjt0" style={{minWidth:'2rem'}}></th>
                    <th class="m-1itvjt0">Category</th>     
                    <th class="m-1itvjt0" style={{minWidth:'11rem'}}>Solved</th>                                             
                    <th class="m-1itvjt0">
                        <div style= {{width:this.state.goal * 3 + 'rem'}} class="target-text"><div class="text">Goal</div></div>
                        <div>Progress Bar</div>
                    </th>               
                    </thead>
                    <tbody>
                        {data != undefined ? data.map(item =>                
                        {                        
                            return(
                            <tr onClick={() => this.props.switchToCategoryPage(item)} class="m-14j0amg e98qpmo0">
                                <td></td>
                                <td class="bold">{item.category}</td>    
                                <td class="bold">{item.count}</td>                                                                                                   
                                <td style={{overflow:'visible'}}>    
                                <div class="target-line" style={{width:this.state.goal * 3 + 'rem'}}></div>                            
                                    <ProblemBar goal={this.state.goal} count={item['count']} width={item['percent_width']} easy={item['Easy']} medium={item['Medium']} hard={item['Hard']}/>                                                                                                                                                                                
                                    {/*
                                    <div class="m-1s5vw6 e5mzqaz1">
                                        <div data-progress="47" class="m-148kaov e5mzqaz0" style={{width: completedWidth+'%'}}></div>                                                
                                        <div class="m-oxskvv" style={{left: completedWidth+'%'}}></div>                                                
                                    </div>      
                                    */}
                                </td>
                                
                            </tr>
                            )
                        }
                        ):null}
                        
                    
                    </tbody>
                </table>
        </div>
        )
    }
}

export default CategoryTableProfile
