import {React,Component} from 'react';
import GithubList from './GithubList';
import { setActiveLink } from '../scripts/util';
class HomePage extends Component {
    constructor(props){
        super(props);
       
      
    }
    componentDidMount(){
        setActiveLink(2);
    }


  
    render() {            
      return(
        <>            
           <h1>home page</h1>
        </>
      )
    }
  }
  
  export default HomePage