import React, {Component} from 'react';
import {Icon, Dropdown, Upload, Menu, message, Popconfirm, Modal, Button} from 'antd';
import {connect} from 'dva';
import MyIcon from '../MyIcon/index';
import styles from './index.less';
import common from '../../../less/universal-css.css';
import PublicService from "../../../services/PublicService";

class Container extends Component {
  state = {
    exportBoolean: false,
    containerHeight: 10,
  };

  componentDidMount() {
    this.setContainerHeight();
  }

  // 设置高度
  setContainerHeight = () => {
    let containerHeight = window.innerHeight - 40; // 窗口的高度减去margin
    let filtrate = document.getElementById("filtrate");  // 获取filtrate组件的高度
    let tabs = document.getElementsByClassName("ant-tabs-bar"); // 获取tabs的高度
    let app = document.getElementsByClassName("ant-layout-header"); // 获取顶部导航栏的高度
    // 含有filtrate时的操作
    if (filtrate) {
      let filtrateHeight = filtrate.offsetHeight;
      if (filtrateHeight) {
        containerHeight = containerHeight - filtrateHeight;
      }
    }
    // 含有tab页时的操作
    if (tabs && tabs.length) {
      let tabsHeight = tabs[0].offsetHeight;
      if (tabsHeight) {
        containerHeight = containerHeight - tabsHeight;
      }
    }
    // 减去头部
    if (app && app.length) {
      let appHeight = app[0].offsetHeight;
      if (appHeight) {
        containerHeight = containerHeight - appHeight;
      }
    }
    this.setState({
      containerHeight
    }, () => {
      this.setTableHeight()
    });
  };

  // 设置tableY的高度
  setTableHeight = () => {
    let tableHeight = this.state.containerHeight - 30;
    let PublicContainerHeader = document.getElementById("PublicContainerHeader"); // 获取按钮组的高度
    let PublicPage = document.getElementById("PublicPage"); // 获取分页器的高度
    if (PublicContainerHeader) {
      let PublicContainerHeaderHeight = PublicContainerHeader.offsetHeight;
      tableHeight = tableHeight - PublicContainerHeaderHeight;
    }
    if (PublicPage) {
      let PublicPageHeight = PublicPage.offsetHeight;
      tableHeight = tableHeight - PublicPageHeight;
    }
    this.props.dispatch({type: 'public/saveCompanies', payload: {tableHeight}});
  };

  // 调用父组件相应方法
  doFatherFunction(fatherFunction) {
    let t = this;
    t.props[fatherFunction]();
  }

  exportHandle(status) {
    this.setState({
      exportBoolean: true
    });
    this.props.exportBtn(status)
  }

  checkHandle(status) {
    this.props.checkBtn(status)
  }

  // 额外按钮的点击事件
  extraBtnClick(btnIndex) {
    let t = this;
    let funNameStr = t.props.extraBtn[btnIndex].funName;
    t.props[funNameStr]();
  }

  render() {
    let t = this;
    let {containerHeight} = t.state;
    let {style, importBtnUrl} = t.props;
    const uploadProps = {
      name: 'file',
      action: importBtnUrl,
      showUploadList: false,
      accept: '.xls, .xlsx',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      },
      onSuccess(info) {
        console.log(info, "onSuccess");
        if (info.rc !== 0) {
          message.error(info.err);
        } else {
          message.success('文件上传成功');
          t.props.onSuccess();
        }
      }
    };

