/**
 * Created by GYL on Description: 示例文件
 */
import React, {Component} from 'react';
import {message, Divider, Popconfirm, Icon} from 'antd';
import moment from 'moment';
import {connect} from 'dva';
import request from '../../../utils/request';
import Filtrate from '../../../components/common/Filtrate/index';
import Container from '../../../components/common/Container/index';
import MyTable from '../../../components/common/MyTable/index';
import MyPagination from '../../../components/common/MyPagination/index';
import PublicService from "../../../services/PublicService";
import PublicModal from '../../../components/common/PublicModal/index';
import config from '../../../config';

class Example extends Component {
  state = {
    pageIndex: 1,
    pageSize: 10,
    total: 10,
    tableData: [],
    tableLoading: false,
    modalBtnLoading: false,
    publicModal: false,
    modalTitle: '示例文件',
    modalType: '',
    record: {},
    checkedList: []
  };

  componentDidMount() {
    // const t = this;
    // t.onSearch(1, 10);
  };

  // 查询
  onSearch = (pageIndex, pageSize) => {
    const t = this;
    let ret = t.f1.getForm().getFieldsValue();
    t.setState({
      pageIndex,
      pageSize,
      tableLoading: true,
    });
    ret.pageIndex = pageIndex;
    ret.pageSize = pageSize;
    request({url: config.publicApi + '', method: 'GET', params: {...ret}}).then(data => {
      let tableData = [], total = 0;
      if (data.rc === 0) {
        if (data.ret) {
          let {items, rowCount} = data.ret;
          tableData = items && items.length && items;
          total = rowCount && rowCount * 1;
        }
      } else {
        message.error(data.err)
      }
      t.setState({
        tableData,
        total,
        tableLoading: false
      });
    })
  };

  // 打开模态框
  onModalShow = (modalType, record) => {
    if (record) {
      this.setState({record})
    }
    this.setState({
      publicModal: true,
      modalType
    })
  };

  // 关闭模态框
  modalCancel = (type) => {
    this.setState({
      [type]: false,
      record: {}
    });
  };

  // 模态框保存
  onSave = (val) => {
    const {modalType, record} = this.state;
    this.setState({
      modalBtnLoading: true
    });
    val.id = (record && record.id) ? record.id : '';
    request({url: config.publicApi + '', method: 'POST', data: {...val}}).then(data => {
      if (data.rc === 0) {
        message.success("保存成功！");
        this.modalCancel('publicModal');
        this.onSearch();
      } else {
        message.error(data.err)
      }
      this.setState({
        modalBtnLoading: false
      });
    });
  };

  // 删除事件
  onDelete = (id) => {
    const hide = message.loading('删除中...', 0);
    request({url: config.publicApi + '', method: 'POST', data: [id]}).then(data => {
      if (data.rc === 0) {
        message.success("删除成功！");
        this.onSearch();
      } else {
        message.error(data.err)
      }
      hide()
    });
  };

  // 树点击
  getChecked = (val) => {
    if (val.length) {
      val = val.map((item, index) => ({...item, item}))
    }
    this.setState({
      checkedList: val,
    });
  };

