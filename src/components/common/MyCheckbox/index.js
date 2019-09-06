import {Checkbox} from 'antd';
import styles from './index.less';
function MyButton({className, children, ...props}) {
  return (
    <Checkbox {...props} className={`${styles.myCheck} ${className}`}>
      {children}
    </Checkbox>
  )
}
export default MyButton;
