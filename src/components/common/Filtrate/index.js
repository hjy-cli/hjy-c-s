/**
 * 表格上方筛选条件
 * input 输入框, select 下拉选, rangePicker 时间筛选框
 */
import {Form, Input, Select, Button, DatePicker, Divider, Col, Tag, TreeSelect, Checkbox, Radio} from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
import config from '../../../config';
import Util from '../../../utils/Util';
import styles from './index.less';
import MyIcon from '../MyIcon/index';
import Shrink from "../Shrink/index";
import MyButton from "../MyButton/index";

const {RangePicker, MonthPicker} = DatePicker;
const FormItem = Form.Item;
const {CheckableTag} = Tag;
const RadioGroup = Radio.Group;

function disabledDate(current) {
  // 当天以后时间禁选,组件传值   disabledDate:true
  return current && current.valueOf() > Date.now();
}

class Filtrate extends Component {
  state = {
    myRangePickerValue: null,
    myRangePickerParamName: '',
    startValue: null,
    endValue: null,
    endOpen: false,
    endOpen2: false,
    checkBtnItems: this.props.checkBtnConfig ? this.props.checkBtnConfig.items : [],
    yearOpen: false,
  };

  componentDidMount() {
    let t = this;
    t.setState({
      params: t.props.form.getFieldsValue()
    });
  }

  submit() {
    let t = this;
    // Form 组件参数
    let params = t.props.form.getFieldsValue();
    if (this.state.myRangePickerValue && this.state.myRangePickerParamName)
      params[this.state.myRangePickerParamName] = this.state.myRangePickerValue;
    let {submit} = t.props;
    submit(params);
  }

  // 清空 Form 组件输入的内容
  clearForm() {
    let t = this;
    if (this.state.checkBtnItems && this.state.checkBtnItems.length > 0) {
      let checkBtnItems = [...this.state.checkBtnItems];
      checkBtnItems.map((item, index) => {
        item.status = false;
      });
      this.setState({
        checkBtnItems
      });
    }
    if (t.props.isMyClear === true) {
      let {myClearBtn} = t.props;
      t.props.form.resetFields();
      myClearBtn();
    } else {
      t.props.form.resetFields();
    }

  }

  // 额外按钮点击事件
  extraBtnClick(btnIndex) {
    let t = this;
    let funNameStr = t.props.extraBtn[btnIndex].funName;
    t.props[funNameStr]();
  }

  selectedChange(fun, nextParams, paramName, value) {
    let t = this;
    let params = {};
    params[paramName] = value;
    if (paramName) {
      t.setState({params});
    }
    if (typeof fun === "function") {
      fun(value);
      if (nextParams)
        t.props.form.setFieldsValue({
          [nextParams]: ''
        })
    }
  }

  // 月份选择
  onChangeMonth = (paramName, type) => {
    let t = this;
    let oldDate = t.props.form.getFieldValue(paramName);
    let date;
    if (type === 'up') {
      date = moment(oldDate).subtract(1, 'months');
    } else {
      date = moment(oldDate).add(1, 'months');
    }
    t.props.form.setFieldsValue({
      [paramName]: date
    })
  };

  // 筛选条件组件change事件
  getChangeValue(value, e) {
    let t = this;
    let params = {};
    params[value] = e.target.value;
    t.setState({params});
  }

  onChange = (field, value) => {
    this.props.form.setFieldsValue({
      [field]: value,
    });
  };

  onStartChange = (type, value) => {
    this.onChange(type, value);
  };

  onEndChange = (type, value) => {
    this.onChange(type, value);
  };
  handleStartOpenChange = (state, open) => {
    if (state) {
      if (!open) {
        this.setState({[state]: true});
      }
    } else {
      if (!open) {
        this.setState({endOpen: true});
      }
    }
  };

