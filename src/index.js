import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { observer, useLocalStore } from "mobx-react";
import "mobx-react-lite/batchingForReactDom";

import "./styles.css";

import Movies from "./pages/Movies";
import Favorites from "./pages/Favorites";
import Footer from "./components/Footer";

import MoviesStoreContext, { MoviesStore } from "./stores/MovieStore";

const App = observer(() => {
  const store = useLocalStore(MoviesStore);
  return (
    <MoviesStoreContext.Provider value={store}>
      <Router>
        <Switch>
          <Route path="/favorites">
            <Favorites />
          </Route>
          <Route path="/" exact>
            <Movies />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </MoviesStoreContext.Provider>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
