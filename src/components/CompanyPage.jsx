import {React,Component} from 'react';
import CompanyTable from './CompanyTable';
import CompanyNav from './CompanyNav';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import StatsHeader from './StatsHeader';
const client_id = 'c3dfbec01089dd36fa64';
class CompanyPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoaded : false,
            data: this.props.data,
            userData: [],
            displayQuestions : true,
        };
        this.setUserData = this.setUserData.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
    }
    toggleDisplay(){
        let cur = this.state.displayQuestions;
        cur = !cur;
        this.setState({
            displayQuestions : cur,
        })
    }
    setUserData(userData){
        this.setState({
            userData : userData
        }, ()=>{
            this.setState({
                isLoaded : true
            })
        })
    }
    async componentDidMount(){        
        console.log("mounting");
        const userData = await fetchGithubRepo('patrickellis','LeetCode','main',this.setUserData);
        //await new Promise(r => setTimeout(r, 500));
        
    }
    render(){
        return(
            <>                                    
            {this.state.isLoaded &&                
                <>                
                <StatsHeader/>
                <div class="m-ht4nkg">
                    <Stats name={this.props.name} userData={this.state.userData} data={this.state.data} isLoaded={this.state.isLoaded}/>
                    <div class="separator"></div>
                    <CompanyNav toggleDisplay={this.toggleDisplay}/>
                    {this.state.displayQuestions && 
                    <CompanyTable userData={this.state.userData} data={this.state.data} isLoaded={this.state.isLoaded}/>
                    }
                </div>
                </>
            }
            </>
        )
    }
}


export default CompanyPage
