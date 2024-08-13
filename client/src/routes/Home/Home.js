import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../Store";
import { useHistory } from "react-router-dom";
import "./styles.css";
import ReactWordCloud from 'react-wordcloud';

let recognition;

const Home = () => {
  const [state, dispatch] = useContext(Context);
  const [query, setQuery] = useState(state.query);
  const [topSearches, setTopSearches] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [wordCloud, setWordCloud] = useState(undefined);
  const [recording, setRecording] = useState(false);
  const history = useHistory();
  const callbacksForWordCloud = {
    onWordMouseOver: (_, event) => {
      event.target.style.fill = "#ffffff";
    },
    onWordMouseOut: (_, event) => {
      event.target.style.fill = "#aaaaaa";
    },
    onWordClick: (word, event) => {
      setQuery(word.text);
    }
  };
  
  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition;

    console.log(SpeechRecognition);
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      console.log(recognition)
    }
    if (!recognition) return;
    recognition.addEventListener("start", () => {
      console.log("start");
    })

    recognition.addEventListener("end", () => {
      console.log("end");
      setRecording(false);
    })

    recognition.addEventListener("result", (e) => {
      console.log(e.results);
      setQuery(e.results[e.resultIndex][0].transcript);
    })
  }, [])

  const handleClick = () => {
    if (query != state.query) {
      setShowResults(true);
      dispatch({ type: "STASH_PAGES" });
      dispatch({ type: "SET_QUERY", payload: query });
    } else {
      history.push("/nc/results/0");
    }
  }

  const handleVoice = () => {
    if (!recognition) return;
    if (!recording) {
      setRecording(true);
      recognition.start();
    } else {
      recognition.stop();
    }
  }

  useEffect(() => {
    if (showResults) {
      setShowResults(false);
      history.push("/nc/results/0");
    }
  }, [state.query]);

  useEffect(() => {
    setWordCloud(
      <ReactWordCloud
        words={topSearches}
        options={{
          rotations: 2,
          rotationAngles: [0],
          colors: ['#aaaaaa'],
          fontFamily: 'Lato',
          enableTooltip: false,
        }}
        callbacks={callbacksForWordCloud}
      />
    );
  }, [topSearches]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${state.base}/api/news/top`)
      if (response.ok) {
        const words = JSON.parse(await response.json()).india.map((word, index) => {
          return {
            text: word,
            value: 25 - index,
          };
        })
        console.log(words);
        setTopSearches(words);
      }
    })();
  }, [])

  return (
    <div className="home">
      <div className="banner__home">
        <div className="banner-heading__home">
          <h1>Clean Bulletin
          <span className="banner-icon__home material-icons">
              article
          </span>
          </h1>
          {/* <div style={{textAlign: 'center'}}>Get news with brain!</div> */}
        </div>
        <div className="search__home">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button onClick={handleClick}>
            <span className="material-icons">
              search
              </span>
          </button>
          <button className={recording ? "recording" : "idle"} onClick={handleVoice}>
          <span className="material-icons">
              {recording ? "mic_off" : "mic"}
          </span>
          </button>
        </div>
        <div>
          <>
            {wordCloud}
          </>
        </div>
      </div>
    </div>
  );
};

export default Home;
