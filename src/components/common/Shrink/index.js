/**
 * Created by GYL on  Description: 收缩组件
 */
import React, {Component} from 'react';
import {Row, Col, Checkbox, Icon, Tooltip, notification} from 'antd';
import styles from './index.less';
import PublicTemplate from "../../../services/PublicTemplate";

class Shrink extends Component {
  static defaultProps = {
    title: "自定义指标:",
    minSelect: 1,
    maxSelect: 6,
    maxLength: 8,
    shrinkType: 'check',
    column: 4
  };

  state = {
    open: false,
    showTotal: 4,
    dataSource: []
  };

  componentWillMount() {
    let {column, dataSource} = this.props;
    this.setState({
      showTotal: column,
      dataSource
    })
  }

  componentWillReceiveProps(nextProps) {
    let {showTotal} = this.state;
    if (nextProps && nextProps.dataSource && nextProps.dataSource.length) {
      this.setState({
        dataSource: nextProps.dataSource
      })
    }
    if (nextProps && nextProps.column && !showTotal) {
      this.setState({
        showTotal: nextProps.column,
      })
    }
  }

  componentDidMount() {
    let t = this;
  };

  // 选择
  checkChange = (i, e) => {
    let {dataSource} = this.state;
    let {handleChange, minSelect, maxSelect} = this.props;
    dataSource[i].checked = e.target.checked;
    let list = dataSource.filter(item => item.checked);
    if (list.length < minSelect) {
      dataSource[i].checked = !e.target.checked;
      return notification['error']({
        message: <span style={{color: "#FFF"}}>警告</span>,
        duration: 2,
        description: `至少选择${minSelect}个指标`,
        style: {backgroundColor: '#F89406', color: "#FFF"}
      });
    } else if (list.length > maxSelect) {
      dataSource[i].checked = !e.target.checked;
      return notification['error']({
        message: <span style={{color: "#FFF"}}>警告</span>,
        duration: 2,
        description: `指标最多选择${maxSelect}个`,
        style: {backgroundColor: '#F89406', color: "#FFF"}
      });
    }
    this.setState({
      dataSource
    }, () => {
      if (handleChange) {
        handleChange(list);
      }
    });
  };

  // 单选
  radioChange = (index, checked) => {
    let {dataSource} = this.state;
    let {handleChange} = this.props;
    if (checked) {
      return;
    }
    dataSource.map(item => item.checked = false);
    dataSource[index].checked = true;
    this.setState({
      dataSource
    }, () => {
      if (handleChange) {
        let list = dataSource.filter(item => item.checked);
        handleChange(list);
      }
    });
  };

  // 收缩
  onOpenChange = () => {
    let {open} = this.state;
    let {column, dataSource} = this.props;
    this.setState({
      showTotal: open ? column : dataSource.length,
      open: !open,
    })
  };

  render() {
    let t = this;
    let {open, showTotal, dataSource} = t.state;
    let {column, title, colStyle, shrinkType, maxLength} = t.props;
    let colSpan = column ? 24 / column : 6;
    return (
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <Row className={styles.list} gutter={12}>
          {
            dataSource && dataSource.length > 0 &&
            dataSource.map((item, index) => {
              if (index < showTotal) {
                return (
                  <Col key={index} span={colSpan} style={{marginBottom: 2, ...colStyle}}>
                    {
                      shrinkType === 'check' ?
                        <Checkbox
                          checked={item.checked}
                          onChange={t.checkChange.bind(t, index)}>
                          {
                            (item.label && item.label.length >= maxLength) ?
                              <Tooltip title={item.label}>
                                <span>{PublicTemplate.stringToEllipsis(item.label, maxLength)}</span>
                              </Tooltip>
                              : <span>{item.label}</span>
                          }
                        </Checkbox>
                        :
                        <div style={{color: item.checked ? '#008CEE' : null, cursor: 'pointer'}}
                             onClick={t.radioChange.bind(t, index, item.checked)}>
                          {
                            (item.label && item.label.length >= 8) ?
                              <Tooltip title={item.label}>
                                <span>{PublicTemplate.stringToEllipsis(item.label, 8)}</span>
                              </Tooltip>
                              : <span>{item.label}</span>
                          }
                        </div>
                    }

                  </Col>
                )
              }
            })
          }
        </Row>
        {
          dataSource && dataSource.length + 1 > showTotal &&
          <div className={styles.btn} onClick={t.onOpenChange}>
            <span>{open ? "收起" : "展开"}</span>
            <Icon type={open ? "up" : "down"} style={{paddingLeft: 8}}/>
          </div>
        }
      </div>
    )
  }
}

export default Shrink;