  handleEndOpenChange = (state, open) => {
    if (state) {
      this.setState({[state]: open});
    } else {
      this.setState({endOpen: open});
    }
  };
  disabledStartDate = (type, startValue) => {
    const endValue = this.props.form.getFieldValue(type);
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (type, endValue) => {
    const startValue = this.props.form.getFieldValue(type);
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  resetSelectValue = (name) => {
    this.props.form.resetFields(name)
  };
  openPicker = (open) => {
    this.setState({
      open
    });
  };
  changeYear = (param, value) => {
    const t = this;
    const {setFieldsValue} = this.props.form;
    setFieldsValue({
      [param]: moment(value)
    }, () => {
      t.setState({
        open: false,
      });
    });
  };

  render() {
    let t = this;
    let {items} = t.props;
    let extraBtn = t.props.extraBtn || [];
    let {getFieldDecorator} = t.props.form;
    // 是否显示清空按钮 默认显示
    let clearBtnShow = true;
    if (t.props.clearBtn === 'hide') {
      clearBtnShow = false;
    }
    // 是否显示查询按钮 默认显示
    let submitBtnShow = true;
    if (t.props.submitBtn === 'hide') {
      submitBtnShow = false;
    }
    return (
      <div className={styles.base} id="filtrate">
        <Form layout="inline" key="myForm">
          {
            items && items.map((item, index) => {
              if (item.type === 'input') {
                return (<FormItem label={item.label} key={index} className={item.className} style={item.style}>
                  {
                    getFieldDecorator(item.paramName, {
                      initialValue: item.initialValue ? item.initialValue : '',
                      rules: item.rules || null
                    })(
                      <Input onChange={t.getChangeValue.bind(t, item.paramName)} size={config.size} style={item.wrapStyle}
                             placeholder={item.placeholder} disabled={item.disabled}/>
                    )
                  }
                </FormItem>)
              } else if (item.type === 'radio') {
                return (
                  <FormItem label={item.label} key={index} className={item.className}>
                    {
                      getFieldDecorator(item.paramName, {
                        initialValue: item.initialValue ? item.initialValue : '',
                        rules: item.rules || null
                      })(
                        <RadioGroup onChange={item.onChange}>
                          {
                            item.options.map((option, index) => {
                              return (
                                <Radio key={index} value={Util.numToString(option.value)}
                                >
                                  {option.label}
                                </Radio>

                              )
                            })
                          }
                        </RadioGroup>
                      )
                    }
                  </FormItem>)
              } else if (item.type === 'line') {
                return (
                  <Divider key={index} type="vertical" style={{margin: '10px 20px', height: 24}}/>
                )
              } else if (item.type === 'lineH') {
                return (
                  <div key={index} style={{width: '98%', margin: '0 auto', height: 1, borderTop: '1px dashed #DDD'}}/>
                )
              } else if (item.type === 'shrink') {
                return (
                  [<div key={index} style={{width: '98%', margin: '0 auto', height: 1, borderTop: '1px dashed #DDD'}}/>,
                    <FormItem key={index + "a"} style={{width: '80%'}} colon={false}
                              wrapperCol={{span: 24}}>
                      <div style={{width: '100%'}}>
                        {
                          item.dataSource && item.dataSource.length > 0 &&
                          <Shrink
                            title={item.title}
                            shrinkType={item.shrinkType}
                            colStyle={{height: 30}}
                            column={item.column || 6}
                            maxLength={item.maxLength}
                            handleChange={item.handleChange}
                            dataSource={item.dataSource}/>
                        }
                      </div>
                    </FormItem>]

                )
              } else if (item.type === 'dateRange') {
                return (
                  <FormItem label={item.label} key={index}>
                    {
                      getFieldDecorator(item.paramName, {
                        initialValue: item.initialValue || moment().add(-1, 'days')
                      })(
                        <DatePicker
                          format={item.format || "YYYY-MM-DD"}
                          showTime={item.showTime || false}
                          allowClear={item.allowClear || false}
                          disabledDate={this.disabledStartDate.bind(this,item.paramName2)}
                          onChange={this.onStartChange.bind(this,item.paramName)}
                          onOpenChange={this.handleStartOpenChange.bind(this,item.state)}
                          size={config.size}>
                        </DatePicker>
                      )
                    }
                    <span style={{marginLeft: 25, color: "#333"}}>{item.label2}</span>
                    {
                      getFieldDecorator(item.paramName2, {
                        initialValue: item.initialValue2 || moment()
                      })(
                        <DatePicker
                          format={item.format || "YYYY-MM-DD"}
                          showTime={item.showTime || false}
                          allowClear={item.allowClear || false}
                          disabledDate={this.disabledEndDate.bind(this,item.paramName)}
                          onChange={this.onEndChange.bind(this,item.paramName2)}
                          open={this.state[item.state?item.state:'endOpen']}
                          onOpenChange={this.handleEndOpenChange.bind(this,item.state)}
                          size={config.size}>
                        </DatePicker>
                      )
                    }
                  </FormItem>
                )
              } else if (item.type === 'checkBoxGroup') {
                return (
                  <FormItem label={item.label} key={index}>
                    {
                      getFieldDecorator(item.paramName, {
                        initialValue: item.initialValue || [],
                        rules: item.rules || [],
                      })(
                        <Checkbox.Group
                          options={item.options}
                          disabled={item.disabled}
                          onChange={item.onChange}/>
                      )
                    }
                  </FormItem>
                )
              } else if (item.type === 'checkbox') {
                return (
                  <FormItem key={index} className={item.className} style={{marginLeft: 40}}>
                    {
                      getFieldDecorator(item.paramName, {
                        valuePropName: 'checked',
                        initialValue: item.initialValue || null,
                        rules: item.rules || null
                      })(
                        <Checkbox>{item.label}</Checkbox>
                      )
                    }
                  </FormItem>)
              } else if (item.type === 'select') {
                return (<FormItem label={item.label} key={index} className={item.className} style={item.style}>
                  {
                    getFieldDecorator(item.paramName, {
                      initialValue: item.initialValue || (item.options[0] ? Util.numToString(item.options[0].value) : item.options[0]),
                    })(
                      <Select
                        combobox
                        size={config.size}
                        labelInValue={item.labelInValue}
                        showSearch
                        mode={item.mode}
                        style={item.width ? {width: '200px'} : {}}
                        optionFilterProp="children"
                        dropdownMatchSelectWidth={t.props.dropdownMatchSelectWidth}
                        onChange={t.selectedChange.bind(t, item.selectChange, item.nextParamName || false, item.paramName)}
                        onSelect={item.onSelect}
                        disabled={item.disabled}
                      >
                        {
                          item.options.map((option, index) => {
                            return (
                              <Select.Option key={index}
                                             value={Util.numToString(option.value)}
                              >
                                {option.text}
                              </Select.Option>

                            )
                          })
                        }
                      </Select>
                    )
                  }
                </FormItem>)
              } else if (item.type === 'button'){
                return (
                  <FormItem key={index}>
                    <MyButton size={config.size}
                              type="primary"
                              onClick={item.onClick}
                    >
                      {item.label}
                    </MyButton>
                  </FormItem>
                )
              } else if (item.type === 'treeSelect') {
                return (
                  <FormItem key={item.paramName} label={item.label} colon={item.colon}>
                    {
                      getFieldDecorator(item.paramName, {
                        initialValue: item.initialValue || '',
                        rules: item.rules || []
                      })(
                        <TreeSelect
                          size={config.size}
                          onChange={item.onChange}
                          style={{width: item.width}}
                          disabled={item.disabled}
                          dropdownClassName={item.dropdownClassName}
                          dropdownStyle={{height: 'auto', maxHeight: 200, ...item.dropdownStyle}}
                          treeData={item.options}
                          treeCheckable={item.treeCheckable}
                          onSelect={item.onSelect}
                        />
                      )}
                  </FormItem>
                )
              } else if (item.type === 'rangePicker') {

                let disabled = item.disabledDate ? disabledDate : null;

                return (<FormItem className={styles['range-picker']} label={item.label}
                                  key={index}>
                  {
                    getFieldDecorator(item.paramName, {
                      initialValue: item.initialValue === null ? null : (item.initialValue && item.initialValue.length === 2 ? [moment(item.initialValue[0]), moment(item.initialValue[1])] : [moment().add(-1, 'months'), moment()]),
                      rules: item.rules
                    })(
                      <RangePicker
                        showTime={item.showTime}
                        style={{width: item.width}}
                        format={item.format}
                        size={config.size}
                        onChange={item.onChange}
                        disabledDate={item.disabledDate}
                        disabled={item.disabled}
                        ranges={item.ranges}
                      >
                      </RangePicker>
                    )
                  }
                </FormItem>)
              } else if (item.type === 'datePicker') {
                let disabled = item.disabledDate ? disabledDate : null;
                return (<FormItem className={styles.datePicker} label={item.label}
                                  key={index}>
                  {
                    getFieldDecorator(item.paramName, {
                      initialValue: item.initialValue ? item.initialValue : null
                    })(
                      <DatePicker size={config.size}
                                  showTime={item.showTime}
                                  onChange={item.onChange}
                                  format={item.format}
                                  allowClear={item.allowClear}
                                  style={{width: item.width || 140}}
                                  onOpenChange={item.onOpenChange}
                                  disabledDate={item.disabledDate}
                                  disabledTime={item.disabledTime}
                                  disabled={item.disabled}/>
                    )
                  }
                </FormItem>)
              } else if (item.type === 'yearPicker') {
                let disabled = item.disabledDate ? disabledDate : null;
                return (<FormItem className={styles.datePicker} label={item.label}
                                  key={index} style={item.style}>
                  {
                    getFieldDecorator(item.paramName, {
                      initialValue: item.initialValue ? item.initialValue : null
                    })(
                      <DatePicker size={config.size}
                                  showTime={item.showTime}
                                  onChange={item.onChange}
                                  format={'YYYY'}
                                  open={this.state.open}
                                  mode={'year'}
                                  style={{width: item.width || 140}}
                                  onOpenChange={this.openPicker}
                                  onPanelChange={this.changeYear.bind(this, item.paramName)}
                                  disabledDate={item.disabledDate}
                                  disabledTime={item.disabledTime}
                                  disabled={item.disabled}/>
                    )
                  }
                </FormItem>)
              } else if (item.type === 'monthPicker') {
                return (
                  <FormItem key={index} label={item.label}>
                    {
                      getFieldDecorator(item.paramName, {
                        initialValue: item.initialValue ? item.initialValue : moment()
                      })(
                        <MonthPicker
                          size={config.size}
                          allowClear={item.allowClear}
                          style={{width: item.width || 140}}
                          onChange={item.selectChange}
                        />
                      )
                    }
                  </FormItem>
                )
              }
            })
          }
          {
            (submitBtnShow || clearBtnShow) &&
            <FormItem>
              {
                submitBtnShow &&
                <MyButton size={config.size}
                          type="primary"
                          onClick={t.submit.bind(t)}
                          style={this.props.buttonStyle}
                >
                  查询
                </MyButton>
              }
              {
                clearBtnShow &&
                <MyButton size={config.size}
                          style={{marginLeft: 20}}
                          type="primary"
                          onClick={t.clearForm.bind(t)}
                >
                  重置
                </MyButton>
              }
            </FormItem>
          }
          {
            extraBtn.map((btn, btnIndex) => {
              return (
                <FormItem key={btnIndex}>
                  <MyButton size={config.size}
                          type="primary"
                          onClick={btn.extraBtnClick}
                  >
                    {btn.name}
                  </MyButton>
                </FormItem>
              )
            })
          }
        </Form>
      </div>

    )
  }
}

export default Form.create()(Filtrate);
