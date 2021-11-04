import logo from './logo.svg';
import './App.css';
import CompanyPage from './components/CompanyPage'
import CompanyListPage from './components/CompanyListPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import {React,Component} from 'react';
const randComp = () => {
  return <h1>Component</h1>;
}
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
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
      <main className="m-36y2kb">
        <div className="m-ht4nkg">
          <Router>
            <Switch>
              <Route exact path="/">
                <CompanyPage />
              </Route> 
              <Route path="/companies">
                <CompanyListPage updateData={this.updateData}/>
              </Route>
              <Route path="/company">                
                <CompanyPage name={this.state.name} data={this.state.data}/>
              </Route>                    
          </Switch> 
          </Router>           
        </div>
      </main>
    );
  }
}

export default App;
