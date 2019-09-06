import {Spin} from 'antd';
import Title from "../CockpltTitle/index";
import CockpitContainer from "../CockpitContainer/index";
import styles from './index.less';

function CockpitWrap({loading = false, height = 270, title, headerSub, children, style = {}}) {
  let conStyle = {
    height: height - 40,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    ...style
  };

  return (
    <Spin spinning={loading}>
      <CockpitContainer>
        <div className={styles.wrap} style={{height}}>
          <div className={styles["wrap-header"]}>
            <Title name={title}/>
            {headerSub}
          </div>
          <div className={styles["wrap-content"]} style={{...conStyle}}>
            {children}
          </div>
        </div>
      </CockpitContainer>
    </Spin>

  )
}

export default CockpitWrap;
