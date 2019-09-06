/***
 * Pagination组件 只封装了样式
 */
import React, {Component} from 'react';
import {Pagination} from 'antd';
import styles from './index.less'

class MyPagination extends Component {

  componentDidMount() {

  }

  showTotal = (total) => {
    return `总计 ${total} 条`;
  };

  render() {
    const t = this;
    return (
      <div className={styles.myPage} id="PublicPage">
        <Pagination
          showTotal={t.showTotal}
          hideOnSinglePage={false}
          size="small"
          {...this.props}
        />
      </div>
    )
  }
}

export default MyPagination;