    let extraBtn = t.props.extraBtn || [];
    const menuImport = (
      <Menu>
        <Menu.Item key="0" style={{textAlign: 'center'}}>
          <Upload {...uploadProps}>
            <span>导入</span>
          </Upload>
        </Menu.Item>
        {
          t.props.templateUrl &&
          <Menu.Item key="1">
            <span className={styles.exportLine}> </span>
            <span><a href={t.props.templateUrl} style={{color: '#6b6b6b'}}>下载模板</a></span>
          </Menu.Item>
        }
        {
          t.props.templateEvent &&
          <Menu.Item key="1">
            <span className={styles.exportLine}> </span>
            <span onClick={t.props.onTemplate}><a style={{color: '#6b6b6b'}}>下载模板</a></span>
          </Menu.Item>
        }
      </Menu>
    );
    return (
      <div className={styles.container} id="container" style={{height: t.props.height || containerHeight, ...style}}>
        {
          !t.props.headerHide &&
          <div className={styles.containerHeader} id="PublicContainerHeader">
            {
              t.props.subTitle &&
              <span className="wp-container-header-subtitle">{t.props.subTitle}</span>
            }

            {/* 关闭 */}
            {
              t.props.closeTitle &&
              <MyIcon onClick={this.props.closeTitleFn} className={styles.close} type="icon-guanbi"/>
            }

            {/* 新增 */}
            {
              t.props.addBtnShow &&
              <span onClick={t.props.addBtn} className={styles.functionItem}>
                <MyIcon className={styles.btnItem} style={{color: '#16b8be'}} type="iconxinzeng"/>
                <span>新增</span>
              </span>
            }

            {/* 导出 */}
            {
              t.props.exportBtnShow &&
              <span onClick={t.props.exportBtn} className={styles.functionItem}>
                <MyIcon className={styles.btnItem} type="icondaochu"/>
                <span>导出</span>
              </span>
            }

            {/* 导出本页/导出全部 */}
            {
              t.props.exportBtnShowAll &&
              <Popconfirm
                onConfirm={t.props.exportBtn.bind(t, 'all')}
                onCancel={t.props.exportBtn.bind(t, 'part')}
                title={`${t.props.text ? t.props.text : "导出全部"} / ${t.props.cancelText ? t.props.cancelText : "导出本页"}?`}
                okText={t.props.text || '导出全部'}
                cancelText={t.props.cancelText || "导出本页"}
                placement="bottom">
                  <span className={styles.functionItem}>
                    <MyIcon className={styles.btnItem} type="icondaochu"/>
                    <span>导出</span>
                  </span>
              </Popconfirm>
            }

            {/* 导入 */}
            {
              t.props.importBtnUrl && t.props.importBtnShow &&
              <Dropdown overlay={menuImport} trigger={['click']}>
                <span className={styles.functionItem}>
                  <MyIcon className={styles.btnItem} style={{color: '#AD71FF'}} type="icondaoru"/>
                  <span>导入</span>
                </span>
              </Dropdown>
            }


            {/* 打印 */}
            {
              t.props.printTitle &&
              <span onClick={this.props.printFn} className={styles.functionItem}>
                <MyIcon className={styles.btnItem} style={{color: '#4488B7'}} type="iconprint"/>
                <span>打印</span>
              </span>
            }

            {/* 编辑 */}
            {
              t.props.editTitle &&
              <span onClick={this.props.editsFn} className={styles.functionItem}>
                <MyIcon className={styles.btnItem} style={{color: '#16b8be'}} type="iconbianji"/>
                <span>{this.props.editContent}</span>
              </span>
            }

            {/* 删除 */}
            {
              t.props.deleteBtnShow &&
              <span onClick={this.props.deleteBtn} className={styles.functionItem}>
                <MyIcon className={styles.btnItem} style={{color: '#FF2938'}} type="iconshanchu"/>
                <span>删除</span>
              </span>
            }

            {/* 自定义 */}
            {
              extraBtn.map((item, index) => {
                let iconStyle = item.iconStyle || {};
                return (
                  <span
                    key={index}
                    onClick={t.extraBtnClick.bind(t, index, item.funName)}
                    className={`${styles.functionItem} ${item.className}`}>
                      <MyIcon className={styles.btnItem} style={{color: item.color, ...iconStyle}} type={item.icon}/>
                      <span>{item.name}</span>
                  </span>
                )
              })
            }
          </div>
        }
        <div>
          {t.props.children}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Container);
