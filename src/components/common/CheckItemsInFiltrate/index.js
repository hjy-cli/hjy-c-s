/**
 * 搜索条件中的标签筛选
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import {Button,message} from 'antd';
import styles from './index.less';

class MyButton extends Component {
  state = {
    status: false
  };

  componentDidMount() {

  };

  //点击按钮事件
  onClick = () => {
    this.setState({
      status: !this.state.status
    })
  };

  render() {
    let t = this;
    const {label, afterColor, blurColor, onClick, status,AW,EW} = t.props;
    const checkedStyle = {
      backgroundColor: afterColor,
      color: '#fff',
      boxShadow: `2px 2px 6px ${blurColor || afterColor}`
    };
    return (
      <span style={{position:'relative'}}>
        <div className={`${styles.myBtn} ${styles.noSelect}`}
             style={status ? checkedStyle : null}
             onClick={onClick}
        >
          {label}
        </div>
        { //告警
          AW &&
          <div title={"告警数量"} className={styles.aw}>{AW}</div>
        }
        { // 预警
          EW &&
          <div title={"预警数量"} className={styles.ew}>{EW}</div>
        }
      </span>

    )
  }
}
class CheckItemsInFiltrate extends Component {
  state = {
    status: false,
    checkBtnItems: this.props.checkBtnItems,
  };

  componentDidMount() {

  };

  //获取已选中按钮的个数
  getCheckedNum = (btns) => {
    let num = 0;
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].status)
        num = num + 1;
    }
    return num;
  };

  //按钮点击事件
  onClick = (index) => {
    let checkBtnItems = [...this.state.checkBtnItems];
    //'全部'按钮的选中事件（使其他按钮失焦）
    if (checkBtnItems[index].type === 'all' && !checkBtnItems[index].status) {
      checkBtnItems = checkBtnItems.map(item => {
        item.status = false;
        return item
      });
    }
    //其他按钮的选中事件（使'全部'按钮失焦）
    else if (!checkBtnItems[index].status && checkBtnItems[index].type !== 'all') {
      checkBtnItems = checkBtnItems.map(item => {
        if (item.type === 'all')
          item.status = false;
        return item
      });
    }
    //此次点击前选中按钮的个数
    const checkedNum = this.getCheckedNum(checkBtnItems);
    //最多可被选中的个数
    const {maxChecked} = this.props;
    //改变当前被点击按钮的状态
    if (checkBtnItems[index].status||!maxChecked || (maxChecked && checkedNum < maxChecked)) {
      checkBtnItems[index].status = !checkBtnItems[index].status;
      this.setState({
        checkBtnItems
      });
    }
    else{
      message.warning(`最多可选择${maxChecked}个`)
    }
    //将选中的状态值传给父组件
    let values = [];
    for (let i = 0; i < checkBtnItems.length; i++) {
      if (checkBtnItems[i].status) {
        if (checkBtnItems[i].type === 'all')
          values = '';
        else
          values.push(checkBtnItems[i].value)
      }
    }
    const params = {
      [this.props.checkBtnParamName]: values
    };
    this.props.onClick(params);
  };

  render() {
    let t = this;
    let width = document.body.clientWidth;
    const {checkBtnItems} = t.state;
    const {checkBtnParamName} = t.props;
    return (
      <div style={{maxWidth:width-400}}>
        {
          checkBtnItems.map((item, index) =>
            <MyButton {...item}
                      key={index}
                      status={item.status}
                      onClick={t.onClick.bind(t, index)}
            />
          )
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(CheckItemsInFiltrate);
