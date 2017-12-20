

module.exports.timeToDate = function(time) {
    if(typeof time === "string") time = parseInt(time);
    let datum = new Date(time*1000);
    return ('0' + datum.getDate()).slice(-2) + '/' + ('0' + (datum.getMonth()+1).toString()).slice(-2) + '/' + datum.getFullYear();
}

module.exports.dateToTime = function (year, month, day) {
    let datum = new Date(Date.UTC(year, month-1, day));
    return datum.getTime()/1000;
}