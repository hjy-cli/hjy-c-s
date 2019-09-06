/**
 * Created by GYL on Description:
 */
import React, {Component} from 'react';
import {Modal} from 'antd';
import styles from './index.less';

function CockpitModal({children, ...props}) {
  return (
    <Modal
      width={1000}
      className={styles['cockpit-modal']}
      footer={null}
      {...props}
    >
      {children}
    </Modal>
  )
}

export default CockpitModal;
