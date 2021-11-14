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
function inArray(list,item){
    for(let i = 0; i < list.length; ++i){
        if(list[i]==item) return true;
    }
    return false;
}
function popuphover(inLocalStorage){
    const popup = document.getElementById('companypopup');
    document.getElementById('popuptext').innerHTML = inLocalStorage?'Remove from your tracked lists':'Add to your tracked lists'
    popup.style.display = 'block';
    
}
function popupleave(inLocalStorage){
    const popup = document.getElementById('companypopup');
    popup.style.display = 'none';
}
class CompanyDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            inLocalStorage : false,
        };
        this.addCompanyToUserLists = this.addCompanyToUserLists.bind(this);
    }

    async componentDidMount(){   
        const button = document.querySelector('.add-company-button');
        button.addEventListener('mouseenter',()=>{popuphover(this.state.inLocalStorage)});
        button.addEventListener('mouseleave',()=>{popupleave(this.state.inLocalStorage)});
        if(localStorage.getItem('Lists')!=null){            
            let lists = JSON.parse(localStorage.getItem('Lists'));
            for(let i = 0; i < lists.length; ++i){
                if(lists[i] == this.props.name){
                    this.setState({
                        inLocalStorage : true
                    })
                    break;
                }
            }
        }
    }
    addCompanyToUserLists(){        
        if(this.state.inLocalStorage){
            let lists = JSON.parse(localStorage.getItem('Lists'));
            for(let i = 0; i < lists.length; ++i){
                if(lists[i] == this.props.name){
                    lists.splice(i,1);
                    break;
                }
            }
            localStorage.setItem('Lists',JSON.stringify(lists));
            this.setState({
                inLocalStorage : false
            })
            return;
        }
        if(localStorage.getItem('Lists')===null){
            let lists = [this.props.name];
            console.log("updated list: ", lists);
            localStorage.setItem('Lists',JSON.stringify(lists));
        }
        else{
            let lists = JSON.parse(localStorage.getItem('Lists'));
            if(inArray(lists,this.props.name)) return;
            lists.push(this.props.name);
            console.log("updated list: ", lists);
            localStorage.setItem('Lists',JSON.stringify(lists));
        }
        this.setState({
            inLocalStorage : true
        })
        
    }
    render(){        
        return(
            <>
                <div>
                <button onClick={this.addCompanyToUserLists} class="add-company-button">{this.state.inLocalStorage?'-':'+'}</button>
                    <div class="m-yjkzh e1pfij5r6">
                        <div class="m-bxtrut">
                            <div class="m-a3hkcb">
                                <div class="e7v3szw0 m-11al0g7 e7v3szw2">
                                    <span>
                                        <div style={{overflow:'visible'}}class="m-1kvt2p1" role="img">
                                            <span style={{overflow:'visible'}}>
                                                <img src={'./logo/'+this.props.name+".png"} style={{margin:'auto',lineHeight:'0',width:'100%',height:'100%'}}alt="company_logo" loading="lazy" class="m-0"/>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div class="m-h0893i">
                                <h1 class="m-lu2isw">{this.props.name}</h1>                                
                            </div>
                        </div>
                        <div class="problemDistribution">
                          <ProblemBar
                            key={this.props.radarData}
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
