import React, {Component} from 'react';
import {connect} from 'dva';
import {Row, Col, Input, Checkbox, message, Button, Icon} from 'antd';
import request from '../../utils/request';
import {hashHistory} from 'dva/router';
import config from '../../config';
import md5 from 'blueimp-md5';
import PublicService from '../../services/PublicService';
import styles from './login.less';

class Login extends Component {

  state = {
    enter: false,
    user: '',
    pwd: '',
    code: '',
    codeImg: '',
    autoLogin: false,
    loading: false,
    codeUrl: config.publicApi + '/verifycode.jpg?width=180&height=40&t=',
    inputType: 'password'
  };

  componentDidMount() {
    let t = this;
    t.refreshCode();
    if (t.props.location.state && t.props.location.state.ifTimeOut === 1) {
      message.error("登录过期，请重新登录!")
    }
    PublicService.clearCookie('nickName');

    // 获取自动登录ID
    let autoLoginId = PublicService.getCookie('autoLoginId');
    if (autoLoginId) {
      PublicService.setCookie('autoLoginId', autoLoginId);
      t.setState({
        autoLogin: true,
      });
      let val = {
        autoLoginId: autoLoginId,
        autoLogin: true
      };
      t.onLogin(val);
    }
  }


  // input change事件
  getUserInfo(inputIndex, e) {
    let t = this;
    if (inputIndex === 'autoLogin') {
      t.setState({
        autoLogin: e.target.checked
      })
    } else {
      t.setState({
        [inputIndex]: e.target.value.trim()
      });
    }
  }

  // 登录按钮
  login() {
    let t = this;
    t.refreshCode();
    if (typeof(Storage) !== "undefined") {
      sessionStorage.SZHJ = 'menu-list';
      sessionStorage.JSZX = 'menu-list';
      sessionStorage.XFGC = 'menu-list';
    } else {
      message.warning('您的浏览器版本过低');
    }

    let {user, code, autoLogin} = t.state;
    // 判断输入框是否为空
    if (!user) {
      message.warning('用户名不能为空');
      return;
    }
    if (!autoLogin) {
      message.warning('密码不能为空');
      return;
    }
    if (!code) {
      message.warning('验证码不能为空');
      return;
    }
    // PublicService.fullScreen(document.documentElement);

    let params = {
      password: md5(t.state.pwd),
      userName: t.state.user,
      verifyCode: t.state.code,
      autoLogin: t.state.autoLogin
    };
    t.onLogin(params);
  };

  // 登录接口
  onLogin = (params) => {
    const t = this;
    t.setState({
      loading: true
    });
    request({url: config.publicApi + '/pms/login', method: 'POST', data: params}).then(data => {
      if (data.rc === 0) {
        // 保存用户登录信息
        // t.props.dispatch({type: 'login/saveUser', payload: {user: data.ret}});
        PublicService.setCookie('userId', data.ret.userId);
        PublicService.setCookie('nickName', data.ret.staffName);
        PublicService.setCookie('code', data.ret.code);
        message.success('登录成功');
        // t.props.history.push({pathname: '/main'});
      } else {
        message.error(data.err);
      }
      t.setState({
        loading: false
      });
    })
  };

  // 刷新验证码
  refreshCode() {
    let t = this;
    t.setState({
      codeUrl: t.state.codeUrl + new Date().getTime()
    });
  }

  // 显示密码
  pwdShow() {
    let t = this;
    t.setState({
      inputType: t.state.inputType.length === 0 ? 'password' : ''
    })
  }

  // 键盘事件
  keyUp(e) {
    let t = this;
    let code = e.charCode || e.keyCode;  //取出按键信息中的按键代码(大部分浏览器通过keyCode属性获取按键代码，但少部分浏览器使用的却是charCode)
    if (code === 13) {
      t.login();
    }
  }


  render() {
    let t = this;
    let {loading} = t.state;
    return (
      <div className={styles.bg} onKeyUp={(e) => t.keyUp(e)}>
        <div className={styles['wp-content']}>
          <div className={styles['wp-left']}>
            <div className={styles['wp-left-Welcome']}></div>
            <div className={styles['copyright']}>版权所有: 苏州市伏泰信息科技股份有限公司</div>
            <div className={styles['copyright']}>技术支持：苏州市伏泰信息科技股份有限公司&nbsp;&nbsp;&nbsp; 版本号：V1.0</div>
          </div>
          <div className={styles['wp-right']}>

            <div className={styles['login-title']}>用户登录</div>
            <Row className={styles['wp-login-input']}>
              <Col span={1}><Icon type="user" style={{color: '#60B0F2', fontSize: '18px'}}/> </Col>
              <Col span={23}>
                <Input
                  className={styles['wp-login-user']}
                  placeholder="用户名"
                  value={t.state.user}
                  onChange={t.getUserInfo.bind(t, 'user')}/>
              </Col>
            </Row>
            <Row className={styles['wp-login-input']}>
              <Col span={1}><Icon type="lock" style={{color: '#60B0F2', fontSize: '18px'}}/> </Col>
              <Col span={22}>
                <Input
                  type={t.state.inputType}
                  className={styles['wp-login-user']}
                  placeholder="密&nbsp;&nbsp;&nbsp;码"
                  onChange={t.getUserInfo.bind(t, 'pwd')}/>
              </Col>
              <Col span={1}><a><Icon type="eye-o" onClick={t.pwdShow.bind(t)}
                                     style={{color: '#60B0F2', fontSize: '18px'}}/></a> </Col>
            </Row>
            <Row className={styles['wp-login-foter']}>

              <Col span={9} className={styles['wp-login-code']}>
                <Col span={3}><Icon type="smile-o" style={{color: '#60B0F2', fontSize: '18px'}}/> </Col>
                <Col span={21}>
                  <Input
                    className={styles['wp-login-yanzheng']}
                    placeholder="验证码"
                    onChange={t.getUserInfo.bind(t, 'code')}/>
                </Col>
              </Col>
              <Col onClick={t.render.bind(t)} span={14}>
                <img style={{paddingLeft: '2vw', width: '80%', height: '35px'}} onClick={t.refreshCode.bind(t)}
                     src={t.state.codeUrl}/>
              </Col>
            </Row>
            <Row>
              <Col span={12} className={styles['wp-login-foter']}>
                <Checkbox onChange={t.getUserInfo.bind(t, 'autoLogin')} style={{color: '#ccc'}}>自动登录</Checkbox>
              </Col>
            </Row>
            <div
              onClick={t.login.bind(t)}
              className={styles['wp-login-btn']}
            >
              登录
            </div>
          </div>
          {
            loading &&
            <div className={styles['wp-loading']}></div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Login);


