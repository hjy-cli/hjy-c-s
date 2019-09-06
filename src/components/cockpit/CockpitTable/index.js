/***
 * table组件 定制了表头样式
 */
import React, {Component} from 'react';
import {Table} from 'antd';
import styles from './index.less';

class CockpitTable extends Component {

  render() {
    return (
      <div className={styles["cockpit-table"]}>
        <div className={styles["headerbg-left"]}/>
        <div className={styles["headerbg-right"]}/>
        <Table {...this.props} className={styles["cockpitTB"]}/>
      </div>
    )
  }
}

export default CockpitTable;
