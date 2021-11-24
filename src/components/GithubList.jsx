import {React,Component} from 'react';
import {getUserRepositories} from '../scripts/github';
import { Route, Redirect } from 'react-router'

function lastListMount(){
    var lastAccess = localStorage.getItem('lastListMount');
    lastAccess = new Date(lastAccess);
    
}
class GithubList extends Component {
    constructor(props){
        super(props);
        this.state = {
            repos : [],            
            redirect : false            
        }
        this.setRepos = this.setRepos.bind(this);
    }
      
    componentDidMount(){       
        if(localStorage.getItem('userObject') !== null && !this.props.displayModalNav){            
            this.props.toggleModal();
            const userObject = JSON.parse(localStorage.getItem('userObject'));
            //console.log("USER FOUND IN LOCALSTORAGE: ", userObject);
            this.props.setUserRepositoryAndBranch(userObject);     
            window.sessionStorage.setItem('firstListMount', 'complete');       
        } 
        let currentUser;
        let ghUsername;
        let token;

        if(!this.props.loadingFromLocalStorage || (localStorage.getItem('userObject') == null)){
            currentUser = this.props.user['auth']['currentUser'];
            ghUsername = currentUser['reloadUserInfo']['screenName'];
            token = this.props.user['responseToken'];
        }
        else{
            const userObject = JSON.parse(localStorage.getItem('userObject'));
            ghUsername = userObject.username;
            token = userObject.token;
            currentUser = "undefined";
        }        
        let lastSignInStore = JSON.stringify(Date.now());        
        localStorage.setItem('lastSignIn', lastSignInStore);    
        // local store for user repositories, update once per hour (or instantly on button press)
        const lastRepositoryUpdate = localStorage.getItem('lastRepositoryUpdate');
        if(lastRepositoryUpdate == null) getUserRepositories(ghUsername,token,this.setRepos);      
        else{
            const lastUpdateDate = new Date(JSON.parse(lastRepositoryUpdate));
            const today = new Date();
            const minutes = parseInt(Math.abs(lastUpdateDate.getTime() - today.getTime()) / (1000 * 60) % 60);
            if(minutes <= 60){
                const repos = JSON.parse(localStorage.getItem('userRepositories'));
                this.setState({
                    repos:repos
                })
            }
            else getUserRepositories(ghUsername,token,this.setRepos); 
        }

          
    }
    onClick(userObject){        
        console.log("userObject: ", userObject);
        this.props.setUserRepositoryAndBranch(userObject);
        // localStorage updates here:
        console.log("updating localstorage");
        localStorage.setItem('userObject',JSON.stringify(userObject));
        //localStorage.setItem('user',JSON.stringify(this.props.user));
        this.setState({
            redirect:true
        })
    }
 
    setRepos(repos){    
        const lastRepositoryUpdate = localStorage.getItem('lastRepositoryUpdate');
        if(lastRepositoryUpdate == null){
            localStorage.setItem('userRepositories',JSON.stringify(repos));
            localStorage.setItem('lastRepositoryUpdate',JSON.stringify(new Date()));   
        }
        else{
            const lastUpdateDate = new Date(JSON.parse(lastRepositoryUpdate));
            const today = new Date();
            const minutes = parseInt(Math.abs(lastUpdateDate.getTime() - today.getTime()) / (1000 * 60) % 60);
            if(minutes > 60){
                localStorage.setItem('userRepositories',JSON.stringify('repos'));
                localStorage.setItem('lastRepositoryUpdate',JSON.stringify(new Date()));   
            }
        }
        this.setState({
            repos:repos
        })
    }
    render() {   
        let areWeRedirecting = this.state.redirect;         
      return(                                               
            <> 
            <div class="background">
                <div class="outer-container-github">
                <div class="githublistcont">
                    <div class="repoTitle">
                        <div class="titleText">
                            <h1>Choose your repository</h1>
                        </div>
                        <div class="exitButton">
                            <button onClick={this.props.toggleModal}><img style={{width:'3rem',height:'3rem'}}src={'https://static.thenounproject.com/png/1202535-200.png'} alt=""/> </button>
                        </div>
                    </div>
                    <div class="containerGithub">
                        <ul class="githubList">                       
                            {this.state.repos.map(item =>
                                <li onClick={()=>this.onClick(item)}>
                                    <div class="githubcontent">
                                        <div class="inline">
                                            <div class="githubtitle">{item.repo}</div>
                                            <div class="githubbranch">{item.branch}</div>
                                        </div>
                                        <div class="icon">
                                            <img src="https://pngimage.net/wp-content/uploads/2018/05/arrow-down-icon-png-5.png" style={{width:'25px',height:'25px',fill:'red'}}/>
                                        </div>
                                    </div>
                                    
                                </li>
                                )}
                        </ul>
                    </div>
                    <div class="pagebreak"></div>
                </div>
                </div>
            </div>
            </>                   
      )
    }
  }
  
  export default GithubList