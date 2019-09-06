import React from 'react';
import {Router, Route, IndexRoute,Switch} from 'dva/router';

// 登录页
import Login from "./routes/login/Login";
import Main from "./routes/main/index";
import Example from "./routes/main/Example";

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Router path="/login">
        <IndexRoute component={Login}/>
        <Route path="/login" component={Login}> </Route>
      </Router>
      <Router path="/" component={Main}>
        <IndexRoute component={Example}/>
        <Route path="/example" component={Example}> </Route>
      </Router>
    </Router>
  );
}

export default RouterConfig;
