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
            this.props.setUserRepositoryAndBranch(userObject);     
            window.sessionStorage.setItem('firstListMount', 'complete');       
        } 
        const currentUser = this.props.user['auth']['currentUser'];
        const ghUsername = currentUser['reloadUserInfo']['screenName'];
        const token = this.props.user['responseToken'];
        console.log("USER INFO: ", currentUser, ", ", ghUsername, ", ", token);
        console.log("USER:",ghUsername);
        getUserRepositories(ghUsername,token,this.setRepos);        
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
                    <ul class="githubList">
                        <h1 class="repoTitle">Choose your repository</h1>
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
                </div>
            </div>
            </>                   
      )
    }
  }
  
  export default GithubList