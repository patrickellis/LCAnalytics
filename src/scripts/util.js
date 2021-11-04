export const userHasSolvedProblem = (problemID, userdata) => {
    var solved = userdata['ids_solved']
    //console.log(userdata)
    for(var i = 0; i < solved.length; ++i){
        if(solved[i] == problemID)
            return true
    }
    return false
}
    
export const idsToRadar = (data, idToCategories, category_list) => {
    var cat_name_to_idx = {}
    for(let i = 0; i < category_list.length; ++i){
        cat_name_to_idx[category_list[i]] = i;
    }
    console.log(idToCategories)
    const TOP_N = 8;
    var counts = new Array(category_list.length).fill(0);
    for(let i = 0; i < data.length; ++i){
        var id = data[i]['#'];
        //console.log("Id: ", id)
        var cats = idToCategories[id];
        //console.log(cats);
        for(let j = 0; j < cats.length; ++j){
            counts[cat_name_to_idx[cats[j]]]+=1;
        }
    }
    var display_data = [];
    for(let i = 0; i < category_list.length; ++i){
        let obj = {};
        obj['count'] = counts[i];
        obj['category'] = category_list[i];
        display_data.push(obj);
    }
    display_data.sort(function(a,b){
        if (a['count'] > b['count']) return -1;
        if (a['count'] < b['count']) return 1;
        return 0;
    })
    //console.log(display_data);
    return display_data.slice(0,TOP_N);
}