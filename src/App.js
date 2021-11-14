import logo from './logo.svg';
import './App.css';
import CompanyPage from './components/CompanyPage'
import CompanyListPage from './components/CompanyListPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {React,Component} from 'react';
import NavBar from './components/Navbar';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import {fetchGithubRepo, actual_to_id, get_object_from_id} from './scripts/github';
import BeatLoader from "react-spinners/BeatLoader";
import blind75 from './data/Lists/Blind75';
import { Redirect } from "react-router-dom"
import problems from './data/problems.json'
//import * as firebase from 'firebase';



//console.log("LCDATA:",LCpatterns);
/*
var newda = [];
for(let i = 0; i < blind75.length; ++i){
  newda.push(get_object_from_id(blind75[i]));
}


// 121,153,139,377,206,141,19,235,211,212
//newda = newda.filter(n=>n);

console.log("BLIND&%",newda );
*/
import { initializeApp} from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider,GithubAuthProvider} from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {setPersistence, browserLocalPersistence } from "firebase/auth";
import GithubList from './components/GithubList';
var firebaseui = require('firebaseui');
//var ui = new firebaseui.auth.AuthUI(auth());



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGCGpC3mGUoYBfvz7Cezn3qL0e5B_YmqQ",
  authDomain: "lcanalytics-adaca.firebaseapp.com",
  projectId: "lcanalytics-adaca",
  storageBucket: "lcanalytics-adaca.appspot.com",
  messagingSenderId: "467520254726",
  appId: "1:467520254726:web:a661d1fbaec179ba8de487",
  measurementId: "G-M3Z8QSX5RT"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const provider = new GithubAuthProvider();
const auth = getAuth();
provider.addScope('repo');
provider.setCustomParameters({
  'allow_signup': 'false'
});
//Handle Account Status


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      companyData : require('./data/companies/companies'),
      data : [],
      name : "",
      readyToCall : false,
      userData : [],
      isLoaded : true,//false,
      setLoadingStatus : function(){},
      user : undefined,
      userObject : {},    
      displayModal : false,
      displayModalNav : false  
    }
    this.setLoadingStatusTopLevel = this.setLoadingStatusTopLevel.bind(this);
    this.updateData = this.updateData.bind(this);
    this.updateDataTimePeriod = this.updateDataTimePeriod.bind(this);   
    this.setUserData = this.setUserData.bind(this); 
    this.setUserRepositoryAndBranch = this.setUserRepositoryAndBranch.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleModalFromNav = this.toggleModalFromNav.bind(this);
  }

  setUserRepositoryAndBranch(user){
    this.setState({
      userObject:user,
      displayModal:false,
      displayModalNav:false,      
    }, () => {
      this.getUserData(user);
    })
  }
  async getUserData(user){
    console.log("User:",user);
    await fetchGithubRepo(user.username,user.repo,user.branch,this.setUserData,user['token']);   
  }
  updateData(data,name){
    this.setState({
      isLoaded : false,
      data : data,
      name : name,
      readyToCall : true
    },()=>{this.setState({
      isLoaded : true
    })})
  }
  setLoadingStatusTopLevel(){
    this.setState({
      isLoaded : false
    })
  }
  updateDataTimePeriod(name,timeperiod,func){        
    this.setState({
      data : this.state.companyData[timeperiod][name],   
      setLoadingStatus : function(){ func()}      
    })
  }
  toggleModal(){
    this.setState({
      displayModal : false
    })
  }
  toggleModalFromNav(){
    console.log('toggle modal');
    this.setState({      
      displayModalNav : true
    }, console.log(this.state.displayModalNav))
  }
  setUserData(userData){
    this.setState({
        userData : userData
    }, ()=>{
        this.setState({
            isLoaded : true
        })
    })
}
  async componentDidMount(){           
      //if (lastLoginExpired(localStorage.getItem("lastSignIn"))) {               
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
              signInWithPopup(auth, provider)
              .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // logic for displaying modal here
                this.setState({
                  displayModal : true
                })
                // The signed-in user info.
                const user = result.user;
                user['responseToken'] = token;
                console.log("USER: ", user);

                let userStore = JSON.stringify(user);
                let lastSignInStore = JSON.stringify(Date.now());
                console.log("Updating local storage with: ", userStore, ", ", lastSignInStore);
                localStorage.setItem('User',JSON.stringify(user));
                localStorage.setItem('lastSignIn', JSON.stringify(Date.now()));
                          
                this.setState({
                  user : user
                })
                // ...
              }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                console.log("EMAIL:",email);
                // The AuthCredential type that was used.
                const credential = GithubAuthProvider.credentialFromError(error);
                // ...
              });    
          });           
  }
  render(){
    return (
      <div style={{position:'relative'}}>    
        <div class="app-background"></div>
        {this.state.user && (this.state.displayModal || this.state.displayModalNav)?           
          <GithubList displayModalNav={this.state.displayModalNav} toggleModal={this.toggleModal} setUserRepositoryAndBranch={this.setUserRepositoryAndBranch} user={this.state.user}/> : <></>  
        }
          <main className="m-36y2kb">            
            <div className="m-ht4nkg">             
              <Router>   
              <NavBar toggleModal={this.toggleModalFromNav} data={this.state.companyData} updateData={this.updateData}/>
                  <Switch>                    
                    <Route exact path="/">
                      {this.state.user ?
                      <h1>homepage</h1>
                      :
                      <Redirect to="/"/>
                      }
                    </Route> 
                    <Route exact path="/home">
                      {this.state.user ?
                      <HomePage setUserRepositoryAndBranch={this.setUserRepositoryAndBranch} user={this.state.user}/>
                      :
                      <Redirect to="/"/>
                      }
                    </Route> 
                    <Route path="/companies">
                      {this.state.user ?
                      <CompanyListPage setLoadingStatusTopLevel={this.setLoadingStatusTopLevel} data = {this.state.companyData} updateData={this.updateData}/>
                      :
                      <Redirect to="/"/>
                      }
                    </Route>
                    <Route path="/company">      
                       {this.state.user ?          
                      <CompanyPage user={this.state.userObject} setLoadingStatusTopLevel={this.setLoadingStatusTopLevel} isLoaded={this.state.isLoaded} userData={this.state.userData} setLoadingStatus={this.state.setLoadingStatus} updateDataTimePeriod={this.updateDataTimePeriod} name={this.state.name} data={this.state.data}/>
                      :
                      <Redirect to="/"/>
                       }
                    </Route>                        
                    <Route path="/profile">
                      {this.state.user ?
                      <ProfilePage data={problems} userData={this.state.userData} setLoadingStatusTopLevel={this.setLoadingStatusTopLevel} companyData={this.state.companyData['6mo']} updateData={this.updateData}/>  
                      :
                      <Redirect to="/"/>
                      }                      
                    </Route>                
                </Switch> 
                </Router>   
              </div>
          </main>
                              
      </div>
    );
  }
}

export default App;
