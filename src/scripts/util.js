import idToCategories from '../data/problemIdToCategories.json';
import category_list from '../data/categoryList';

export const userHasSolvedProblem = (problemID, userdata) => {
    var solved = userdata['ids_solved']
    //console.log(userdata)
    for(var i = 0; i < solved.length; ++i){
        if(solved[i] == problemID)
            return true
    }
    return false
}
    
export const idsToRadar = (data) => {
    var cat_name_to_idx = {}
    for(let i = 0; i < category_list.length; ++i){
        cat_name_to_idx[category_list[i]] = i;
    }    
    const TOP_N = 8;
    var counts = new Array(category_list.length).fill(0);
    for(let i = 0; i < data.length; ++i){
        var id = data[i];
        //console.log("Id: ", id)
        if(!id in idToCategories) continue;
        var cats = idToCategories[id];
        if(!cats) continue;
        //console.log(cats);
        for(let j = 0; j < cats.length; ++j){
            counts[cat_name_to_idx[cats[j]]]+=1;
        }
    }
    var display_data = [];
    for(let i = 0; i < category_list.length; ++i){
        let obj = {};
        obj['count'] = counts[i];
        obj['category'] = get_cat_name(category_list[i]);
        display_data.push(obj);
    }
    display_data.sort(function(a,b){
        if (a['count'] > b['count']) return -1;
        if (a['count'] < b['count']) return 1;
        return 0;
    })
    display_data = display_data.slice(0,TOP_N);
    
    //console.log(display_data);
    let desired_order = [0,4,5,7,1,3,2,6];
    display_data.sort(function(a,b){
        if(a['category'].length > b['category'].length) return -1;
        if(a['category'].length < b['category'].length) return 1;
        return 0;
    })
    let newdata = Array(TOP_N).fill({});
    for(let i = 0 ; i < TOP_N; ++i){
        newdata[desired_order[i]] = display_data[i];
    }
    return newdata;
}
export const setActiveLink = (id) => {    
    const headers = document.getElementsByClassName('m-ijakdu');
    for(let i = 0; i < headers.length; ++i){
        if(i==id){
            if(!headers[i].classList.contains('activeLink'))
                headers[i].classList.add('activeLink');
        }
        else if(headers[i].classList.contains('activeLink')){
            headers[i].classList.remove('activeLink');
        }
    } 
}
const conversion_dict = {
    'Dynamic Programming' : 'DP',
    'Depth First Search' : 'DFS',
    'Breadth First Search' : 'BFS',
    'Binary Search Tree' : 'BST',
    'Heap Priority Queue' : 'Heap',
}
function inarray(arr,item){
    for(let i = 0; i < arr.length; ++i)
        if(arr[i] == item) return true;
    return false;
}
function get_cat_name(name){
    if(inarray(Object.keys(conversion_dict),name)) return conversion_dict[name];
    else return name;
}