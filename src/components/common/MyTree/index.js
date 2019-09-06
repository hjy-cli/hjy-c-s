/**
 * 带过滤条件tree
 * 参数: treeData 树形结构数据,
 */
import React, {Component} from 'react';
import {Form, message, Button, Tree, Input} from 'antd';
import * as filter from '../../utils/filters';

import styles from './index.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class MyTree extends Component {

  state = {
    dataList: [],
    defaultTreeChecked: [],

    treeData: [],
    gDataOrigin: [],
    searchValue: '',
    checkedKeys: [],
    expandedKeys: [],
    autoExpandParent: true
  };

  async componentDidMount () {
    this.setState({gDataOrigin: this.props.treeData, treeData: this.props.treeData});
    this.generateList(this.props.treeData)
  }

  // 生成key,dataList对象的数组用来search准备
  generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      const label = node.label;
      const type = node.type;
      const checked = node.checked;
      const attributes = node.attributes;
      if (checked === true) {
        this.state.defaultTreeChecked.push(key);
      }
      this.state.dataList.push({key, label, type, attributes});
      if (node.children) {
        this.generateList(node.children, node.key);
      }
    }
    this.setState({dataList: this.state.dataList, defaultTreeChecked: this.state.defaultTreeChecked})
  };

  // 查找父结点
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  onChange = (e) => {
    let t = this;
    const value = e.target.value;
    const expandedKeys = this.state.dataList.map((item) => {
      if (item.label.indexOf(value) > -1) {
        return this.getParentKey(item.key, this.state.gDataOrigin);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    let data = filter.filterTree(t.state.gDataOrigin, value)
    t.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
      treeData: [data]
    });
  }

  // 点选树节点触发函数
  onSelect = (keys, node) => {
    let t = this;
    console.log(keys, 'keys')
    console.log(node, 'node')
    let {onSelect} = t.props;
    if (onSelect) {
      onSelect(keys, this.state.dataList);
      t.setState({checkedKeys: keys})
    }
  }

  // 勾选树触发函数
  onCheck = (keys, node) => {
    let t = this;
    console.log(keys, 'keys')
    console.log(node, 'node')
    let {onCheck} = t.props;
    if (onCheck) {
      onCheck(keys, this.state.dataList);
      t.setState({checkedKeys: keys})
    }
  }

  onExpand = (expandedKeys, defaultTreeChecked) => {
    let t = this;
    if (defaultTreeChecked === true) {
      t.setState({
        expandedKeys,
        autoExpandParent: true,
      });
    } else {
      t.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    }

  };

  render () {
    let t = this;
    const {treeBaseInfo}=t.props;
    const {treeData, searchValue, checkedKeys, expandedKeys, autoExpandParent}=t.state;
    const loop = data => data.map((item) => {
      const index = item.label.indexOf(searchValue);
      const beforeStr = item.label.substr(0, index);
      const afterStr = item.label.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{color: '#f50'}}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.label}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title}/>;
    });
    return (
      <div className={`${t.props.parentClassName}`}>
        <div className={styles.treeTitle}>
          <span style={{marginRight: '16px'}}>{treeBaseInfo.searchTitle}</span>
          <Search placeholder={treeBaseInfo.placeholder || "请输入关键字..."} onChange={t.onChange} size="small"/>
        </div>
        {/*树*/}
        <div className={`${styles.treeCon} ${t.props.className}`}>
          <Tree
            checkable={treeBaseInfo.checkable || false}
            checkedKeys={checkedKeys}
            onCheck={t.onCheck}
            onSelect={t.onSelect}
            onExpand={t.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
          >
            {loop(treeData)}
          </Tree>
        </div>
      </div>
    )
  }
}

export default  MyTree;
