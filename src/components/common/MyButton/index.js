import {Button} from 'antd';
import styles from './index.less';
function MyButton({className, children, ...props}) {
  return (
    <Button {...props} className={`${styles.myBtn} ${className}`}>
      {children}
    </Button>
  )
}
export default MyButton;
