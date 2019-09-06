import React from 'react';
import styles from './index.less';
import MyIcon from "../../common/MyIcon/index";

const CockpltTitle = ({name, hasLine, icon = 'iconxiangyou'}) => {
  return (
    <div className={styles.myTitle}>
      <MyIcon type={icon}/>
      <span className={hasLine && styles.hasLine}>{name}</span>
    </div>
  )
}

export default CockpltTitle



