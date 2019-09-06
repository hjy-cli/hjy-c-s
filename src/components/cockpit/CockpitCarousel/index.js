import {Carousel} from 'antd';
import styles from './index.less';

function CockpitCarousel({children, ...props}) {
  return (
    <div className={styles["cockpit-carousel"]}>
      <Carousel initialSlide={0} autoplay={true} {...props}>
        {children}
      </Carousel>
    </div>

  )
}

export default CockpitCarousel;
