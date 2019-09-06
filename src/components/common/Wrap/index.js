/**
 * Created by GYL on  Description: 详情
 */
import React, {PropTypes} from 'react';
import styles from './index.less';

Wrap.defaultProps = {
  title: '',
  style: {}
};

function Wrap({title, children, style}) {
  return(
    <div className={styles.wrap} id="wrap">
      <div className={`${title ? styles.wrapT : styles.noTitle}`} id="wrapTitle">{title}</div>
      <div className={styles.wrapB} style={style}>
        {children}
      </div>
    </div>
  )
};

export default Wrap;
