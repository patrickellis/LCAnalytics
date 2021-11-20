import {React,Component} from 'react';
import GithubList from './GithubList';
import { setActiveLink } from '../scripts/util';
import BeatLoader from "react-spinners/BeatLoader";
import '../styles/navbar.css';
class HomePage extends Component {
    constructor(props){
        super(props);
       
        this.loadingAnimation = this.loadingAnimation.bind(this);
        this.unloadingAnimation = this.unloadingAnimation.bind(this);
      
    }
    componentDidMount(){
        setActiveLink(2);        
        setTimeout(document.getElementById('loading-gif').play(),1000);
        //setTimeout(this.loadingAnimation, 1000);
        //setTimeout(this.unloadingAnimation, 3000);
    }

    componentWillReceiveProps(nextprops){
      if(nextprops.keyfound){
        this.loadingAnimation();
        
      }
    }
    loadingAnimation(){
      const gif = document.getElementById('loading-gif');
      const form = document.getElementById('button-container');
      const header = document.getElementById('loginTitle');
      const leetdata = document.getElementById('leetdata');
      leetdata.style.opacity = 1;
      form.style.opacity = '0';
      header.style.opacity ='0';
      gif.style.width='280px';
      gif.style.height='213px';
      gif.style.top='13rem';
    }
    unloadingAnimation(){
      const gif = document.getElementById('loading-gif');
      const form = document.getElementById('button-container');
      const header = document.getElementById('loginTitle');
      const leetdata = document.getElementById('leetdata');
      leetdata.style.opacity = '0';
      setTimeout(()=>{
        form.style.opacity = '1';
        header.style.opacity ='1';
      }, 500);
      gif.style.width='210px';
      gif.style.height='160px';
      gif.style.top='0rem';
    }
    render() {            
      return(
        <>                      
          <div class="login-background"></div>
            <div class="login">
                  <div class="loginFormContainer">
                    <h1 id="leetdata">Leetdata</h1>
                      {/*<BeatLoader color={'rgb(255,255,255)'} loading={true} size={15} />  */}
                      <div class="image-container">
                        {/*<img id="loading-gif" style={{width:'210px',height:'160px'}} src="loading-animation.gif"/>*/}
                        <video id='loading-gif' width="210" height="160" autoplay loop muted>
                          <source src="loading-animation2.mp4" type="video/mp4" />                          
                          Your browser does not support the video tag.
                        </video>                        
                      </div>
                      <h1 class="loginTitle" id="loginTitle">Sign In</h1>
                      <div class="button-container" id="button-container">
                        <button class="login-button" onClick={() => {
                          this.props.login();
                          this.loadingAnimation();
                        }}>
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
          
        </>
      )
    }
  }
  
  export default HomePage