  render() {
    const t = this;
    const {
      pageIndex, pageSize, total, tableData, tableLoading, record,
      modalBtnLoading, publicModal, modalTitle, modalType, checkedList
    } = t.state;

    // 查询条件配置项
    const items = [
      {
        type: 'input',
        label: '示例一',
        paramName: 'name'
      },
      {
        type: 'select',
        label: '示例二',
        paramName: 'code',
        options: []
      }
    ];

    // 表格配置项
    const columns = [
      {
        title: '示例一',
        dataIndex: 'test',
        width: 100,
      },
      {
        title: '示例二',
        dataIndex: 'test2',
        width: 100,
      },
      {
        title: '示例三',
        dataIndex: 'test3',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 150,
        render: (text, record, index) => {
          return (
            <span>
              <a onClick={t.onModalShow.bind(t, '修改', record)}>修改</a>
              <Divider type="vertical"/>
              <a onClick={t.onModalShow.bind(t, "查看", record)}>查看</a>
              <Divider type="vertical"/>
              <Popconfirm title="是否删除此条数据?" onConfirm={this.onDelete.bind(this, text)}
                          icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }
      }
    ];

    // 测试数据
    let dataList = [
      {key: 1, number: '123'},
      {key: 2, number: '456'},
      {key: 3, number: '123'},
      {key: 4, number: '456'}
    ];
    const testList = [
      {label: 1, value: "1"},
      {label: 2, value: "2"},
      {label: 3, value: "3"},
      {label: 4, value: "4"},
      {label: 5, value: "5"},
      {label: 6, value: "6"},
      {label: 7, value: "7"},
      {label: 8, value: "8"},
      {label: 9, value: "9"},
    ];
    let textList = [
      {text: '测试', value: '1'},
      {text: '测试', value: '2'},
    ]

    // 模态框配置项
    let disabled = modalType === "查看";
    const modalItems = [
      {
        span: 24,
        type: 'wrap',
        content: <div style={{textAlign: 'center'}}>自定义模块</div>,
      },
      {
        type: 'title',
        content: "常用form元素"
      },
      {
        type: 'input',
        label: '输入框',
        paramName: 'name',
        rules: [{...config.reg.required}],
        initialValue: null,
        disabled
      },
      {
        type: 'inputNumber',
        label: '数值',
        paramName: 'inputNumber',
        disabled,
        rules: [{...config.reg.required}],
        initialValue: null,
      },
      {
        type: 'select',
        label: '下拉选',
        paramName: 'type',
        options: textList,
        rules: [{...config.reg.required}],
        initialValue: null,
        disabled
      },
      {
        type: 'location',
        label: '经纬度',
        paramName: 'location',
        rules: [{...config.reg.required}],
        center: [],
        initialValue: null,
        disabled
      },
      {
        type: 'textArea',
        label: '多行文本',
        paramName: 'textArea',
        initialValue: null,
        disabled
      },
      {
        type: 'rangePicker',
        label: '日期',
        paramName: 'rangePicker',
        rules: [{...config.reg.required}],
        initialValue: null,
        disabled
      },
      {
        type: 'datePicker',
        label: '时间',
        paramName: 'datePicker',
        rules: [{...config.reg.required}],
        initialValue: null,
        disabled
      },
      {
        type: 'yearPicker',
        label: '年份',
        paramName: 'yearPicker',
        rules: [{...config.reg.required}],
        initialValue: null,
        disabled
      },
      {
        type: 'monthPicker',
        label: '月份',
        paramName: 'monthPicker',
        rules: [{...config.reg.required}],
        initialValue: null,
        disabled
      },
      {
        type: 'datePickerTime',
        label: '时间段',
        paramName: 'meetingDate',
        paramTimeName: 'meetingStartTime',
        paramTimeName2: 'meetingEndTime',
        initialValue: null,
        initialTimeValue: null,
        initialTimeValue2: null,
        disabled,
      },
      {
        type: 'radio',
        label: '单选',
        paramName: 'radio',
        initialValue: 1,
        options: testList.splice(0, 4)
      },
      {
        type: "checkBoxGroup",
        label: "多选 :",
        paramName: "checkBoxGroup",
        initialValue: [],
        disabled,
        span: 12,
        labelCol: 8,
        wrapperCol: 16,
        options: testList
      },
      {
        type: 'imgUp',
        label: '图片',
        url: '/mizudacockpit/fm/uploadByForm',
        upLength: 1,
        disabled
      },
      {
        type: 'title',
        content: '文件列表',
        upShow: true,
        url: '/mizudameeting/commonFile/upload',
        disabled
      },
      {
        type: 'list',
        upList: [
          {orgName: "测试", uploadTime: "2017-03-28"},
        ],
        disabled
      },
      {
        type: 'title',
        content: "收缩组件"
      },
      {
        type: "shrink",
        span: 24,
        handleChange: t.handleChange,
        dataSource: testList,
      },
      {
        type: 'title',
        content: "树与表格"
      },
      {
        type: 'tree',
        label: '树',
        span: 6,
        checkedList: checkedList,
        getChecked: t.getChecked,
        dataList: [
          {
            title: '测试',
            value: '1',
            key: '1',
            children: [
              {
                title: '测试',
                value: '2',
                key: '1-1'
              }
            ]
          }
        ],
      },
      {
        type: 'table',
        label: '表格',
        span: 18,
        columns: columns,
        dataSource: dataList,
        loading: false,
      },
      {
        type: 'title',
        content: "视频组件"
      },
      {
        type: 'video',
        videoType: "RTMP"
      },
    ];
    return (
      <div>
        <Filtrate
          items={items}
          clearBtn={'hide'}
          ref={ref => this.f1 = ref}
          submit={t.onSearch.bind(t, 1, 10)}
        />
        <Container
          addBtnShow={true}
          addBtn={t.onModalShow.bind(t, "新增", false)}>
          <MyTable
            columns={columns}
            loading={tableLoading}
            pagination={false}
            dataSource={PublicService.transformArrayData(tableData, true, true, pageIndex, pageSize)}
          />
          <MyPagination
            showPage
            pageSize={pageSize}
            current={pageIndex}
            total={total}
            showSizeChanger
            showQuickJumper
            onChange={this.onSearch}
            onShowSizeChange={this.onSearch}
          />
        </Container>
        {
          publicModal &&
          <PublicModal
            items={modalItems}
            modalBtnLoading={modalBtnLoading}
            wrappedComponentRef={ref => this.myForm = ref}
            visible={publicModal}
            title={modalTitle + " > " + modalType}
            footerShow={!disabled}
            onModalSave={t.onSave}
            onCancel={t.modalCancel.bind(t, 'publicModal')}
          />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Example);
