import idToCategories from '../data/problemIdToCategories.json';
import category_list from '../data/categoryList';

export const userHasSolvedProblem = (problemID, userdata) => {
    var solved = userdata['ids_solved'];
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
        if(!id in idToCategories) continue;
        var cats = idToCategories[id];
        if(!cats) continue;        
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
        
    let desired_order = [7,0,1,2,3,4,5,6];
    let default_order = [0,4,1,3,5,7,2,6];
    let display_data_copy = JSON.parse(JSON.stringify(display_data));
    display_data.sort(function(a,b){
        if(a['category'].length < b['category'].length) return -1;
        if(a['category'].length > b['category'].length) return 1;
        return 0;
    })
    let nonZeroCountData = [];
    let zeroCountData = [];
    display_data.forEach(item => {
        if(item['count'] > 0) nonZeroCountData.push(item);
        else zeroCountData.push(item);
    })
    console.log("checkpoint 1, nonZeroCountData: ", nonZeroCountData, ", zeroCountData: ", zeroCountData);
    let usingNonZeroData = false;
    if(nonZeroCountData.length >= 4 && nonZeroCountData.length < 8){
        usingNonZeroData = true;
        let temp = nonZeroCountData[0]; // shortest length category string
         nonZeroCountData[0] = nonZeroCountData[2];
         nonZeroCountData[2] = temp;
         if(nonZeroCountData.length == 7){
             temp = nonZeroCountData[1];
             nonZeroCountData[1] = nonZeroCountData[6];
             nonZeroCountData[6] = temp;
         }
        zeroCountData.sort(function(a,b){
            if(a['category'].length < b['category'].length) return -1;
            if(a['category'].length > b['category'].length) return 1;
            return 0;
        })
        zeroCountData.forEach(item => {
            nonZeroCountData.push(item);
        })
        // check to see if we have any category names that are too long in the wrong places
        // object that maps index to longest string that can be held there without overflowing container
        let limits = { 
            0 : 50,
            1 : 15,
            2 : 8,
            3 : 15,
            4 : 50,
            5 : 15,
            6 : 8,
            7 : 15
        }
        for(let idx = 0; idx < nonZeroCountData.length; ++idx){            
            if(nonZeroCountData[idx]['category'].length > limits[idx]){
                console.log("string: ", nonZeroCountData[idx], " is too large to fit in index: ", idx);
                usingNonZeroData = false;
                break;
            }
            else{
                console.log("string: ", nonZeroCountData[idx], " is large enough to fit in index ", idx, " -> required length: ", limits[idx], ", category item length: ", nonZeroCountData[idx].length);
            }
        }
    }
    else if(nonZeroCountData.length < 4 && nonZeroCountData.length > 1){
        usingNonZeroData = true;
        let temp = nonZeroCountData[0]; // shortest length category string
        nonZeroCountData[0] = nonZeroCountData[2];
        nonZeroCountData[2] = temp;
        const criticalIndex = 6 - nonZeroCountData.length;
        temp = zeroCountData[0];
        zeroCountData[0] = zeroCountData[criticalIndex];
        zeroCountData[criticalIndex] = temp;
        zeroCountData.forEach(item => {
            nonZeroCountData.push(item);
        })
        let newdata = Array(TOP_N).fill({});
        for(let i = 0 ; i < TOP_N; ++i){
            newdata[desired_order[i]] = nonZeroCountData[i];
        }
    }
    if(!usingNonZeroData){
        display_data_copy.sort(function(a,b){
            if(a['category'].length > b['category'].length) return -1;
            if(a['category'].length < b['category'].length) return 1;
            return 0;
        })
        let newdata = Array(TOP_N).fill({});
        for(let i = 0 ; i < TOP_N; ++i){
            newdata[default_order[i]] = display_data_copy[i];
        }
        let res = []
        for(let i = 0; i < newdata.length; ++i){
            if(newdata[i]==undefined) continue;
            res.push(newdata[i]);
        }
        console.log("RADAR DATA:",newdata);
        return res;
    }
    console.log("RADAR DATA (nonzerocount):",nonZeroCountData);
    let res = []
    for(let i = 0; i < nonZeroCountData.length; ++i){
        const item = nonZeroCountData[i];
        if(item == undefined) continue;
        res.push(item);
    }
    return res;
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