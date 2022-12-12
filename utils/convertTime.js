exports.convertTime = (startTime, duration) => {
    startTime = startTime.toString();
    const add = (duration / 60) * 100 + duration % 60;
    let endTime = (parseInt(startTime) + add).toString();
    if (startTime.length == 3) startTime = "0" + startTime;
    if (endTime.length == 3) endTime = "0" + endTime;
    startTime = startTime.slice(0, 2) + ":" + startTime.slice(2);
    endTime = endTime.slice(0, 2) + ":" + endTime.slice(2);
    const timings = startTime + " - " + endTime;
    return timings;
}
