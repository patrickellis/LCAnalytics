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
          <div class="login-background">
            <div class="login">
                  <div class="loginFormContainer">
                      {/*<BeatLoader color={'rgb(255,255,255)'} loading={true} size={15} />  */}
                      <div class="image-container">
                        <img style={{width:'210px',height:'160px'}} src="loading-animation.gif"/>
                      </div>
                      <h1 class="loginTitle">Sign In</h1>
                      <div class="button-container">
                        <button class="login-button" onClick={this.props.login}>
                          <img src="https://d33wubrfki0l68.cloudfront.net/9af0ed00377bb3a2b96af81329a8cb70b0fbdaaa/5e71e/assets/images/github.png" style={{width:'35px',height:'35px',marginRight:'0.5rem'}}/>
                          Login
                          </button>
                          <br/>
                          <div class="remember-me-container">
                            <input type="checkbox" id="subscribeNews" name="subscribe" value="newsletter"></input><span class="input-label">Remember Me?</span>
                          </div>
                      </div>
                    
                      </div>
              </div>
          </div>
        </>
      )
    }
  }
  
  export default HomePage