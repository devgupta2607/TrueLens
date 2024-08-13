import React from "react";
import ReactDOM from "react-dom";
import Store from "./Store";
import { HashRouter, Route } from "react-router-dom";
import { AnimatedSwitch as Switch, spring } from "react-router-transition";
import Routes from "./routes/allRoutes";
import "./styles.css"

const { Home, Results, News, Img, Main, Ecomm, Hotel } = Routes;

function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

function bounce(val) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

const bounceTransition = {
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8),
  },
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

const App = () => {
  return (
    <HashRouter>
      <Store>
        <Switch
          atEnter={bounceTransition.atEnter}
          atLeave={bounceTransition.atLeave}
          atActive={bounceTransition.atActive}
          mapStyles={mapStyles}
          className="switch-wrapper"
        >
          <Route path="/" component={Main} exact/>
          <Route path="/nc/" component={Home} exact />
          <Route path="/nc/results/:page" component={Results} />
          <Route path="/nc/news/:page/:index" component={News} />
          <Route path="/ia/" component={Img} />
          <Route path="/ecomm/" component={Ecomm} />
          <Route path="/hotel/" component={Hotel} />
          
          <Route component={Error} />
        </Switch>
      </Store>
    </HashRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
