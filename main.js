// Your Alpha Vantage API Key (replace 'YOUR_API_KEY' with your actual API key)
const apiKey = 'KEY';

// When the button is clicked
document.getElementById("myButton").addEventListener("click", function() {
    let stockSymbol = document.getElementById("stockInput").value;
  
    if (stockSymbol) {
      // Fetch daily stock data from Alpha Vantage
      fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          console.log("API Response (Daily):", data); // Log the entire response to see what’s being returned
  
          if (data && data["Time Series (Daily)"]) {
            let dailyData = data["Time Series (Daily)"];
            let latestDate = Object.keys(dailyData)[0];
            let latestData = dailyData[latestDate];
  
            let stockPrice = latestData["4. close"];
            let change = (latestData["4. close"] - latestData["1. open"]).toFixed(2);
            let changePercent = ((change / latestData["1. open"]) * 100).toFixed(2);
  
            alert(`The current price of ${stockSymbol} is $${stockPrice}\nDaily Change: $${change}\nDaily Change Percentage: ${changePercent}%`);
          } else {
            alert("Sorry, no data available for this stock symbol. Please check the symbol and try again.");
          }
        })
        .catch(error => {
          console.error("Error fetching stock data:", error);
          alert("There was an error fetching the stock data. Please try again later.");
        });
  
      // Fetch weekly stock data from Alpha Vantage
      fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${stockSymbol}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          console.log("API Response (Weekly):", data);
          if (data && data["Weekly Time Series"]) {
            let weeklyData = data["Weekly Time Series"];
            let latestDate = Object.keys(weeklyData)[0];
            let latestData = weeklyData[latestDate];
            let stockPrice = latestData["4. close"];
            alert(`Weekly Price of ${stockSymbol} is $${stockPrice}`);
          }
        });
  
      // Fetch monthly stock data from Alpha Vantage
      fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${stockSymbol}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          console.log("API Response (Monthly):", data);
          if (data && data["Monthly Time Series"]) {
            let monthlyData = data["Monthly Time Series"];
            let latestDate = Object.keys(monthlyData)[0];
            let latestData = monthlyData[latestDate];
            let stockPrice = latestData["4. close"];
            alert(`Monthly Price of ${stockSymbol} is $${stockPrice}`);
          }
        });
    } else {
      alert("Please enter a stock symbol!");
    }
  });
