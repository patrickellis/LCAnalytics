import {React,Component} from 'react';
import CompanyData from '../data/companies/6mo/json/linkedin';
import CompanyTable from './CompanyTable';
import CompaniesTable from './CompaniesTable'
import CompanyNav from './CompanyNav';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import StatsHeader from './StatsHeader';
import CompaniesData from '../data/companies/companies';
console.log(CompaniesData);
const client_id = 'c3dfbec01089dd36fa64';
class CompanyListPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        };
    }
    
    async componentDidMount(){        
        //const userData = await fetchGithubRepo('patrickellis','LeetCode','main',this.setUserData);
        //await new Promise(r => setTimeout(r, 500));
        
    }
    render(){
        return(
            <>                                    
                <h1> Company List page</h1>
                <CompaniesTable/>
            </>
        )
    }
}


export default CompanyListPage
