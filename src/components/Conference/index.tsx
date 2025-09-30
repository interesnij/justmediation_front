import React from 'react';
import { ConferenceRoom } from '@voxeet/react-components';
import { iUpdateCallObject } from "contexts";
import VoxeetSDK from "@voxeet/voxeet-web-sdk";
import Spinner from "assets/images/green_loader.gif";
//import CallRecorder from "assets/sounds";
import "./index.scss"

interface Props {
  chatId: number;
  profile: {
    id: number;
    first_name: string; 
    last_name: string;
    avatar?: string;
  };
  callObject: iUpdateCallObject;
  handleDisconnect: () => void;
  addParticipant: () => void;
  deleteCall: (userId: string, callObject: any) => any;
};

interface State {
  isHidden: boolean;
  btn: any;
}

export class Conference extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { 
      isHidden: false,
      btn: null 
    };
  }

  async componentWillUnmount() {
    const { profile, callObject, deleteCall } = this.props;
    if (this.state.btn) {
      this.state.btn.removeEventListener('click', this.toggleHide.bind(this))
    }
    if (callObject?.hostId == profile?.id) {
      await deleteCall(''+callObject.hostId, callObject);
    }
    await VoxeetSDK.conference.leave();
  }

  handleOnConnect = () => {
    const that = this;
    that.setState({
      btn: document.querySelector('.vxt-modal-close-btn > a')
    }, () => {
      if (!that.state.btn) return;
      const tooltip = document.getElementById('toggle-close')
      if (tooltip) {
        tooltip.innerHTML = tooltip.innerHTML.replace('Close', 'Minimize'); 
      } 
      that.state.btn.setAttribute('title', "Minimize"); 
      that.state.btn.addEventListener('click', that.toggleHide.bind(that))
    })
    this.props.addParticipant()
  }

  toggleHide = () => 
    this.setState({
      isHidden: !!!(document.querySelector('.vxt-widget-modal.modal-hidden')) 
    })

  handleResumeBtn = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.state.btn.click()
  }

  render() {
    const { callObject, profile: {id, first_name, last_name, avatar} } = this.props;
    const constraints = {
      audio: true,
      video: true,
    };
    const displayActions = [
      'mute', 'video', 'share', 'attendees', 'chat', 'live', 'recording'
    ];
    return (
      <>
        <ConferenceRoom
            consumerKey={process.env.REACT_APP_DOLBY_KEY}
            consumerSecret={process.env.REACT_APP_DOLBY_SECRET}
            sdk={VoxeetSDK}
            isModal={true}
            isWidget={false}
            autoJoin
            //constraints={constraints}
            //kickOnHangUp
            conferenceAlias={callObject?.id}
            handleOnLeave={this.props.handleDisconnect}
            handleOnConnect={this.handleOnConnect.bind(this)}
            userInfo={{
              name: first_name + ' ' + last_name,
              externalId: id + '-' + Date.now(), // due to voxeet rare session bug
              avatarUrl: avatar || null
            }}
            logo={Spinner}
            displayActions={displayActions}
            liveRecordingEnabled={true}
            //videoRatio={{width: 800, height: 600}}
            //invitedUsers=[ ... populate from firebase ]
            //customLocalizedStrings={{ close: "Minimize" }}
        />

        {this.state.isHidden && this.state.btn && (
          <div 
            className="resume-call-btn"
            onClick={this.handleResumeBtn.bind(this)}
          >
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.8468 18.0318L20.4975 14.6825C19.3013 13.4864 17.2679 13.9649 16.7894 15.5198C16.4305 16.5964 15.2344 17.1945 14.1578 16.9552C11.7655 16.3572 8.53583 13.2471 7.93775 10.7352C7.5789 9.65857 8.2966 8.4624 9.37315 8.1036C10.9282 7.62513 11.4066 5.59164 10.2105 4.39547L6.8612 1.0462C5.90426 0.208883 4.46886 0.208883 3.63155 1.0462L1.35883 3.31892C-0.913894 5.71126 1.59806 12.051 7.22005 17.6729C12.842 23.2949 19.1817 25.9266 21.5741 23.5342L23.8468 21.2614C24.6842 20.3045 24.6842 18.8691 23.8468 18.0318Z" fill="#ffffff"/>
            </svg>
            <span className="ml-2">
              Resume Call
            </span>
          </div>
        )}
      </>
    );
  }
}

