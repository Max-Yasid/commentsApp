export function extractFileNameFromPath(path){
    const indexWhereFileNameStart = path.lastIndexOf('/') + 1;
    return path.substring(indexWhereFileNameStart, path.length);
}

export function formatDateToTimeAgoText(date){
    let currentDate = new Date();
    let timeDifferenceInMiliseconds = currentDate.getTime() - date;
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    let result = '';
    if(timeDifferenceInMiliseconds < minute){
        result = 'just now';
    }else if(timeDifferenceInMiliseconds >= minute && timeDifferenceInMiliseconds < hour){
        if(timeDifferenceInMiliseconds >= minute && timeDifferenceInMiliseconds < (minute * 2))
            result = `${(timeDifferenceInMiliseconds / minute).toFixed(0)} min ago`;
        else
            result = `${(timeDifferenceInMiliseconds / minute).toFixed(0)} mins ago`;
    }else{
        if(timeDifferenceInMiliseconds >= hour && timeDifferenceInMiliseconds < (hour * 2))
            result = `${(timeDifferenceInMiliseconds / hour).toFixed(0)} hour ago`;
        else
            result = `${(timeDifferenceInMiliseconds / hour).toFixed(0)} hours ago`;
    }
    return result;
}