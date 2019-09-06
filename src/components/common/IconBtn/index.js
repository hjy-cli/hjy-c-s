/**
 * 图标按钮
 */
import React, {Component} from 'react';
import MyIcon from '../MyIcon/index';

const IconBtn = ({icon, color, title, onClick, style}) => {
  const wrap = {
    margin: "0 7px",
    cursor: 'pointer',
    ...style
  };

  return (
    <span style={{...wrap}} onClick={onClick} title={title}>
      <MyIcon type={icon} style={{color: color, fontSize: 18}}/>
    </span>
  )
};


export default IconBtn;
