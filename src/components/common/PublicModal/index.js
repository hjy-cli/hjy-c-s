/**
 * Created by GYL on 2018/8/14
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import moment from 'moment'
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  InputNumber,
  message,
  Modal,
  TimePicker,
  Checkbox,
  Tabs,
  Upload,
  DatePicker,
  Radio,
  Button,
  Icon,
  TreeSelect
} from 'antd';
import MyModal from '../MyModal/index';
import SearchTree from '../SearchTree/index';
import styles from './index.less';
import config from '../../../config';
import MyTable from "../MyTable/index";
import Shrink from "../Shrink/index";
import Video from "../Video/index";

const {RangePicker, MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;

function disabledDate(current) {
  // 当天以后时间禁选,组件传值   disabledDate:true
  return current && current.valueOf() > Date.now();
}

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
    if (t.props.upList && t.props.upList.length) {
      this.setState({
        upList: t.props.upList,
      });
    }
    if (t.props.thumbnailFileIds && t.props.thumbnailFileIds.length) {
      let thumbnailFileIds = t.props.thumbnailFileIds.map(item => (item.id)).join(',');
      this.setState({
        thumbnailFileIds
      })
    }
    if (t.props.imgList && t.props.imgList.length) {
      let imgId = t.props.imgList.map(item => (item.id)).join(',');
      this.setState({
        imgList: t.props.imgList,
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
  // 上传前的钩子
  imgOnChange = () => {
    let {upList} = this.state;
    if (upList.length >= 1) {
      message.warning("超出上传条数限制");
      return false;
    }
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
    const {setFieldsValue, getFieldsValue} = this.props.form;
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
  handleCancel = () => this.setState({previewVisible: false});
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChange = ({file, fileList}) => {
    if (file.status === "done") {
      if (file.response && file.response.rc === 0) {
        message.success("上传成功！");
        fileList[fileList.length - 1].id = file.response.ret.id;
        let idList = fileList.map(item => (item.id)).join(',');
        let thumbnailFileIds = fileList.map(item => (item.response.ret.thumbnailPicture)).join(',');
        console.log("fileList:", fileList);
        console.log("thumbnailFileIds:", thumbnailFileIds);
        this.setState({imgList: fileList, imgId: idList, thumbnailFileIds})
      } else {
        message.error("上传失败！");
        return
      }
    } else {
      this.setState({imgList: fileList})
    }
  };
  myUploadFn = (param) => {
    const serverURL = '/mizudameeting/commonFile/upload';
    const xhr = new XMLHttpRequest;
    const fd = new FormData();

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      let data = JSON.parse(xhr.responseText);
      if (data.rc === 0 && data.ret) {
        param.success({
          url: config.imgUrl + data.ret.remoteRelativeUrl,
          // meta: {
          //   id: data.ret.id,
          //   title: 'xxx',
          //   alt: data.ret.orgName,
          //   loop: true, // 指定音视频是否循环播放
          //   autoPlay: true, // 指定音视频是否自动播放
          //   controls: true, // 指定音视频是否显示控制栏
          //   poster: 'http://xxx/xx.png', // 指定视频播放器的封面
          // }
        })
      }

    };

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    };

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    };

    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);

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
                if (item.type === 'black') {
                  return (
                    <Col key={index} span={item.span || 8} offset={item.offset} style={item.style}>
                      {
                        item.text &&
                        <div style={{paddingTop: 9, color: 'rgba(0,0,0,0.85)', fontSize: 14}}
                             className={item.rules ? styles.rules : null}>{item.text}</div>
                      }
                    </Col>
                  )
                } else if (item.type === 'title') {
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
                } else if (item.type === 'shrink') {
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
                } else if (item.type === 'rangePicker') {
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
                } else if (item.type === 'checkBoxGroup') {
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
                } else if (item.type === 'checkBox') {
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
                } else if (item.type === 'radio') {
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
                } else if (item.type === 'datePickerTime') {
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
                } else if (item.type === 'timePicker') {
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
                } else if (item.type === 'datePicker') {
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
                } else if (item.type === 'yearPicker') {
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
                } else if (item.type === 'monthPicker') {
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
                } else if (item.type === 'inputNumber') {
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
                } else if (item.type === 'input') {
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
                } else if (item.type === 'textArea') {
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
                } else if (item.type === 'list') {
                  return (
                    <Col key={index} span={24}>
                      {
                        upList && upList.length > 0 &&
                        upList.map((option, subIndex) => (
                          <Col key={subIndex} span={24} style={{marginBottom: 10}}>
                            <Col span={8} style={{paddingLeft: 20}}>{option.orgName}</Col>
                            <Col span={8} style={{textAlign: 'center'}}>{option.uploadTime}</Col>
                            <Col span={8} style={{textAlign: 'right', paddingRight: 20}}>
                              <Col offset={item.disabled ? 19 : 12} span={6}><a
                                href={config.imgUrl + option.remoteRelativeUrl}>下载</a></Col>
                              {
                                !item.disabled &&
                                <Col span={6}><a onClick={t.onDelete.bind(t, subIndex)}>删除</a></Col>
                              }
                            </Col>
                          </Col>
                        ))
                      }
                    </Col>
                  )
                } else if (item.type === 'treeSelect') {
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
                } else if (item.type === 'radioButton') {
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
                } else if (item.type === 'select') {
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
                                    <Option key={option.value} value={option.value}>
                                      {option.text}
                                    </Option>
                                  )
                                )}
                            </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                  )
                } else if (item.type === 'table') {
                  return (
                    <Col span={item.span || 24} key={index} offset={item.offset} style={{marginBottom: 10}}>
                      {
                        item.label &&
                        <div style={{marginBottom: 6}}>{item.label}</div>
                      }
                      <MyTable
                        loading={item.loading}
                        key={item.tableKey || 'id'}
                        columns={item.columns}
                        hideY={item.hideY}
                        dataSource={item.dataSource}
                        rowSelection={item.rowSelection}
                        scroll={item.scroll}
                        pagination={false}
                      />
                    </Col>
                  )
                } else if (item.type === 'tree') {
                  return (
                    <Col span={item.span || 24} key={index}>
                      <div style={{marginBottom: 6}}>{item.label} :</div>
                      <SearchTree
                        dataList={item.dataList}
                        getChecked={item.getChecked}
                        checkedList={item.checkedList}
                        style={item.style}
                        father={true}/>
                    </Col>
                  )
                } else if (item.type === 'imgUp') {
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
                } else if (item.type === 'video') {
                  return (
                    <Col span={item.span || 24} key={index} offset={item.offset}>
                      <Video
                        videoType={item.videoType}
                        width={'100%'}
                        height={item.height || 400}
                        url={item.url}
                      />
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

