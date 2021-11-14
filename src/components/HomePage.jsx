import {React,Component} from 'react';
import GithubList from './GithubList';
import { setActiveLink } from '../scripts/util';
import BeatLoader from "react-spinners/BeatLoader";
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
           <div class="loaderDiv" id="loaderDiv">
                <div class="loaderContainer">
                    <BeatLoader color={'rgb(255,255,255)'} loading={true} size={15} />    
                    </div>
            </div>
        </>
      )
    }
  }
  
  export default HomePage