/**
 * Created by gyl on 2019/9/6
 */
import React, {Component} from 'react';
import {Menu} from 'antd';
import {Link} from 'dva/router';
import {connect} from 'dva';
import MyIcon from '../../components/common/MyIcon/index';
import styles from './LeftNav.less';
import PublicService from "../../services/PublicService";

const SubMenu = Menu.SubMenu;
let navSettings = [
  {
    title: '公共组件示例',
    url: 'example',
    key: '1',
  }, {
    title: '菜单二',
    url: '',
    key: '2',
  }, {
    title: '菜单三',
    url: '',
    key: '3',
  }
];

class LeftNav extends Component {
  state = {
    current: '',
    openKeys: [],
    navSettings: [],
    setNavTop: '', // 导航样式
    types: ''
  };

  componentDidMount() {
    let t = this;
    t.getAddress();
  }

  // 获取路由
  getAddress = () => {
    let address = window.location.hash.substring(window.location.hash.indexOf('/') + 1, window.location.hash.indexOf('?'));
    let current = '';
    let openKeys = [];
    navSettings.map((item, index) => {
      let {key} = PublicService.onRecursion(item, "url", address);
      if (key) {
        current = key;
        openKeys = [key];
      }
    });
    this.setState({
      current,
      openKeys
    });
  };

  // 控制左边导航栏只展示一个父节点
  onOpenChange = (openKeys) => {
    // let {navSettings} = this.state;
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (latestOpenKey && latestOpenKey.length > 2) {
      let [firstKey, ...all] = this.state.openKeys;
      let nextKeys = openKeys.pop();
      this.setState({
        openKeys: [firstKey, nextKeys]
      });
    } else {
      let rootSubmenuKeys = [];
      navSettings.map((item, index) => {
        rootSubmenuKeys.push(item.key);
      });
      if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({openKeys});
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
    }
    // }
  };

  handleClick = (e) => {
    this.setState({current: e.key});
  };

  setMenu = (data) => {
    if (data != null) {
      return data.map((item, index) => {
        if (item.sub && item.sub.length) {
          return (
            <SubMenu
              key={item.key}
              title=
                {
                  !item.url && item.sub && item.sub.length ?
                  <span>
                    <MyIcon className={styles.navItem} type={item.icon || "iconxiangyou"}/>
                    <span className="wp-nav-font">{item.title}</span>
                  </span>
                    :
                    <Link to={item.url}>
                      <MyIcon className={styles.navItem} type={item.icon || "iconxiangyou"}/>
                      <span className="wp-nav-font">{item.title}</span>
                    </Link>
                }
            >
              {this.setMenu(item.sub, index)}
            </SubMenu>
          )
        } else {
          return (
            <Menu.Item key={item.key}>
              <Link to={item.url}>
                <MyIcon className={styles.navItem} type={item.icon || "iconxiangyou"}/>
                <span className="wp-nav-font">{item.title}</span>
              </Link>
            </Menu.Item>
          )
        }
      });
    }
  };

  render() {
    let t = this;
    let {collapsed} = this.props;
    return (
      <div className={styles.nav}>
        {
          collapsed &&
          <Menu
            theme="dark"
            openKeys={this.state.openKeys}
            mode={'vertical'}
            onOpenChange={this.onOpenChange}
            selectedKeys={[this.state.current]}
            onClick={this.handleClick.bind(t)}
          >
            {
              this.setMenu(navSettings)
            }
          </Menu>
        }
        {
          !collapsed &&
          <Menu
            theme="dark"
            mode={'inline'}
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            selectedKeys={[this.state.current]}
            onClick={this.handleClick.bind(t)}
          >
            {
              this.setMenu(navSettings)
            }
          </Menu>
        }
      </div>

    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(LeftNav);
