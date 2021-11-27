import {React,Component} from 'react';
import {getUserRepositories} from '../scripts/github';
import { Route, Redirect } from 'react-router'
import '../styles/settings.css';
import SettingsForm from './SettingsModalForm';
class SettingsModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            repos : [],            
            redirect : false            
        }        
    }
      
    componentDidMount(){       
        
    }
    onClick(userObject){        
    
    }
 
    render() {   
        let areWeRedirecting = this.state.redirect;         
      return(                                               
            <> 
            <div class="background">
                <div class="outer-container-github">
                <div class="settingscont">
                    <div class="repoTitle">
                        <div class="titleText">
                            <h1>Settings</h1>
                        </div>
                        <div class="exitButton">
                            <button onClick={()=>this.props.toggleSettingsModal(false)}><img style={{width:'3rem',height:'3rem'}}src={'https://static.thenounproject.com/png/1202535-200.png'} alt=""/> </button>
                        </div>
                    </div>
                    <div class="containerSettings">
                        <SettingsForm toggleSettingsModal={this.props.toggleSettingsModal}/>
                    </div>
                    <div class="pagebreak"></div>
                </div>
                </div>
            </div>
            </>                   
      )
    }
  }
  
  export default SettingsModal