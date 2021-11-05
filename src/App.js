import logo from './logo.svg';
import './App.css';
import CompanyPage from './components/CompanyPage'
import CompanyListPage from './components/CompanyListPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import {React,Component} from 'react';
import NavBar from './components/Navbar';
import ProfilePage from './components/ProfilePage';

const randComp = () => {
  return <h1>Component</h1>;
}
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      companyData : require('./data/companies/companies'),
      data : [],
      name : "",
      readyToCall : false
    }
    this.updateData = this.updateData.bind(this);
  }
  updateData(data,name){
    this.setState({
      data : data,
      name : name,
      readyToCall : true
    })
  }
  render(){
    return (
      <div>
        <Router>
        <NavBar data={this.state.companyData} updateData={this.updateData}/>
        <main className="m-36y2kb">
          <div className="m-ht4nkg">
            
              <Switch>
                <Route exact path="/">
                  <CompanyPage />
                </Route> 
                <Route path="/companies">
                  <CompanyListPage data = {this.state.companyData} updateData={this.updateData}/>
                </Route>
                <Route path="/company">                
                  <CompanyPage name={this.state.name} data={this.state.data}/>
                </Route>    
                <Route path="/profile">
                  <ProfilePage/>  
                </Route>                
            </Switch> 
            </div>
        </main>
          </Router>           
          
      </div>
    );
  }
}

export default App;
