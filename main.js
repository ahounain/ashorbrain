const apiKey = "7c63389a42094132975142d2005f23d5";
const alewifeStopId = "70096";
const ashmontStopId = "70086";

async function fetchFirstPrediction(stopId) {
  const response = await fetch(
    `https://api-v3.mbta.com/predictions?filter[stop]=${stopId}&api_key=${apiKey}`
  );
  const data = await response.json();
  if (data.data.length > 0) {
    return new Date(data.data[0].attributes.arrival_time);
  } else {
    throw new Error(`No predictions available for Stop ID ${stopId}`);
  }
}
const currentTime = new Date();
const millisecondstoMinutes = 1000 * 60;
console.log(currentTime);

async function compareArrivalTimes() {
  try {
    const braintreeArrivalTime = await fetchFirstPrediction(alewifeStopId);
    const ashmontArrivalTime = await fetchFirstPrediction(ashmontStopId);
    let alewifeTrackName = "";
    let bigLetterTrack = "";
    let JFKArrivalTime = 0;

    if (braintreeArrivalTime && ashmontArrivalTime) {
      if (braintreeArrivalTime < ashmontArrivalTime) {
        alewifeTrackName = "Alewife train is on the Braintree track.";
        bigLetterTrack = "B";
        JFKArrivalTime = Math.floor(
          (braintreeArrivalTime - currentTime) / millisecondstoMinutes
        );
        if (JFKArrivalTime <= 2) {
          alewifeTrackName =
            "Alewife train is on the Braintree track in " +
            JFKArrivalTime +
            " minutes.. better get running pal";
        } else {
          alewifeTrackName =
            "Alewife train is on the Braintree track in " +
            JFKArrivalTime +
            " minutes";
        }
      } else if (braintreeArrivalTime > ashmontArrivalTime) {
        bigLetterTrack = "A";
        JFKArrivalTime = Math.floor(
          (braintreeArrivalTime - currentTime) / millisecondstoMinutes
        );
        if (JFKArrivalTime == 2) {
          alewifeTrackName =
            "Alewife train is on the Ashmont track in " +
            JFKArrivalTime +
            " minutes.. better get running pal";
        } else if (JFKArrivalTime == 1) {
          alewifeTrackName =
            "Alewife train is on the Ashmont track in " +
            JFKArrivalTime +
            " minute.. It's over.";
        } else if (JFKArrivalTime > 10) {
          alewifeTrackName =
            "Alewife train is on the Ashmont track in " +
            JFKArrivalTime +
            " minutes. Get comfy.";
        } else {
          alewifeTrackName =
            "Alewife train is on the Ashmont track in " +
            JFKArrivalTime +
            " minutes";
        }
      } else {
        alewifeTrackName = "Both stops have the same arrival time. IDK bruh";
        bigLetterTrack = "🤷";
      }
    } else {
      alewifeTrackName = "Unable to compare arrival times due to missing data.";
      bigLetterTrack = "😿";
    }

    document.getElementById("alewifeTrackName").textContent = alewifeTrackName;
    document.getElementById("bigLetterTrack").textContent = bigLetterTrack;
    document.getElementById("JFKArrivalTime").textContent = JFKArrivalTime;
  } catch (error) {
    console.error("Error fetching predictions:", error);
  }
}
compareArrivalTimes();
