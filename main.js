const apiKey = "7c63389a42094132975142d2005f23d5";
const alewifeStopId = "70096";
const ashmontStopId = "70086";
const millisecondstoMinutes = 1000 * 60;

async function fetchPredictionTime(stopId) {
  try {
    const response = await fetch(
      `https://api-v3.mbta.com/predictions?filter[stop]=${stopId}&api_key=${apiKey}`
    );
    const data = await response.json();
    if (data.data.length > 0) {
      return new Date(data.data[0].attributes.arrival_time);
    } else {
      throw new Error("No predictions available");
    }
  } catch (error) {
    console.error(`Error fetching prediction for Stop ID ${stopId}:`, error);
    return null;
  }
}

function formatArrivalMessage(trackName, minutesUntilArrival) {
  const timeMessage = minutesUntilArrival === 1 ? " minute." : " minutes.";
  return `Alewife train arrives on the ${trackName} track in ${minutesUntilArrival}${timeMessage}`;
}

function setSplashScreenMessage(message) {
  document.getElementById("alewifeTrackName").textContent = message;
  document.getElementById("bigLetterTrack").textContent = ":(";
}

async function compareArrivalTimes() {
  try {
    const [braintreeArrival, ashmontArrival] = await Promise.all([
      fetchPredictionTime(alewifeStopId),
      fetchPredictionTime(ashmontStopId),
    ]);

    if (!braintreeArrival && !ashmontArrival) {
      setSplashScreenMessage("No predictions available for any tracks.");
      return;
    }

    const currentTime = new Date();
    const braintreeTimeLeft = braintreeArrival
      ? Math.max(0, Math.floor((braintreeArrival - currentTime) / millisecondstoMinutes))
      : null;
    const ashmontTimeLeft = ashmontArrival
      ? Math.max(0, Math.floor((ashmontArrival - currentTime) / millisecondstoMinutes))
      : null;

    let trackName = "";
    let arrivalMessage = "";
    let bigLetterTrack = "";

    if (braintreeTimeLeft !== null && ashmontTimeLeft !== null) {
      if (braintreeTimeLeft > ashmontTimeLeft) {
        trackName = "Ashmont";
        arrivalMessage = formatArrivalMessage(trackName, ashmontTimeLeft);
        bigLetterTrack = "A";
      } else {
        trackName = "Braintree";
        arrivalMessage = formatArrivalMessage(trackName, braintreeTimeLeft);
        bigLetterTrack = "B";
      }
    } else if (braintreeTimeLeft !== null) {
      trackName = "Braintree";
      arrivalMessage = formatArrivalMessage(trackName, braintreeTimeLeft);
      bigLetterTrack = "B";
    } else if (ashmontTimeLeft !== null) {
      trackName = "Ashmont";
      arrivalMessage = formatArrivalMessage(trackName, ashmontTimeLeft);
      bigLetterTrack = "A";
    }

    document.getElementById("alewifeTrackName").textContent = arrivalMessage;
    document.getElementById("bigLetterTrack").textContent = bigLetterTrack;

  } catch (error) {
    console.error("Error comparing arrival times:", error);
    setSplashScreenMessage("Error loading arrival times");
  }
}

compareArrivalTimes();
