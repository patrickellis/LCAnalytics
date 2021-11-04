import axios from 'axios';
const problems = require('../data/problems.json');
//console.log(problems)
var problems_dict = {}
var user_solved_dict = {}
var problem_slug_to_actual = {}
var problem_slug_to_id = {}
var id_to_problem_slug = {}
var num_problems = 0
var ids_solved = []
for(var i = 0; i < problems.length; ++i){    
    problems_dict[problems[i]['title_slug']]=problems[i]['id']
    problem_slug_to_actual[problems[i]['title_slug']]=problems[i]['title']
    problem_slug_to_id[problems[i]['title_slug']]=problems[i]['id']
    id_to_problem_slug[problems[i]['id']]=problems[i]['title_slug']
    user_solved_dict[problems[i]['id']]=false
    num_problems += 1
}

export const fetchGithubRepo = (username,repo_name,branch_name,setUserData) => {
    var url = 'https://api.github.com/repos/'+username+'/'+repo_name+'/git/trees/'+branch_name+'?recursive=0' 
    axios.get(url,{
        'headers' : {
            'Authorization' : 'token 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'
        }
    })
            .then(res => {
                var tree = res.data.tree
                console.log(tree)
                var counter = 0
                for(var i = 0; i < tree.length; ++i){
                    if(tree[i]['path'] in problems_dict){
                        counter+=1
                        user_solved_dict[problem_slug_to_id[tree[i]['path']]] = true
                        //console.log("Solved ", problem_slug_to_actual[tree[i]['path']],'\n')
                        ids_solved.push(problem_slug_to_id[tree[i]['path']])
                    } 
                }
                var userData = {
                    'ids_solved' : ids_solved, 
                    'user_solved_dict' : user_solved_dict
                }
                setUserData(userData);
                //console.log('solved ', counter/num_problems*100, '% of all problems')
            })
    
    
    return;
}
function convert_id_to_slug(id){
    return id_to_problem_slug[id];
}
function convert_ids_to_slugs(ids){
    for(let i = 0; i < ids.length; ++i){
        ids[i] = convert_id_to_slug(ids[i]);
    }
    return ids;
}

export const fetchDatesFromIds = (username,repo_name,ids) => {
    var id_slugs = convert_ids_to_slugs(ids)
    var oldest_commits = []
    var newest_commits = []
    console.log("slugs: " ,ids)
    var slugData = []
    var flag = false;
    for(let i = 0; i < ids.length; ++i){
        var url = 'https://api.github.com/repos/'+username+'/'+repo_name+'/commits?path='+ids[i];
        axios.get(url,{
            'headers' : {
                'Authorization' : 'token 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'
            }
            })
                .then(res => {
                    if(i == ids.length-1){
                        flag = true;
                        console.log('done')
                    }
                    var commits = res.data;                    
                    var oldest_commit = commits.at(-1)['commit']['author']['date'];
                    var newest_commit = commits[0]['commit']['author']['date'];                    
                    oldest_commits.push(new Date(oldest_commit))
                    newest_commits.push(new Date(newest_commit))
                    let obj = {}
                    obj['slug'] = ids[i];
                    obj['title'] = problem_slug_to_actual[ids[i]];
                    obj['date'] = new Date(newest_commit);
                    obj['daysAgo'] = datediff(new Date(newest_commit),new Date(Date.now()),);
                    slugData.push(obj);
                    //console.log('solved ', counter/num_problems*100, '% of all problems')
                })
    }
    var commit_data = {
        'oldest_commits' : oldest_commits,
        'newest_commits' : newest_commits,
        'flag' : flag,
        'slugData' : slugData
    }
    
    
    console.log(commit_data);
    console.log(slugData);
    return commit_data
}
function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
}
export const weeklyProgressFromDates = (dates,num_weeks,num_problems,num_solved) => {
    console.log("isolated call to weekly progress func")
    const temp = dates;    
    //console.log("Dates Info", dates);
    const today = new Date(Date.now());
    const cutoff = new Date(Date.now() - 24 * 3600 * 1000 * num_weeks * 7);
    var numBins = 15;
    var ratio = ((today-cutoff)/(1000*60*60*24))/numBins;
    //console.log("ratio: ", ratio);
    if(numBins > num_weeks*7)  numBins = num_weeks*7;
    var data = new Array(numBins).fill(0);
    var step_size = (today - cutoff )/ numBins;
    //console.log("step size:", step_size)
    // today - dates[i] / step_size = index from end. numBins - res = index hopefully
    //console.log("Dates length: ", dates.length);    
    for(let i = 0; i < dates.length; ++i){        
        //var difference = today - dates[i];
        //var daysDifference = difference / (1000 * 3600 * 24);
        //if(daysDifference > num_weeks * 7){ continue; }
        if(dates[i] < cutoff){            
            continue;
        }
        
        var index = Math.round(numBins - (today - dates[i]) / step_size);
        data[index] += 1;
    }
    for(let i = 1; i < data.length; ++i){
        data[i] += data[i-1];
    }
    console.log("numsolved:",num_solved)
    var outstanding = num_solved - data[data.length-1];
    console.log("outstanding: ", outstanding);
    for(let i = 0; i < data.length; ++i){
        data[i]+=outstanding;
    }
    var problems = new Array(numBins).fill(0);
    for(let i = 0; i < numBins; ++i){
        problems[i] = num_problems-data[i];
    }
    var dates = new Array(numBins).fill(0);
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    for(let i = numBins-1; i >= 0; --i){
        var date = new Date(Date.now() - (numBins-1-i) * ratio * 24*3600*1000);
        var prettyDate = (date.getMonth()+1) + '.' + date.getDate();
        dates[i] = prettyDate;        
    }
    
    console.log("dates:", dates);
    var to_display = [];
    for(let i = 0; i < numBins; ++i){
        let obj = {}        
        obj['date'] = dates[i];
        
        obj['Remaining']=problems[i];
        obj['Solved']=data[i];
        to_display.push(obj);
    }
    return to_display;
}

export const getURLfromId = (id) => {
    var slug = id_to_problem_slug[id];    
    return 'https://leetcode.com/problems/'+slug;
}