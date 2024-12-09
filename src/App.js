import React, { useState, useEffect } from 'react';

function App() {
  const [amount, setAmount] = useState(0);
  const [convertedCurrency, setConvertedCurrency] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const fetchConversion = async () => {
    try {
      const response = await fetch('http://kowan-backend.54.173.183.227.sslip.io:80/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }), // Send the amount to be converted
      });
      const data = await response.json();
      if (data.status === 200) {
        setConvertedCurrency({
          idr: data.IDR,
          usd: data.USD,
          eur: data.EUR,
        });
      } else {
        console.error('Failed to fetch conversion data');
      }
    } catch (error) {
      console.error('Error fetching conversion data:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://kowan-backend.54.173.183.227.sslip.io/history');
      const data = await response.json();
      if (data.status === 200) {
        setConversionHistory(data.data);
      } else {
        console.error('Failed to fetch conversion history');
      }
    } catch (error) {
      console.error('Error fetching conversion history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleConvert = () => {
    fetchConversion();
  };

  // Function to format the conversion date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Currency Converter Box */}
        <div className="bg-gray-50 p-6 rounded-md shadow-md">
          <h1 className="text-3xl font-semibold text-center text-blue-500 mb-6">Currency Converter</h1>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
              Enter amount in IDR
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          <button
            onClick={handleConvert}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Convert
          </button>

          {convertedCurrency && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-300">
              <h2 className="text-2xl font-semibold text-blue-500 mb-4">Converted Amount</h2>
              <p className="text-lg">
                <strong>IDR: </strong>Rp{convertedCurrency.idr}
              </p>
              <p className="text-lg">
                <strong>USD: </strong>${convertedCurrency.usd}
              </p>
              <p className="text-lg">
                <strong>EUR: </strong>€{convertedCurrency.eur}
              </p>
            </div>
          )}
        </div>

        {/* Conversion History Box */}
        <div className="bg-gray-50 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-blue-500">Conversion History</h2>
          <ul className="mt-4 space-y-2">
            {conversionHistory.slice(0, 3).map((item, index) => (
              <li
                key={index}
                className="bg-gray-100 p-4 rounded-md border border-gray-200"
              >
                <p className="text-lg">
                  <strong>IDR:</strong> Rp{item.idr_value}
                </p>
                <p className="text-lg">
                  <strong>USD:</strong> ${item.usd_value}
                </p>
                <p className="text-lg">
                  <strong>EUR:</strong> €{item.eur_value}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Conversion Date:</strong> {formatDate(item.conversion_date)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
