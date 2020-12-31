
export function convertToCelsius(temperature) {
    let newTemperature = temperature - 273.15;
    return newTemperature.toFixed(0);
}

export function convertDate(date) {
    const newDate = new Date(date*1000);
    const day = newDate.getDate();
    const month = newDate.getMonth()+1;

    const returnDate = {
        day: day,
        month: month,
    }

    return returnDate;
}