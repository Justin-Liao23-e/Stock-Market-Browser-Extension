Stock Quote Browser Extension
This project is a browser extension that allows you to track stock prices in real-time, displaying the latest stock price, daily change, and historical performance. The extension retrieves stock data using the Alpha Vantage API and provides a sleek and modern interface.

Features
Track Stock Quotes: View daily price, percentage change, weekly, monthly, and yearly changes of a selected stock.
Real-Time Data Update: Automatically updates stock data every 30 minutes during market hours (6:30 AM - 1:00 PM PDT, Monday to Friday).
Persistent Data Storage: Saves your stock list so that it persists even when you close the browser.
How It Works
The extension uses JavaScript, HTML, and CSS for the front-end UI and Alpha Vantage's REST API for fetching real-time stock data.
Stocks can be added by entering the stock symbol (e.g., AAPL for Apple) in the input field, and they will remain on your list until manually removed.
The extension ensures no duplicate entries by refreshing the existing stock entry if a user tries to add a stock that is already tracked.
The extension also features a manual refresh button, allowing users to instantly update all stock data with a click.
Technologies Used
JavaScript: Core logic and API integration.
HTML/CSS: User interface and styling for the popup.
Chrome Storage API: Stores the list of stocks being tracked to ensure persistence across sessions.
Alpha Vantage API: Provides stock market data in real-time.
How to Install and Operate
Step 1: Clone the Repository
Clone the GitHub repository to your local machine:

sh
Copy code
$ git clone <repository-url>
Step 2: Get an API Key
Go to Alpha Vantage.
Sign up for a free account to get an API key.
Replace 'YOUR_API_KEY' in the main.js file with your actual API key.
Step 3: Load the Extension in Chrome
Open Google Chrome.
Go to chrome://extensions/ in the address bar.
Enable Developer mode (toggle at the top right).
Click Load unpacked and select the folder containing your project files.
Step 4: Using the Extension
Click on the extension icon in the browser to open the stock quote tracker.
Enter a stock symbol (e.g., AAPL) and click Get Stock Quote to add it to your list.
The extension will automatically update stock data every 30 minutes during market hours, and you can manually refresh using the Refresh Now button.
To remove a stock from your list, click the Remove button next to the stock entry.
Usage Notes
API Limitations: Alpha Vantage's free tier has limitations of 25 requests per day. You won't be able to fetch the stock data after 25 requests for the day.
Supported Symbols: Ensure you use correct stock symbols (e.g., GOOGL, MSFT). Incorrect symbols will not return data.
Future Improvements
WebSocket Integration: For more accurate real-time updates, integrating with a WebSocket-based API could provide continuous data streams.
Custom Alerts: Set alerts for price changes, allowing users to get notifications when a stock reaches a certain price point.
Improved Data Visualization: Add graphical representations of stock data for better user experience.
License
This project is licensed under the MIT License - see the LICENSE file for details.