

export function formatTime(t) {
	let date = new Date(t*1000);
	let year = date.getFullYear().toString().slice(2);
	// let month = "0" + date.getMonth();
	let month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()];
	let day = "0" + date.getDate();
	let formattedDate = `${day.substr(-2)} ${month} ${year}`

	let res = formattedDate;
	return res;
}

export function formatTimeFull(t) {
	let date = new Date(t*1000);
	let year = date.getFullYear().toString().slice(2);
	// let month = "0" + date.getMonth();
	let month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()];
	let day = "0" + date.getDate();
	let formattedDate = `${day.substr(-2)} ${month} ${year}`

	let hours = "0" + date.getHours();
	let minutes = "0" + date.getMinutes();
	let formattedTime = ` - ${hours.substr(-2)}:${minutes.substr(-2)}`

	let res = formattedDate + formattedTime;
	return res;
}
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}