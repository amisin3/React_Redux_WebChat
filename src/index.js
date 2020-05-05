import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import * as serviceWorker from "./serviceWorker";
import "semantic-ui-css/semantic.min.css";
import firebase from "./firebase";
import Spinner from "./Spinner";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { setUser, clearUser } from "./actions/index";

import rootReducer from "./reducers";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    // console.log(this.props.isLoading);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log(user);
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(mapStateToProps, { setUser, clearUser })(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
