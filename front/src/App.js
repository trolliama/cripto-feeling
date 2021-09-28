import "./App.css";
import Dashboard from "Dashboard";
import AdminNavBar from "AdminNavbar";

import ClipLoader from "react-spinners/ClipLoader";

import { FaSadTear, FaSmileBeam } from "react-icons/fa";
import { BiSad } from "react-icons/bi";

import { useState, useEffect } from "react";

function App() {
  const [coin, setCoin] = useState("ethereum");
  const [sentiments, setSentiments] = useState([]);
  const [majorSentiment, setMajorSentiment] = useState("");
  const [price, setPrice] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const [tweets, setTweets] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [chartDates, setChartDates] = useState([]);
  const [charValues, setChartValues] = useState([]);

  const [emoji, setEmoji] = useState(<FaSmileBeam />);
  const [_interface, setInterface] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coin: coin }),
    };
    // make the fetch
    fetch("https://cripto-sentiment-api.herokuapp.com/search/", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        console.log(data);

        setSentiments(data["sentiments"]);
        setPrice(data["price"]);
        setMarketCap(data["market_cap"]);
        setTweets(data["tweets"]);
        setSymbol(data["symbol"]);
        setChartDates(data["trend"]["trend_dates"]);
        setChartValues(data["trend"]["values"]);

        if (data["major_sentiment"] > 0) {
          setMajorSentiment("Otimista");
          setEmoji(<FaSmileBeam />);
        } else if (data["major_sentiment"] < 0) {
          setMajorSentiment("Pessimista");
          setEmoji(<FaSadTear />);
        } else {
          setMajorSentiment("Neutro");
          setEmoji(<BiSad />);
        }
      })
      .catch((error) => {
        alert("Cripto not found");
        console.log(error);
        setCoin("bitcoin");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coin]);

  useEffect(() => {
    {
      loading
        ? setInterface([<ClipLoader loading={loading} size={150} />])
        : setInterface([
            <AdminNavBar onChange={(value) => setCoin(value)} />,
            <Dashboard
              coin={coin}
              symbol={symbol}
              charValues={charValues}
              chartDates={chartDates}
              marketCap={marketCap}
              tweets={tweets}
              price={price}
              majorSentiment={majorSentiment}
              sentiments={sentiments}
              emoji={emoji}
            />,
          ]);
    }
  }, [loading]);

  return <div className="App">{_interface}</div>;
}

export default App;
