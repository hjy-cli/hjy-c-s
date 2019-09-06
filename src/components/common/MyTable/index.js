/***
 * table组件 定制了表头样式
 */
import React, {Component} from 'react';
import {Table} from 'antd';
import styles from './index.less';
import config from '../../../config';

class MyTable extends Component {
  static defaultProps = {
    columnLayer: 1 // 头部的层级(以children来划分)
  };

  state = {
    tableHeight: 700
  };

  componentDidMount() {
    window.setTimeout(() => {
      this.setTableHeight();
    }, 10)
  };

  // 设置表格的高度
  setTableHeight = () => {
    let {columnLayer} = this.props;
    let tableHeight = 700;
    let ContainerHeader = document.getElementById("container"); // 获取按钮组的高度
    let PublicContainerHeader = document.getElementById("PublicContainerHeader"); // 获取按钮组的高度
    let PublicPageHeader = document.getElementById("PublicPage"); // 获取按钮组的高度
    if (ContainerHeader) {
      tableHeight = ContainerHeader.offsetHeight - 20 - (columnLayer * 30);
    }
    if (PublicContainerHeader) {
      let PublicContainerHeaderHeight = PublicContainerHeader.offsetHeight;
      tableHeight = tableHeight - PublicContainerHeaderHeight;
    }
    if (PublicPageHeader) {
      let PublicPageHeaderHeight = PublicPageHeader.offsetHeight;
      tableHeight = tableHeight - PublicPageHeaderHeight - 6;
    }
    this.setState({
      tableHeight
    });
  };

  render() {
    let {tableHeight} = this.state;
    let {scroll, hideY, tableHeightCustom} = this.props;
    tableHeightCustom && (tableHeight = tableHeightCustom);
    if (this.props.columns && this.props.columns.length !== 0) {
      for (let i = 0; i < this.props.columns.length; i++) {
        this.props.columns[i].className =
          this.props.columns[i].className ? this.props.columns[i].className + ' wpColumn' : 'wpColumn';
      }
    }
    return (
      <div className={styles.myTable}>
        <Table
          size={this.props.size || 'middle'}
          scroll={
            hideY ?
              {
                x: (scroll && scroll.x) ? scroll.x : null
              }
              :
              {
                x: (scroll && scroll.x) ? scroll.x : null,
                y: (scroll && scroll.y) ? scroll.y : tableHeight
              }
          }
          {...this.props}/>
      </div>
    )
  }
}

export default MyTable;
