import React, {Component} from 'react';
import {connect} from 'dva';
import {Layout, Form, LocaleProvider, Icon, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import LeftNav from './LeftNav';
import styles from './index.less';
import request from '../../utils/request';
import PublicService from "../../services/PublicService";
import util from '../../utils/Util.js';
import config from "../../config";

const {Header, Sider, Content} = Layout;

class App extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    collapsed: false
  };

  componentWillMount() {
    if (document.body.clientWidth < 1500) {
      this.setState({
        collapsed: true
      })
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  // 退出登录
  loginOut = () => {
    request({url: config.publicApi + '/pms/logout', method: 'POST'}).then(data => {
      if (data.rc === 1) {
        message.error(data.err, 2);
      } else if (data.rc === 0) {
        PublicService.clearCookie('userId');
        PublicService.clearCookie('nickName');
        PublicService.clearCookie('autoLoginId');
        PublicService.clearCookie('code');
        message.success('登出成功!', 2);
        this.props.history.push({pathName: '/login'});
      }
    }).catch(err => {
      console.log(err, 'err');
    })
  }

  render() {
    const t = this;
    let {collapsed} = this.state;
    let userName = PublicService.getCookie('userName');
    return (
      <LocaleProvider locale={zh_CN}>
        <Layout>
          <Header className={styles.myHeader}>
            <div className={styles.title}>
              后台管理系统
            </div>
            <div className={styles.loginOut}>
              <span><Icon type="user"/>{userName || ''}</span>
              <a href="javascript:" onClick={t.loginOut}>退出登录</a>
            </div>
          </Header>
          <Layout>
            <Sider
              width={215}
              collapsible
              className={styles.sider + ' ' + 'GYL-side'}
              onCollapse={this.toggle}
              collapsed={collapsed}
            >
              <LeftNav collapsed={collapsed}/>
            </Sider>
            <Content>
              <div className={styles.content}>
                {this.props.children || "此处为你的组件"}
              </div>
            </Content>
          </Layout>
        </Layout>

      </LocaleProvider>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Form.create()(App));
