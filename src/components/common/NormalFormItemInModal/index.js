/**
 * Modal内Form表单下FormItem格式
 * 2018-3-7 加入span 动态配置
 *          input 动态style
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import {Form, Row, Col, Select, Input, Cascader, DatePicker, TimePicker, Radio, Button, TreeSelect,InputNumber} from 'antd';
import MyIcon from '../MyIcon/index';
import myStyles from './index.less';
import drop from '../../less/drop.less';
import styles from "../Filtrate/index.less";
import config from "../../../config";
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const {RangePicker} = DatePicker;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;

const onBlur=(name)=>{
  const params = {};
  let value = this.props.form.getFieldValue(name);
  params[name] = value;
  this.setState({params});
};
const NormalFormItemInModal = ({item, getFieldDecorator, offset, noOffset, disabled}) => {
  if (disabled)
    item.readonly = disabled;
  const formItemLayout = {
    labelCol: {span: 10},
    wrapperCol: {span: 14},
  };

  return (
    <div style={{display:item.show?'none':'block'}}>
      <Col span={item.span || 11} offset={offset?1:0} style={{...item.colStyle}}>
      {item.type === 'input' &&
      <FormItem label={item.label} colon={item.colon||false} {...item.formItemLayout||{...formItemLayout}}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || '',
            rules: item.rules || []
          })(
            <Input
              placeholder={item.placeholder || ''}
              disabled={item.readonly}
              style={item.style}
              onChange={item.onChange}
              onBlur={item.onBlur}
              addonBefore={item.addonBefore || ''}
              addonAfter={item.addonAfter || ''}
              maxLength={item.maxLength}
            />
          )}
      </FormItem>}
        {
          item.type === 'inputNumber'&&
          <FormItem label={item.label} className={item.className} style={item.style} colon={false}  {...item.formItemLayout||{...formItemLayout}} >
          {
            getFieldDecorator(item.paramName, {
              initialValue: item.initialValue ? item.initialValue : '',
              rules: item.rules || null
            })(
              <InputNumber style={{width: item.width || 90}}  min={item.min} max={item.max} placeholder={item.placeholder} disabled={item.readonly} addonAfter={item.after} onBlur={item.onBlur} onChange={item.onChange}/>
            )
          }
          </FormItem>
        }
        {
          item.type==='rangePicker'&&
          <FormItem className={styles['range-picker']} label={item.label} {...item.formItemLayout||{...formItemLayout}} colon={item.colon||false}>
            {
              getFieldDecorator(item.paramName, {
                initialValue: item.initialValue === null ? null : (item.initialValue && item.initialValue.length === 2 ? [moment(item.initialValue[0]), moment(item.initialValue[1])] : [moment().add(-1, 'months'), moment()]),
                rules: item.rules
              })(
                <RangePicker
                  showTime={item.showTime}
                  style={{width: item.width}}
                  format={item.format}
                  onChange={item.onChange}
                  disabledDate={item.disabledDate}
                  disabled={item.readonly}
                  ranges={item.ranges}
                >
                </RangePicker>
              )
            }
          </FormItem>
        }
      {item.type === 'searchInput' &&
      <FormItem label={item.label} colon={false}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || '',
            rules: item.rules || []
          })(
            <Search
              className={myStyles.searchInput}
              onSearch={item.onSearch}
              enterButton
              disabled={item.readonly}
              style={[item.style, {height: '28px'}]}
            />
          )}
      </FormItem>}
      {item.type === 'textArea' &&
      <FormItem label={item.label} colon={false} style={{minHeight: 70,width:item.width}} {...item.formItemLayout||{...formItemLayout}}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || '',
            rules: item.rules || []
          })(
            <TextArea
              disabled={item.readonly}
              autosize={{minRows: 2, maxRows: 4}}
              maxLength={item.maxLength}
              style={{width:item.width}}
              placeholder={item.placeholder}
            />
          )}
      </FormItem>}
      {item.type === 'select' &&
      <FormItem label={item.label} colon={item.colon||false} className={item.className} {...item.formItemLayout||{...formItemLayout}}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || (item.mode?[]:''),
            rules: item.rules || []
          })(
            <Select onChange={item.onChange} disabled={item.readonly} mode={item.mode} dropdownClassName={myStyles['select']} allowClear={item.allowClear} optionFilterProp={'children'} showSearch={!item.showSearch} dropdownStyle={{...item.dropdownStyle}} onSelect={item.onSelect} style={{width:item.width,maxHeight:'150px !important',}} getPopupContainer={() => !item.fixed?(document.getElementById('content')||document.getElementsByClassName('ant-modal-body')[0]):document.getElementsByTagName('body')[0]}>
              {item.options.map((optionItem, optionIndex) => (
                  <Option key={optionItem.value} value={optionItem.value} disabled={!!optionItem.disabled}>
                    {optionItem.text || optionItem.label}
                  </Option>
                )
              )}
            </Select>
          )}
      </FormItem>}
      {item.type === 'cascader' &&
      <FormItem label={item.label} colon={false}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || '',
            rules: item.rules || []
          })(
            <Cascader
              options={[]}
              placeholder="请选择"
            />
          )}
      </FormItem>}
      {item.type === 'areaPicker' &&
      <FormItem label={item.label} colon={false}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || '',
            rules: item.rules || []
          })(
            <Cascader
              options={item.options}
              placeholder="请选择"
              allowClear={item.allowClear}
              onChange={item.onChange}
            />
          )}
        {item.deleteShow &&
        <MyIcon
          type="icon-shanchu"
          onClick={item.deleteFun}
          style={{fontSize: 18, position: 'absolute', right: 7, top: -7, color: '#FC3737', zIndex: 200000}}
        />
        }
      </FormItem>}
      {item.type === 'datePicker' &&
      <FormItem label={item.label} colon={item.colon||false} {...item.formItemLayout||{...formItemLayout}}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || null,
            rules: item.rules || []
          })(
            <DatePicker showTime={item.showTime} onChange={item.onChange} disabled={item.readonly} format={item.format} style={{width:item.width}} disabledDate={item.disabledDate} onOpenChange={item.onOpenChange}/>
          )}
      </FormItem>}
      {item.type === 'timePicker' &&
      <FormItem label={item.label} colon={false}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || null,
            rules: item.rules || []
          })(
            <TimePicker disabledHours={item.disabledHours} onChange={item.onChange}/>
          )}
      </FormItem>}
        {
          item.type==='yearPicker'&&
          <FormItem className={styles.datePicker} label={item.label} colon={item.colon||false} {...item.formItemLayout||{...formItemLayout}}>
            {
              getFieldDecorator(item.paramName, {
                initialValue: item.initialValue ? item.initialValue : null,
                rules:item.rules||[]
              })(
                <DatePicker showTime={item.showTime}
                            onChange={item.onChange}
                            format={item.format}
                            open={item.open}
                            mode={item.mode}
                            style={{width: item.width||140}}
                            onOpenChange={item.onOpenChange}
                            onPanelChange={item.onPanelChange}
                            disabledDate={item.disabledDate}
                            disabledTime={item.disabledTime}
                            disabled={item.readonly}/>
              )
            }
          </FormItem>
        }
      {item.type === 'radio' &&
      <FormItem label={item.label} colon={false} style={{height: 40,marginTop:-10}} {...item.formItemLayout||{...formItemLayout}}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || null,
            rules: item.rules || []
          })(
            <RadioGroup /*onChange={(e) => item.onChange(e.target.value)}*/ onChange={item.onChange} style={{width:item.width||200}}>
              {
                item.options.map(option => (
                    <Radio key={option.value} value={option.value}>
                      {option.text}
                    </Radio>
                  )
                )}
            </RadioGroup>
          )}
      </FormItem>}
      {item.type === 'iconButton' && item.show &&
      <span onClick={item.onClick}
            title={item.title}
            style={{position: 'relative', top: 25, left: -40, cursor: 'pointer'}}>
      <MyIcon type={item.icon} style={item.style}/>
    </span>}
      {item.type === 'button' &&
      <span style={{display: 'inline-block', height: 75, position: 'relative', top: 25,}}>
     <Button onClick={item.onClick} style={{height: 28}}>{item.label}</Button>
    </span>}
        {
          item.type==='title' &&
          <p style={{width:'100%',textAlign:'left',borderBottom:'1px solid #D2D2D2',fontSize:15,margin:'10px -5px 20px',lineHeight:'26px'}}>
            <span style={{borderTopLeftRadius:5,borderTopRightRadius:5,display:'inline-block',background:'#C8EEE9',padding:'0 20px',}}>{item.label}</span>
          </p>
        }
      {item.type === 'text' &&
      <FormItem label={item.label} colon={false}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || '',
            rules: item.rules || []
          })(
            <div>
              {item.initialValue}
            </div>
          )}
      </FormItem>}
      {item.type === 'empty' && <div style={{height: 75}}/>}
      {item.type === 'treeSelect' &&
      <FormItem label={item.label} colon={item.colon||false} {...item.formItemLayout||{...formItemLayout}} className={item.className}>
        {
          getFieldDecorator(item.paramName, {
            initialValue: item.initialValue || '',
            rules: item.rules || []
          })(
            <TreeSelect onChange={item.onChange}
                        disabled={item.readonly}
                        treeData={item.options}
                        multiple={item.multiple}
                        showSearch={item.showSearch}
                        dropdownClassName={item.dropdownClassName||drop.dropDown}
                        dropdownStyle={{height:'auto',maxHeight:200,...item.dropdownStyle}}
                        treeNodeFilterProp={'title'}
                        getPopupContainer={() =>document.getElementById('content')||document.getElementsByClassName('ant-modal-body')[0]}
                        treeCheckable={item.treeCheckable}
                        onSelect={item.onSelect}
            />
          )}
      </FormItem>}
      </Col>
    </div>
  )
};
function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(NormalFormItemInModal);
