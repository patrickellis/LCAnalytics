import axios from 'axios';
import { idsToRadar } from './util';
const problems = require('../data/problems.json');

// these are temporary data storage solutions whilst I test the app, we need to find a more elegant way
var problems_dict = {}
var user_solved_dict = {}
var problem_slug_to_actual = {}
var problem_actual_to_id = {}
var problem_slug_to_id = {}
var id_to_problem_slug = {}
var num_problems = 0
var id_to_level = {}
var levelIdToText = {1:'Easy',2:'Medium',3:'Hard'};
var difficulties = {'Easy':0,'Medium':0,'Hard':0};
var userSolvedTotal = 0;
var ids_solved = []

/**
 *  initialises dictionaries
 *  Obviously these dictionaries never change, they're based on imported data
 * later, we want these to be JSON objects imported to smoothen load times
 * no need to crunch this in-app
 */
function init_dictionaries(){
    for(let i = 0; i < problems.length; ++i){    
        problems_dict[problems[i]['title_slug']]=problems[i]['id']
        problem_slug_to_actual[problems[i]['title_slug']]=problems[i]['title']
        problem_actual_to_id[problems[i]['title']]=problems[i]['id']
        problem_slug_to_id[problems[i]['title_slug']]=problems[i]['id']
        id_to_problem_slug[problems[i]['id']]=problems[i]['title_slug']
        user_solved_dict[problems[i]['id']]=false
        id_to_level[problems[i]['id']]=problems[i]['level']
        num_problems += 1
    }
}
// what's a clean way to init this function? call from App.js? Worth thinking about
init_dictionaries()
// when and how often is this called? just on import? We only need it called once

export const getUserRepositories = (username,token,setRepos) => {
    console.log("getting user repositories")
    var url = 'https://api.github.com/users/'+username+'/repos';
    //var url = 'https://api.github.com/users/patrickellis/repos';
    var repos = []
    axios.get(url,{
        'headers' : {
            'Authorization' : 'token ' + token
        }
    })
            .then(res => {
                console.log("Here");
                console.log(res);
                var data = res.data;
                for(let i = 0; i < data.length; ++i){
                    //repos.push(data[i].name);
                    var obj = {}
                    obj['repo'] = data[i].name;
                    obj['branch'] = data[i].default_branch;
                    obj['username'] = username;
                    obj['token'] = token;
                    repos.push(obj);
                }
                setRepos(repos);
            })
        return;

}
/**
 * 
 * @param {*} username - github username
 * @param {*} repo_name - repository holding leetcode solutions
 * @param {*} branch_name - what branch to fetch from
 * @param {*} setUserData - function passed from App.js that sets object state to hold all user data
 * @returns 
 */
export const fetchGithubRepo = (username,repo_name,branch_name,setUserData,token) => {
    console.log("TOKEN: ",token);
    var new_difficulties = {'Easy':0,'Medium':0,'Hard':0};
    var new_solved = []
    var new_solved_total = 0
    var new_user_solved_dict = {}
    var url = 'https://api.github.com/repos/'+username+'/'+repo_name+'/git/trees/'+branch_name+'?recursive=0' 
    axios.get(url,{
        'headers' : {
            'Authorization' : 'token ' + token
        }
    })
            .then(res => {
                var tree = res.data.tree   
                console.log(tree);             
                var counter = 0
                for(var i = 0; i < tree.length; ++i){
                    if(tree[i]['path'] in problems_dict){
                        counter+=1
                        new_user_solved_dict[problem_slug_to_id[tree[i]['path']]] = true                        
                        new_solved.push(problem_slug_to_id[tree[i]['path']])
                        var level = id_to_level[problem_slug_to_id[tree[i]['path']]]
                        new_difficulties[levelIdToText[level]]+=1;
                        new_solved_total+=1;
                    } 
                }       
                userSolvedTotal = new_solved_total;
                difficulties = new_difficulties;  
                ids_solved = new_solved;     
                user_solved_dict = new_user_solved_dict;             
                fetchDatesFromAllUserIds(username,repo_name,ids_solved,setUserData, token);                                                
                return 
            })       
    return;
}
export const get_object_from_id = (id) => {
    console.log("inside with id: ", id);   
    let obj = {};
    obj['id'] = id;
    obj['level'] = id_to_level[id];
    obj['title'] = problem_slug_to_actual[id_to_problem_slug[id]];   
    console.log(obj); 
    return obj;
}

export const slug_to_id = (slug) => {
    return problem_slug_to_id[slug];
} 

export const actual_to_id = (actual) => {
    return problem_actual_to_id[actual];
}
/**
 * 
 * @param {*} id 
 * @returns the problem slug associated with this Leetcode Problem ID
 */
function convert_id_to_slug(id){
    return id_to_problem_slug[id];
}
/**
 * 
 * @param {*} ids - list of Leetcode Problem IDS 
 * @returns - a list of SLUGS from above function convert_id_to_slug
 */
