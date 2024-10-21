const apiKey = 'YourKEY'; //replace with your API key

// Load saved stock data from storage when the extension is opened
document.addEventListener("DOMContentLoaded", function() {
  const stockContainer = document.getElementById("stockContainer");

  // Retrieve stored stocks from Chrome storage
  chrome.storage.local.get("savedStocks", function(result) {
    if (result.savedStocks) {
      result.savedStocks.forEach(stock => {
        // Add each saved stock to the DOM when the extension is opened
        addStockToDOM(stockContainer, stock);
      });
    }
  });

  // Set interval to refresh stock data every 30 minutes during market hours
  setInterval(() => {
    const now = new Date();  // Get current date and time
    const day = now.getDay();  // Get the current day of the week (0 is Sunday, 6 is Saturday)
    const hour = now.getHours();  // Get the current hour
    const minute = now.getMinutes();  // Get the current minute

    // Only refresh between 6:30 am - 1:00 pm PDT, Monday to Friday
    if (day >= 1 && day <= 5 && (hour > 6 || (hour === 6 && minute >= 30)) && hour < 13) {
      refreshAllStocks();  // Refresh all stocks during market hours
    }
  }, 30 * 60 * 1000); // Refresh every 30 minutes (in milliseconds)

  // Add event listener to manually refresh button
  document.getElementById("refreshButton").addEventListener("click", function() {
    refreshAllStocks();  // Manually refresh all stocks when the button is clicked
  });
});

// Function to refresh all stocks in the list
function refreshAllStocks() {
  chrome.storage.local.get("savedStocks", function(result) {
    const stockContainer = document.getElementById("stockContainer");
    stockContainer.innerHTML = ''; // Clear the old data from the display

    if (result.savedStocks) {
      result.savedStocks.forEach(stock => {
        // Fetch the latest data for each stock in the list
        fetchAndAddStock(stock.symbol);
      });
    }
  });
}

// When the "Get Stock Quote" button is clicked, fetch and add stock data
document.getElementById("myButton").addEventListener("click", function() {
  let stockSymbol = document.getElementById("stockInput").value.toUpperCase();  // Get the stock symbol from the input field and convert to uppercase

  if (stockSymbol) {
    // Check if the stock symbol is already displayed in the DOM
    if (document.getElementById(`stock-${stockSymbol}`)) {
      alert(`${stockSymbol} is already in your list. The data will be refreshed.`);
      refreshStock(stockSymbol);  // If the stock is already there, refresh its data
      return;
    }

    // Retrieve stored stocks from Chrome storage to check if the stock is already in the list
    chrome.storage.local.get("savedStocks", function(result) {
      let savedStocks = result.savedStocks || [];

      // Check if the stock is already in the saved list
      if (savedStocks.find(stock => stock.symbol === stockSymbol)) {
        alert(`${stockSymbol} is already in your list. The data will be refreshed.`);
        refreshStock(stockSymbol);  // If the stock is already there, refresh its data
      } else {
        fetchAndAddStock(stockSymbol);  // If the stock is not in the list, add it
      }
    });
  } else {
    alert("Please enter a stock symbol!");  // Alert if no symbol is entered
  }
});

