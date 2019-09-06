/***
 * 容器组件 驾驶舱布局框
 */
import React from 'react';
import styles from './index.less';

function CockpitContainer({children, style, className}) {
  return (
    <div className={`${className} ${styles["cockpit-container"]}`} style={style}>
      <div className={styles["border-tl"]}/>
      <div className={styles["cockpit-container-content"]}>
        {children}
      </div>
      <div className={styles["border-br"]}/>
    </div>
  )
}

export default CockpitContainer;