function convert_ids_to_slugs(ids){
    var slugs = []
    for(let i = 0; i < ids.length; ++i){
        slugs.push(convert_id_to_slug(ids[i]));
    }    
    return slugs;
}

/**
 * This function passes in all of the data passed in to the setData function 
 * setData func is a setState function that updates the values in state of the object 
 * basically an async function that updates the values that are displayed on the company page
 * @param {*} oldest_commits 
 * @param {*} newest_commits 
 * @param {*} flag 
 * @param {*} slugData 
 * @param {*} numProblems 
 * @param {*} solvedCounter 
 * @param {*} setData 
 * @returns 
 */
function setInfo(oldest_commits,newest_commits,flag,slugData,numProblems,solvedCounter,setData){
    const RECENTLY_SOLVED_DISPLAY_N = 10; // how many rows to display on company page RECENTLY SOLVED tab
    let commit_data = {
        'oldest_commits' : oldest_commits,
        'newest_commits' : newest_commits,
        'flag' : flag,
        'slugData' : slugData
    }
    // slugData is all questions we've solved from the company list, sort by date solved before displaying
    commit_data['slugData'].sort(function(a,b){
        if(a['daysAgo'] < b['daysAgo']) return -1;
        if(a['daysAgo'] > b['daysAgo']) return 1;
        return 0;
    });
    // solvedOverTime is a poorly named variable that is a data store for the progress tracking area chart 
    let solvedOverTime = weeklyProgressFromDates(oldest_commits,4,numProblems,solvedCounter,true);
    setData(slugData.slice(0,RECENTLY_SOLVED_DISPLAY_N),commit_data,solvedOverTime);
    return commit_data;
}

/**
 * 
 * @param {*} oldest_commits array of oldest known date for each solved problem
 * @param {*} newest_commits array of most recent known date for each solved problem
 * @param {*} slugData list of objects that hold information for each problem solved
 * @param {*} setUserData function that updates the state of the object that calls this function
 * @returns returns user_data but AFAIK this is never used
 */
function setAllUserInfo(oldest_commits,newest_commits,slugData,setUserData){
    let solvedOverTime = weeklyProgressFromDates(oldest_commits,4,2000,userSolvedTotal,false);
    let user_data = {
        'oldest_commits' : oldest_commits,
        'newest_commits' : newest_commits,        
        'slugData' : slugData,
        'solvedOverTime' : solvedOverTime,       
        'ids_solved' : ids_solved, 
        'user_solved_dict' : user_solved_dict,
        'difficulties' : difficulties,
        'radar_data' : idsToRadar(ids_solved)
    }
    user_data['slugData'].sort(function(a,b){
        if(a['daysAgo'] < b['daysAgo']) return -1;
        if(a['daysAgo'] > b['daysAgo']) return 1;
        return 0;
    });
    setUserData(user_data);
    return user_data;
}
/**
 * implementation of the below function, called on App start from fetchGithubRepo that generates user profile statistic information
 * @param {*} username - github username
 * @param {*} repo_name - github repository
 * @param {*} ids - array of ids of all solved problems by user 
 * @param {*} setUserData - setter method that updates the state of the object that calls this function (App.js)
 * @returns 
 */
export const fetchDatesFromAllUserIds = (username,repo_name,ids,setUserData,token) => {    
    var oldest_commits = []
    var newest_commits = []
    var slugData = []
    var id_slugs = convert_ids_to_slugs(ids)    
    let commit_data = {}    
    if(ids.length==0) return setAllUserInfo(oldest_commits,newest_commits,slugData,setUserData);
    for(let i = 0; i < ids.length; ++i){
        var url = 'https://api.github.com/repos/'+username+'/'+repo_name+'/commits?path='+id_slugs[i];
        axios.get(url,{
            'headers' : {
                'Authorization' : 'token ' + token
            }
            })
                .then(res => {                    
                    var commits = res.data;           
                    if(commits.length == 0){
                        if(i==ids.length-1){
                            return setAllUserInfo(oldest_commits,newest_commits,slugData,setUserData);
                        }
                        return;        
                    }                   
                    var oldest_commit = commits[commits.length-1]['commit']['author']['date'];
                    var newest_commit = commits[0]['commit']['author']['date'];                    
                    oldest_commits.push(new Date(oldest_commit));
                    newest_commits.push(new Date(newest_commit));
                    let obj = {};
                    obj['slug'] = id_slugs[i];
                    obj['title'] = problem_slug_to_actual[id_slugs[i]];
                    obj['date'] = new Date(newest_commit);
                    obj['id'] = ids[i];
                    obj['difficulty'] = levelIdToText[id_to_level[ids[i]]];
                    obj['daysAgo'] = datediff(new Date(newest_commit),new Date(Date.now()),);
                    slugData.push(obj);
                    if(i==ids.length-1){                                                
                        return setAllUserInfo(oldest_commits,newest_commits,slugData,setUserData);                        
                    }
            })
        }   
}
/**
 * 
 * @param {*} username - github username
 * @param {*} repo_name -  github repository holding LC solutions
 * @param {*} ids - list of IDS for each problem solved by user
 * @param {*} setData - setData function for the object calling this function, updates the objects' state
 * @param {*} numProblems - number of problems in the company data, needed to generate display data for progress chart
 * @param {*} solvedCounter - number of solved problems by user (today)
 * @returns - no return value, instead the setData function is used to update calling objects' state
 */
