/**
 * Created by GYL on 2018/8/14 图片查看
 */
import React, {Component} from 'react';
import MyModal from '../MyModal/index';
import PictureGallery from "../PictureGallery/index";
import styles from './index.less';

class ModalPictureGallery extends Component {
  static defaultProps = {
    pictrues: [],
    currentIndex: 0,
    cockpit: false
  };

  render() {
    let t = this;
    let {pictrues, currentIndex, cockpit} = t.props;
    const WIDTH = document.body.clientWidth;
    return (
      <MyModal
        title={"查看图片"}
        className={`${styles.modalPictureGallery} ${cockpit && styles.cockpitModal}`}
        {...t.props}
        width={WIDTH > 1500 ? 1600 : 900}
      >
        <div className={styles.modalWrap}>
          <PictureGallery
            pictrues={pictrues}
            currentIndex={currentIndex}
          />
        </div>
      </MyModal>
    )
  }
}

export default ModalPictureGallery;