// Function to fetch stock data and add it to the DOM
function fetchAndAddStock(stockSymbol) {
  const stockContainer = document.getElementById("stockContainer");

  // Fetch daily, weekly, and monthly stock data from Alpha Vantage API
  Promise.all([
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`).then(response => response.json()),
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${stockSymbol}&apikey=${apiKey}`).then(response => response.json()),
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${stockSymbol}&apikey=${apiKey}`).then(response => response.json())
  ]).then(([dailyData, weeklyData, monthlyData]) => {
    // Prepare stock data to be displayed and stored
    let stockData = {
      symbol: stockSymbol,
      dailyPrice: "N/A",
      dailyChange: "N/A",
      dailyChangePercent: "N/A",
      weeklyChangePercent: "N/A",
      monthlyChangePercent: "N/A",
      yearlyChangePercent: "N/A"
    };

    // Extract daily data for daily percent gain
    if (dailyData && dailyData["Time Series (Daily)"]) {
      let dailyKeys = Object.keys(dailyData["Time Series (Daily)"]);  // Get all available dates
      let latestDate = dailyKeys[0];  // Get the most recent date
      let previousDate = dailyKeys[1];  // Get the day before the most recent date
      let latestData = dailyData["Time Series (Daily)"][latestDate];  // Get data for the most recent day
      let previousData = dailyData["Time Series (Daily)"][previousDate];  // Get data for the previous day

      stockData.dailyPrice = latestData["4. close"];  // The latest closing price
      stockData.dailyChange = (latestData["4. close"] - previousData["4. close"]).toFixed(2);  // Calculate the daily change
      stockData.dailyChangePercent = ((stockData.dailyChange / previousData["4. close"]) * 100).toFixed(2);  // Calculate the percentage change
    }

    // Extract weekly data for weekly percent gain
    if (weeklyData && weeklyData["Weekly Time Series"]) {
      let weeklyKeys = Object.keys(weeklyData["Weekly Time Series"]);  // Get all available weeks
      let latestWeek = weeklyKeys[0];  // Most recent week
      let previousWeek = weeklyKeys[1];  // Week before the most recent
      let latestData = weeklyData["Weekly Time Series"][latestWeek];  // Get data for the most recent week
      let previousData = weeklyData["Weekly Time Series"][previousWeek];  // Get data for the previous week

      stockData.weeklyChangePercent = (((latestData["4. close"] - previousData["4. close"]) / previousData["4. close"]) * 100).toFixed(2);  // Calculate weekly percentage change
    }

    // Extract monthly data for monthly and yearly percent gain
    if (monthlyData && monthlyData["Monthly Time Series"]) {
      let monthlyKeys = Object.keys(monthlyData["Monthly Time Series"]);  // Get all available months
      let latestMonth = monthlyKeys[0];  // Most recent month
      let previousMonth = monthlyKeys[1];  // Month before the most recent
      let yearAgoMonth = monthlyKeys[11];  // Month from one year ago
      let latestData = monthlyData["Monthly Time Series"][latestMonth];  // Get data for the most recent month
      let previousData = monthlyData["Monthly Time Series"][previousMonth];  // Get data for the previous month
      let yearAgoData = monthlyData["Monthly Time Series"][yearAgoMonth];  // Get data for one year ago

      stockData.monthlyChangePercent = (((latestData["4. close"] - previousData["4. close"]) / previousData["4. close"]) * 100).toFixed(2);  // Calculate monthly percentage change
      stockData.yearlyChangePercent = (((latestData["4. close"] - yearAgoData["4. close"]) / yearAgoData["4. close"]) * 100).toFixed(2);  // Calculate yearly percentage change
    }

    // Add the stock to the DOM and save it to Chrome storage
    addStockToDOM(stockContainer, stockData);
    saveStockToStorage(stockData);
  }).catch(error => {
    console.error("Error fetching stock data:", error);  // Log error if fetching fails
    alert("There was an error fetching the stock data. Please try again later.");  // Alert the user if fetching fails
  });
}

// Function to add stock data to the DOM
function addStockToDOM(container, stock) {
  // Create a new div for the stock data
  const stockItem = document.createElement("div");
  stockItem.classList.add("stock-item");
  stockItem.id = `stock-${stock.symbol}`;  // Set an id based on the stock symbol for easy checking

  // Set the content of the stock item
  stockItem.innerHTML = `
    <p><strong>${stock.symbol}</strong></p>
    <p>Daily Price: $${stock.dailyPrice}, Change: $${stock.dailyChange} (${stock.dailyChangePercent}%)</p>
    <p>5 days Change : ${stock.weeklyChangePercent}%</p>
    <p>Monthly Change : ${stock.monthlyChangePercent}%</p>
    <p>Yearly Change : ${stock.yearlyChangePercent}%</p>
    <button class="remove-stock">Remove</button>
  `;

  // Add event listener to remove button to delete the stock data from the DOM and storage
  stockItem.querySelector(".remove-stock").addEventListener("click", function() {
    container.removeChild(stockItem);  // Remove the stock item from the display
    removeStockFromStorage(stock.symbol);  // Remove the stock from storage
  });

  // Add the stock item to the container in the DOM
  container.appendChild(stockItem);
}

// Function to save stock data to Chrome storage
function saveStockToStorage(stock) {
  chrome.storage.local.get("savedStocks", function(result) {
    let savedStocks = result.savedStocks || [];
    savedStocks = savedStocks.filter(s => s.symbol !== stock.symbol); // Remove duplicate stock if it already exists
    savedStocks.push(stock);  // Add the new stock data
    chrome.storage.local.set({ savedStocks });  // Save updated stock data to Chrome storage
  });
}

// Function to remove stock data from Chrome storage
function removeStockFromStorage(stockSymbol) {
  chrome.storage.local.get("savedStocks", function(result) {
    let savedStocks = result.savedStocks || [];
    savedStocks = savedStocks.filter(stock => stock.symbol !== stockSymbol);  // Remove the stock with the specified symbol
    chrome.storage.local.set({ savedStocks });  // Save updated list to Chrome storage
  });
}

// Function to refresh a single stock in the list
function refreshStock(stockSymbol) {
  fetchAndAddStock(stockSymbol);  // Fetch new data for the specified stock
}