export const fetchDatesFromIds = (username,repo_name,ids,setData,numProblems,solvedCounter,token) => {    
    var id_slugs = convert_ids_to_slugs(ids)    
    var oldest_commits = []
    var newest_commits = []    
    var slugData = []
    var flag = false;    
    if(ids.length == 0){        
        return setInfo(oldest_commits,newest_commits,flag,slugData,numProblems,solvedCounter,setData);
    }
    for(let i = 0; i < ids.length; ++i){
        var url = 'https://api.github.com/repos/'+username+'/'+repo_name+'/commits?path='+id_slugs[i];
        axios.get(url,{
            'headers' : {
                'Authorization' : 'token ' + token
            }
            })
            .then(res => {
                var commits = res.data;                    
                var oldest_commit = commits.at(-1)['commit']['author']['date'];
                var newest_commit = commits[0]['commit']['author']['date'];                    
                oldest_commits.push(new Date(oldest_commit))
                newest_commits.push(new Date(newest_commit))
                let obj = {}
                obj['slug'] = id_slugs[i];
                obj['title'] = problem_slug_to_actual[id_slugs[i]];
                obj['date'] = new Date(newest_commit);
                obj['daysAgo'] = datediff(new Date(newest_commit),new Date(Date.now()),);
                slugData.push(obj);
                if(i==ids.length-1){        
                    // because this is an async function, and these get requests have no guaranteed 
                    // promise resolution time, we need to call our setData method from within the function                                        
                    setInfo(oldest_commits,newest_commits,flag,slugData,numProblems,solvedCounter,setData);                        
                }
        })                  
    }        
}
/**
 * 
 * @param {*} first earlier date
 * @param {*} second later date
 * @returns difference in days between them
 */
function datediff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

/**
 * 
 * @param {*} dates - array of dates that act as checkpoints, solved problems are assigned to the closest checkpoint 
 * @param {*} num_weeks 
 * @param {*} num_problems 
 * @param {*} num_solved 
 * @param {*} plotRemaining 
 * @returns 
 */
export const weeklyProgressFromDates = (dates,num_weeks,num_problems,num_solved,plotRemaining) => {    
    const today = new Date(Date.now());
    // cutoff - problems solved before this date are not included in the returned data object
    // used to implement the toggle for the progress tracking area chart
    const cutoff = new Date(Date.now() - 24 * 3600 * 1000 * num_weeks * 7);
    var numBins = 15; // how many sections do we want to display on progress graph
    numBins = Math.min(numBins, num_weeks*7);   
    var data = new Array(numBins).fill(0);
    var ratio = ((today-cutoff)/(1000*60*60*24))/numBins; // difference in days between sections
    var step_size = (today - cutoff)/ numBins; // step size in milliseconds (I think)
    for(let i = 0; i < dates.length; ++i){        
        if(dates[i] < cutoff){            
            continue; // ignore if solved pre-cutoff
        }
        var index = Math.round(numBins - (today - dates[i]) / step_size);
        data[index] += 1;
    }
    // set data to be cumulative for display purposes
    for(let i = 1; i < data.length; ++i){
        data[i] += data[i-1];
    }   
    // how many problems were solved pre-cutoff, update all info to display accurately
    var outstanding = num_solved - data[data.length-1];    
    for(let i = 0; i < data.length; ++i){
        data[i]+=outstanding;
    }
    var problems = new Array(numBins).fill(0);
    for(let i = 0; i < numBins; ++i){
        problems[i] = num_problems-data[i];
    }
    dates = getDates(numBins,ratio);     
    let to_display = [];
    for(let i = 0; i < numBins; ++i){
        let obj = {}        
        obj['date'] = dates[i];    
        obj['Solved']=data[i];
        // generalising so we can use this function for area charts or line charts *do we care about remaining problems?.
        if(plotRemaining) obj['Remaining']=problems[i]; 
        to_display.push(obj);
    }
    return to_display;
}
function getDates(numBins,ratio){
    var dates_ = new Array(numBins).fill(0);
    for(let i = numBins-1; i >= 0; --i){
        var date = new Date(Date.now() - (numBins-1-i) * ratio * 24*3600*1000);
        // this sets how we want to display our date on the progress graph
        var prettyDate = (date.getMonth()+1) + '.' + date.getDate(); 
        dates_[i] = prettyDate;        
    }    
    return dates_;
}
/**
 * 
 * @param {*} id - problem ID
 * @returns URL that links to the problem
 */
export const getURLfromId = (id) => {
    var slug = id_to_problem_slug[id];    
    return 'https://leetcode.com/problems/'+slug;
}