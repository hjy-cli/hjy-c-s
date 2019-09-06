/**
 * Created by GYL on 2019/1/22 Description: 百度视频插件
 */
import React, {Component} from 'react';
import cyberplayer from '../../../../public/cyberplayer.js';
import videoConfig from './videoConfig';

class Video extends Component {
  static defaultProps = {
    videoType: "RTMP"
  };

  ID = this.props.ID || "video" + Math.random();

  componentDidMount() {
    this.createVideo();
  };

  createVideo = () => {
    let t = this;
    let {videoType} = t.props;
    this.player = cyberplayer(this.ID).setup({
      ...videoConfig[videoType],
      ...t.props,
      width: "100%",
      stretching: "exactfit", // 铺满
      controls: true,
      volume: 100,
      autostart: true,
      controlbar: {
        barLogo: false
      },
      ak: "19cb66c2bc7748a281e0f4ef6788ebc2" // 公有云平台注册即可获得accessKey
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.file && (nextProps.file !== this.props.file)) {
      this.player && this.player.remove();
      this.createVideo()
    }
  }

  componentWillUnmount() {
    this.player.remove();
  }

  render() {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <div id={this.ID}/>
      </div>

    )
  }
}

export default Video;
