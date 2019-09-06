/**
 * Created by GYL on 2018/8/14
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import moment from 'moment'
import {
  Form, Row, Col, Select, Input, InputNumber, message, Modal, TimePicker, Checkbox, Upload, DatePicker, Radio, Button,
  Icon, TreeSelect
} from 'antd';
import MyModal from '../MyModal/index';
import Shrink from "../Shrink/index";
import styles from './index.less';

const {RangePicker, MonthPicker} = DatePicker;
const FormItem = Form.Item;
const {TextArea} = Input;
const RadioGroup = Radio.Group;

class PublicModal extends Component {
  state = {
    upList: [],
    upLoading: false,
    openPicker: false,
    previewVisible: false,
    previewImage: '',
    imgList: [],
    imgId: null,
    thumbnailFileIds: null,
  };

  componentDidMount() {
    let t = this;
    let {upList, thumbnailFileIds, imgList} = t.props;

    // 上传文件列表
    if (upList && upList.length) {
      this.setState({
        upList,
      });
    }

    // 预览文件列表
    if (thumbnailFileIds && thumbnailFileIds.length) {
      let thumbnailFileIds = thumbnailFileIds.map(item => (item.id)).join(',');
      this.setState({
        thumbnailFileIds
      })
    }

    // 图片列表
    if (imgList && imgList.length) {
      let imgId = imgList.map(item => (item.id)).join(',');
      this.setState({
        imgList: imgList,
        imgId,
      });
    }
  };

  // Modal保存按钮
  onModalSave = () => {
    this.props.form.validateFields((err, val) => {
      if (!err) {
        this.props.onModalSave(val)
      }
    });
  };

  // 上传成功
  onSuccess = (info) => {
    if (info.rc !== 0) {
      message.error(info.err);
    } else {
      message.success('文件上传成功');
      let upList = [...this.state.upList];
      upList.push({
        fileSuffix: info.ret.fileSuffix,
        relativeFolder: info.ret.relativeFolder,
        id: info.ret.id,
        orgName: info.ret.orgName,
        size: info.ret.size,
        remoteRelativeUrl: info.ret.relativeFolder,
        uploadTime: info.ret.uploadTime ? moment(info.ret.uploadTime).format('YYYY-MM-DD') : null,
      });
      this.setState({
        upList
      });
    }
    this.setState({
      upLoading: false
    })
  };

  // 删除附件
  onDelete = (index) => {
    let upList = [...this.state.upList];
    upList.splice(index, 1);
    upList.map((item, index) => {
      item.num = index + 1;
      item.key = index;
    });
    this.setState({
      upList
    });
  };

  // 时间
  onDateChange = (type, value) => {
    const {setFieldsValue} = this.props.form;
    setFieldsValue({
      [type]: moment(value)
    }, () => {
      this.setState({
        openPicker: false
      });
    })
  };

  // 弹出日历和关闭日历的回调
  onOpenChange = (status) => {
    this.setState({
      openPicker: status
    });
  };

  // 关闭预览模态框
  handleCancel = () => {
    this.setState({previewVisible: false})
  };

  // 打卡预览模态框
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  // 图片上传
  handleChange = ({file, fileList}) => {
    if (file.status === "done") {
      if (file.response && file.response.rc === 0) {
        message.success("上传成功！");
        fileList[fileList.length - 1].id = file.response.ret.id;
        let idList = fileList.map(item => (item.id)).join(',');
        let thumbnailFileIds = fileList.map(item => (item.response.ret.thumbnailPicture)).join(',');
        this.setState({imgList: fileList, imgId: idList, thumbnailFileIds})
      } else {
        message.error("上传失败！");
        return
      }
    } else {
      this.setState({imgList: fileList})
    }
  };

  // 上传前
  beforeUpload = () => {
    this.setState({
      upLoading: true
    })
  };

  render() {
    let t = this;
    let {upList, openPicker, upLoading} = t.state;
    const {items, column, width} = t.props;
    let col = column ? 24 / column : 12;
    let {getFieldDecorator} = t.props.form;
    const uploadProps = {
      name: 'file',
      showUploadList: false,
      onSuccess: t.onSuccess.bind(t),
      beforeUpload: t.beforeUpload.bind(t),
    };
    const {previewVisible, previewImage, imgList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <MyModal
        {...t.props}
        width={width || 700}
        onModalSave={t.onModalSave}
      >
        <Form>
          <Row gutter={12}>
            {
              items.map((item, index) => {
                if (item.type === 'black') { // 自定义块容器可用于简单的文字显示或其他自定义内容
                  return (
                    <Col key={index} span={item.span || 8} offset={item.offset} style={item.style}>
                      {
                        item.text &&
                        <div style={{paddingTop: 9, color: 'rgba(0,0,0,0.85)', fontSize: 14}}
                             className={item.rules ? styles.rules : null}>{item.text}</div>
                      }
                    </Col>
                  )
                } else if (item.type === "customWrap") { // 自定义组件容器
                  return (
                    <Col key={index} span={item.span || 24} offset={item.offset} style={{marginBottom: 10}}>
                      {
                        item.label &&
                        <div style={{marginBottom: 6}}>{item.label}</div>
                      }
                      {item.content}
                    </Col>
                  )
                } else if (item.type === 'title') { // 标题带有上传功能
                  return (
                    <Col key={index} span={24}>
                      <div className={styles['wp-tab']}>
                        <div className={styles['wp-tab-header']}>
                          <div>{item.content}</div>
                        </div>
                        {
                          item.upShow && [
                            <div key="a" style={{opacity: 0.6}}>附件只能上传一份，不限格式，多个请打包</div>,
                            <div key="b">
                              <Upload {...uploadProps} accept={item.accept} action={item.url}
                                      disabled={item.disabled || upList.length > 0}>
                                <Button loading={upLoading} type="primary" size="small"
                                        disabled={item.disabled || upList.length > 0}>
                                  {
                                    upLoading ?
                                      <span>上传中</span>
                                      :
                                      <span><Icon type="upload"/> 上传</span>
                                  }
                                </Button>
                              </Upload>
                            </div>
                          ]
                        }
                      </div>
                    </Col>
                  )
                } else if (item.type === 'list') { // 文件列表
                  return (
                    <Col key={index} span={24}>
                      {
                        upList && upList.length > 0 &&
                        upList.map((option, subIndex) => (
                          <Col key={subIndex} span={24} style={{marginBottom: 10}}>
                            <Col span={9} style={{paddingLeft: 20}}>{option.fileName}</Col>
                            <Col span={7}
                                 style={{textAlign: 'center'}}>{option.createTime && moment(option.createTime).format("YYYY-MM-DD HH:mm:ss")}</Col>
                            <Col span={8} style={{textAlign: 'right', paddingRight: 20}}>
                              <Col offset={item.disabled ? 19 : 12} span={6}><a
                                href={option.url}>下载</a></Col>
                              {
                                !item.disabled &&
                                <Col span={6}><a onClick={item.onDelete.bind(t, subIndex)}>删除</a></Col>
                              }
                            </Col>
                          </Col>
                        ))
                      }
                    </Col>
                  )
                } else if (item.type === 'shrink') { // 收缩
                  return (
                    <Col key={index} span={item.span || 8} offset={item.offset}
                         style={{...item.style, borderBottom: '1px dashed #DDD', padding: '10px 0'}}>
                      <Shrink
                        title={item.label}
                        shrinkType={item.shrinkType}
                        maxSelect={item.maxSelect || 6}
                        maxLength={item.maxSelect || 8}
                        column={item.column || 4}
                        handleChange={item.handleChange}
                        dataSource={item.dataSource}/>
                    </Col>
                  )
                } else if (item.type === 'inputNumber') { // 数字输入框
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset} style={item.style}
                         className={item.className}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                label={item.label}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue || "",
                            rules: item.rules || [],
                          })(
                            <InputNumber
                              step={item.step || 1}
                              max={item.max || 10000}
                              min={item.min || 1}
                              placeholder={item.placeholder || '请输入'}
                              disabled={item.disabled}
                              onChange={item.onChange}/>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'textArea') { // 多行输入
                  return (
                    <Col key={index} span={item.span || 24} style={{marginBottom: 10}} offset={item.offset}>
                      <FormItem className={styles.myTextArea} labelCol={{span: item.labelCol || 4}}
                                wrapperCol={{span: item.wrapperCol || 20}} label={item.label}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue || "",
                            rules: item.rules,
                          })(
                            <TextArea placeholder={item.placeholder || '请输入'} disabled={item.disabled}
                                      autosize={{minRows: 2, maxRows: 2}}/>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'select') { // 下拉选
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                key={item.paramName} label={item.label}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue,
                            rules: item.rules || [],
                          })(
                            <Select
                              showSearch
                              optionFilterProp="children"
                              disabled={item.disabled}
                              mode={item.mode}
                              onChange={item.onChange}
                              placeholder={item.placeholder || '请选择'}>
                              {
                                item.options && item.options.length > 0 &&
                                item.options.map(option => (
                                    <Select.Option key={option.value} value={option.value}>
                                      {option.text}
                                    </Select.Option>
                                  )
                                )}
                            </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'treeSelect') { // 树下拉
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                key={item.paramName} label={item.label}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue || '',
                            rules: item.rules || []
                          })(
                            <TreeSelect
                              onChange={item.onChange}
                              disabled={item.disabled}
                              treeData={item.options}
                              treeCheckable={item.treeCheckable}
                              onSelect={item.onSelect}
                            />
                          )}
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'radio') { // 单选
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset}>
                      <FormItem className={item.className} labelCol={{span: item.labelCol || 8}}
                                wrapperCol={{span: item.wrapperCol || 16}} label={item.label} colon={item.colon}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: (item.initialValue === false || item.initialValue === true) ? !!item.initialValue : null,
                            rules: item.rules || [],
                          })(
                            <RadioGroup onChange={item.onChange} disabled={item.disabled} options={item.options}/>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'radioButton') { // 单选按钮组
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                key={item.paramName} label={item.label}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue || '',
                            rules: item.rules || []
                          })(
                            <Radio.Group buttonStyle="solid" disabled={item.disabled} onChange={item.onChange}>
                              {
                                item.options && item.options.length > 0 &&
                                item.options.map(option => (
                                    <Radio.Button key={option.value} value={option.value} onClick={item.onClick}>
                                      {option.text}
                                    </Radio.Button>
                                  )
                                )}
                            </Radio.Group>
                          )}
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'checkBox') { // 多选
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset} style={item.style}>
                      <FormItem labelCol={{span: item.labelCol || 0}} wrapperCol={{span: item.wrapperCol || 24}}
                                style={{height: 40}}>
                        {
                          getFieldDecorator(item.paramName, {
                            valuePropName: 'checked',
                            initialValue: item.initialValue || false,
                            rules: item.rules || [],
                          })(
                            <Checkbox
                              onChange={item.onChange}
                              indeterminate={item.indeterminate}
                              disabled={item.disabled}>
                              {item.label}
                            </Checkbox>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'checkBoxGroup') { // 多选按钮组
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset} style={item.style}>
                      <FormItem className={styles.myTextArea} label={item.label} labelCol={{span: item.labelCol || 4}}
                                wrapperCol={{span: item.wrapperCol || 20}}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue || [],
                            rules: item.rules || [],
                          })(
                            <Checkbox.Group
                              options={item.options}
                              disabled={item.disabled}
                              style={{width: '100%'}}
                              onChange={item.onChange}/>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'timePicker') { // 时分秒选择
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset} className={item.className}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                label={item.label} colon={item.colon}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue,
                            rules: item.rules || null,
                          })(
                            <TimePicker
                              hideDisabledOptions={item.hideDisabledOptions || true} // 将不可选的选项隐藏
                              disabledHours={item.disabledHours}
                              placeholder={item.placeholder || '请选择'}
                              minuteStep={item.minuteStep}
                              onChange={item.onChange}
                              format={"HH:mm"}
                              disabled={item.disabled}
                              style={{width: '100%'}}/>
                          )
                        }
                      </FormItem>
                    </Col>)
                } else if (item.type === 'datePicker') { // 日期选择
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                label={item.label}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue,
                            rules: item.rules || null,
                          })(
                            <DatePicker
                              onChange={item.onChange}
                              showTime={item.showTime}
                              format={item.format}
                              disabledDate={item.disabledDate}
                              disabled={item.disabled}
                              style={{width: '100%'}}/>
                          )
                        }
                      </FormItem>
                    </Col>)
                } else if (item.type === 'datePickerTime') { // 日期加时分秒
                  return (
                    <Col key={index} span={item.span || 24} offset={item.offset}>
                      <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={item.label}
                                className={styles.datePickerTime}>
                        <Col span={10}>
                          {
                            getFieldDecorator(item.paramName, {
                              initialValue: item.initialValue,
                              rules: item.rules || null,
                            })(
                              <DatePicker disabledDate={item.disabledDate} onChange={item.onChange}
                                          showTime={item.showTime} format={item.format} disabled={item.disabled}
                                          style={{width: '100%'}}/>
                            )
                          }
                        </Col>
                        <Col span={5} offset={2}>
                          {
                            getFieldDecorator(item.paramTimeName, {
                              initialValue: item.initialTimeValue,
                              rules: item.rules || null,
                            })(
                              <TimePicker minuteStep={15} onChange={item.onChange} format={"HH:mm"}
                                          disabled={item.disabled} style={{width: '100%'}}/>
                            )
                          }
                        </Col>
                        <Col span={2} style={{textAlign: 'center'}}>至</Col>
                        <Col span={5}>
                          {
                            getFieldDecorator(item.paramTimeName2, {
                              initialValue: item.initialTimeValue2,
                              rules: item.rules || null,
                            })(
                              <TimePicker minuteStep={15} onChange={item.onChange} format={"HH:mm"}
                                          disabled={item.disabled} style={{width: '100%'}}/>
                            )
                          }
                        </Col>
                      </FormItem>
                    </Col>)
                } else if (item.type === 'monthPicker') { // 月份选择
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                label={item.label}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue,
                            rules: item.rules || null,
                          })(
                            <MonthPicker onChange={item.onChange} disabled={item.disabled} style={{width: '100%'}}/>
                          )
                        }
                      </FormItem>
                    </Col>)
                } else if (item.type === 'yearPicker') { // 年份选择
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                label={item.label}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue,
                            rules: item.rules || null,
                          })(
                            <DatePicker mode={"year"} onOpenChange={t.onOpenChange} open={openPicker}
                                        onPanelChange={t.onDateChange.bind(t, item.paramName)} format="YYYY"
                                        disabled={item.disabled} style={{width: '100%'}}/>
                          )
                        }
                      </FormItem>
                    </Col>)
                } else if (item.type === 'rangePicker') { // 时间段选择
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                label={item.label} key={index}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue,
                            rules: item.rules || null,
                          })(
                            <RangePicker
                              showTime={item.showTime}
                              style={{width: item.width}}
                              format={item.format}
                              onChange={item.onChange}
                              disabledDate={item.disabledDate}
                              disabled={item.disabled}
                              ranges={item.ranges}
                            />
                          )
                        }
                      </FormItem>
                    </Col>)
                } else if (item.type === 'input') { // 输入框
                  return (
                    <Col key={index} span={item.span || col} offset={item.offset} style={item.style}>
                      <FormItem labelCol={{span: item.labelCol || 8}} wrapperCol={{span: item.wrapperCol || 16}}
                                label={item.label}>
                        {
                          getFieldDecorator(item.paramName, {
                            initialValue: item.initialValue || "",
                            rules: item.rules,
                          })(
                            <Input placeholder={item.placeholder || '请输入'} disabled={item.disabled}
                                   addonAfter={item.text} onChange={item.onChange}/>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'imgUp') { // 图片上传带删除预览功能
                  return (
                    <Col span={item.span || 22} key={index} offset={2}>
                      <Col span={2} style={{marginBottom: 6}}>{item.label} :</Col>
                      <Col span={22}>
                        <Upload
                          className={styles.myUp}
                          disabled={item.disabled}
                          action={item.url}
                          name={'file'}
                          accept={'.img, .jpg, .jpeg, .png, .gif'}
                          listType="picture-card"
                          fileList={imgList}
                          onPreview={this.handlePreview}
                          onChange={this.handleChange}
                        >
                          {imgList.length >= item.upLength ? null : uploadButton}
                        </Upload>
                      </Col>
                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                      </Modal>
                    </Col>
                  )
                }
              })
            }
          </Row>
        </Form>
      </MyModal>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Form.create()(PublicModal));

