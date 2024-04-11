const apiKey = "7c63389a42094132975142d2005f23d5";
const alewifeStopId = "70096";
const ashmontStopId = "70086";
let alewifeTrackName = "";

async function fetchFirstPrediction(stopId) {
  const response = await fetch(
    `https://api-v3.mbta.com/predictions?filter[stop]=${stopId}&api_key=${apiKey}`
  );
  const data = await response.json();
  if (data.data.length > 0) {
    return new Date(data.data[0].attributes.arrival_time);
  } else {
    throw new Error(`No predictions available for Stop ID ${stopId}`);
    alewifeTrackName = "Error getting prediction";
  }
}
function set(alewifeTrackName, JFKArrivalTime) {
  switch (alewifeTrackName) {
    case 'Ashmont': 
        return "Alewife train arrives on the Ashmont track in " + JFKArrivalTime
       + getMessage(JFKArrivalTime); 
      break;
    case 'Braintree':
      return "Alewife train arrives on the Braintree track in " + JFKArrivalTime
      + getMessage(JFKArrivalTime);
      break;
  }
}
function getMessage(JFKArrivalTime) {
  
  if (JFKArrivalTime == 1) {
    return " minute.";  
  } else {
    return " minutes.";
  }
}
const currentTime = new Date();
const millisecondstoMinutes = 1000 * 60;
console.log(currentTime);

async function compareArrivalTimes() {
  try {
    const [braintreeResponse, ashmontResponse] = await Promise.all([
      fetch(
        `https://api-v3.mbta.com/predictions?filter[stop]=${alewifeStopId}&api_key=${apiKey}`
      ),
      fetch(
        `https://api-v3.mbta.com/predictions?filter[stop]=${ashmontStopId}&api_key=${apiKey}`
      ),
    ]);
    const braintreeData = await braintreeResponse.json();
    const ashmontData = await ashmontResponse.json();

    let alewifeTrackName = "";
    let bigLetterTrack = "";
    let JFKArrivalTime = 0;

   if (braintreeData.data.length > 0 && ashmontData.data.length > 0) {
      var braintreeArrivalTime = new Date(braintreeData.data[0].attributes.arrival_time);
      var ashmontArrivalTime = new Date(ashmontData.data[0].attributes.arrival_time);

      console.log(braintreeArrivalTime.toLocaleTimeString('en-US'));
      console.log(ashmontArrivalTime.toLocaleTimeString('en-US'));

      console.log((braintreeArrivalTime-ashmontArrivalTime) / millisecondstoMinutes);
      // if the braintree train arrives after the ashmont train,
      // that means that the alewife train will show up on the ashmont 
      // track.
     braintreeArrivalTime =(Math.floor((braintreeArrivalTime - currentTime) / millisecondstoMinutes));
     ashmontArrivalTime =(Math.floor((ashmontArrivalTime - currentTime) / millisecondstoMinutes)); 
      if (braintreeArrivalTime > ashmontArrivalTime) {
            JFKArrivalTime = ashmontArrivalTime ;
            if (JFKArrivalTime < 0) {
              JFKArrivalTime = 0;
            }
            if (JFKArrivalTime == 0) {
              alewifeTrackName = set("Ashmont", JFKArrivalTime) + " Next train in " +
            braintreeArrivalTime +" minutes.";
              bigLetterTrack = "A";
            } else {
            alewifeTrackName = set("Ashmont", JFKArrivalTime);
            bigLetterTrack = "A";
            }
      // similarly if the braintree train arrives before the ashmont train,
      // that means the alewife train will be on the braintree track
      } else if (braintreeArrivalTime < ashmontArrivalTime) {
        JFKArrivalTime = braintreeArrivalTime;
        // prevent negative predictions
        if (JFKArrivalTime < 0) {
          JFKArrivalTime = 0;
        }
        if (JFKArrivalTime == 0) {
          alewifeTrackName = set("Braintree", JFKArrivalTime) + " Next train in " +
            ashmontArrivalTime + " minutes.";
          bigLetterTrack = "B";
        } else {
          alewifeTrackName = set("Braintree", JFKArrivalTime);
          bigLetterTrack = "B";
          }
      }

      


    } else {
      console.log("no datas");
    }
    

    document.getElementById("alewifeTrackName").textContent = alewifeTrackName;
    document.getElementById("bigLetterTrack").textContent = bigLetterTrack;
   // document.getElementById("JFKArrivalTime").textContent = JFKArrivalTime;
  } catch (error) {
    console.error("Error fetching predictions:", error);
  }
}
compareArrivalTimes();
