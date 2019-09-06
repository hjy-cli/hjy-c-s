/**
 * Created by GYL on 2018/11/5 Description: 日历
 */
import React, { Component } from 'react';
import moment from 'moment';
import Calendar from "react-big-calendar";
require("react-big-calendar/lib/css/react-big-calendar.css");

const localizer = Calendar.momentLocalizer(moment);

class MyCalendar extends Component {
  componentDidMount(){
    this.onInit();
  };
  // 初始化
  onInit = () => {
    // 头部日期样式
    let toolbar = document.getElementsByClassName('rbc-toolbar-label');
    toolbar[0].style.fontSize = '20px';
    toolbar[0].style.color = '#3DB6EE';
    toolbar[0].style.fontWeight = 600;

    // 设置工具栏样式
    let Btn = document.getElementsByClassName('rbc-btn-group');
    const leftText = ["今天","<",">"];
    const rightText = ["月","周","日","日程"];
    Btn[0].children[0].style.background = "#3DB6EE";
    Btn[0].children[0].style.borderColor = "#3DB6EE";
    Btn[0].children[0].style.color = "#FFFFFF";
    for (let i = 0; i < Btn[0].children.length; i++) {
      Btn[0].children[i].innerHTML = leftText[i];
    }
    for (let i = 0; i < Btn[1].children.length; i++) {
      Btn[1].children[i].innerHTML = rightText[i];
      Btn[1].children[i].style.borderColor = '#3DB6EE';
      Btn[1].children[i].style.color = '#3DB6EE';
      if (Btn[1].children[i].className === 'rbc-active'){
        Btn[1].children[i].style.background = '#3DB6EE';
        Btn[1].children[i].style.color = '#FFF';
      }
    }
    // 设置表格行高度
  };
  // 应用于事件节点的className对象或样式props。
  eventPropGetter = (event, start, end, isSelected) => {
    return{
      style:{
        background:'#8E70FF',
        fontSize:'12px',
        color:'#FFFFFF',
        borderColor:'#3c3c3c',
        textAlign:'left',
        padding:'4px 0',
        marginBottom:'5px',
        borderRadius:0,
        left:0,
        right:0
      }
    }
  };
  onNavigate = (val,type) => {
    if (type === 'agenda'){
      let Btn = document.getElementsByClassName('rbc-header');
      let empty = document.getElementsByClassName('rbc-agenda-empty');
      window.setTimeout(() => {
        if (empty && empty.length){
          empty[0].innerHTML = "在这个范围内没有任何事件。"
        }else {
          let text = ["日期", "时间", "事件"];
          for (let i = 0; i < Btn.length; i++) {
            Btn[i].textContent = text[i];
            Btn[i].style.textAlign = 'center';
          }
          Btn[0].style.width = '90px';
          Btn[1].style.width = '107px';
        }
      },1)
    }
    if (this.props.onNavigate){
      this.props.onNavigate()
    }
  };
  // view值更改时触发回调
  onView = (val,data,dd) => {
    let Btn = document.getElementsByClassName('rbc-btn-group');
    window.setTimeout(() => {
      for (let i = 0; i < Btn[1].children.length; i++) {
        Btn[1].children[i].style.borderColor = '#3DB6EE';
        Btn[1].children[i].style.color = '#3DB6EE';
        Btn[1].children[i].style.background = '#FFF';
        if (Btn[1].children[i].className === 'rbc-active'){
          Btn[1].children[i].style.background = '#3DB6EE';
          Btn[1].children[i].style.color = '#FFF';
        }
      }
    },1);
    if (val === 'week' || val === 'day'){
      let Btn = document.getElementsByClassName('rbc-timeslot-group');
      window.setTimeout(() => {
        if (Btn && Btn.length){
          for (let i = 0; i < Btn.length; i++) {
            Btn[i].style.minHeight = '100px';
          }
        }
      },1)
    }
    if (val === 'agenda'){
      let Btn = document.getElementsByClassName('rbc-header');
      let empty = document.getElementsByClassName('rbc-agenda-empty');
      window.setTimeout(() => {
        if (empty && empty.length){
          empty[0].innerHTML = "在这个范围内没有任何事件。"
        }else {
          let text = ["日期", "时间", "事件"];
          for (let i = 0; i < Btn.length; i++) {
            Btn[i].textContent = text[i];
            Btn[i].style.textAlign = 'center';

          }
          Btn[0].style.width = '90px';
          Btn[1].style.width = '107px';
        }
      },1)
    }
  };
  render(){
    let t = this;
    let formats = {
      monthHeaderFormat:(date) => moment(date).format("YYYY-MM"),
      dayRangeHeaderFormat: ({ start, end }, culture, DateLocalizer) =>
          moment(start).format("YYYY/MM/DD")+' ~ '+moment(end).format("YYYY/MM/DD"),
      dayHeaderFormat:(date) => moment(date).format("YYYY-MM-DD dddd")
    };
    return(
      <Calendar
        {...this.props}
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        onView={t.onView}
        formats={formats}
        onNavigate={t.onNavigate}
        eventPropGetter={t.eventPropGetter}
      />
    )
  }
}
export default MyCalendar;
