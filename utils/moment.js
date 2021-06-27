const moment = e => {
    const date = new Date()
    const month =date.getMonth().toString().length <= 1 ? `0${new Date().getMonth()+1}`:date.getMonth();
    const day = date.getDate().toString().length <= 1 ? `0${new Date().getDate()}`:date.getDate();

    const h = date.getHours().toString().length <= 1 ? `0${new Date().getHours()}`:date.getHours();
    const m = date.getMinutes().toString().length <= 1 ? `0${new Date().getMinutes()}`:date.getMinutes();
    const s = date.getSeconds().toString().length <= 1 ? `0${new Date().getSeconds()}`:date.getSeconds();
    const time = h <= 12 ? `${h}:${m}:${s}AM` : `${h}:${m}:${s}PM`
    const today = `${date.getFullYear()}-${month}-${day}`

    return {
        dayAndTime: `${today} | ${time}`,
        time,
        today
    }
}

module.exports = moment