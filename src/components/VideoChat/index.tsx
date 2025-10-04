import React, { useState, useEffect } from "react";
import { JoinCallModal } from "modals";
import { useModal } from "hooks";
import { useAuthContext, useChatContext, iCallObject } from "contexts";
import { Conference } from "components";
import VoxeetSDK from "@voxeet/voxeet-web-sdk";
import "./index.scss";


export const VideoChat = () => {
  const joinCallModal = useModal();
  const { profile } = useAuthContext();
  const { callsList, deleteCall, updateCall, stoppedCalls, addStoppedCall } = useChatContext();
  const [currentCall, setCurrentCall] = useState<any>(null)
  const [isJoined, joinCall] = useState(false)
  const [userProfile, setUserProfile] = useState(profile) // keep for log out case during the call 

  useEffect(() => { 
    if (!callsList) return;
    const current = getCurrent();
    const isHost = current?.hostId && current.hostId == userProfile?.id;
    if (unfinishedCall(isHost, current)) 
      return;
    setCurrentCall(current);
    if (
      !isJoined && 
      current?.hostId && 
      current.hostId != currentCall?.hostId
    ){ 
      
      isHost 
        ? joinCall(true)
        : joinCallModal.setOpen(true);
    }
  }, [callsList])

  const audioPath = 'https://app.jusmediation.com/sounds/voxeet_notif.mp3'; 
  const audio = new Audio(audioPath);
  //audio.play();

  useEffect(() => {
    setUserProfile(profile);
    return () => {  
      if (!!VoxeetSDK.conference.current) {
        VoxeetSDK.conference.leave()
        setCurrentCall(null);
        joinCall(false)
      }
    }
  }, [])

  const getCurrent = () => {
    // find own call
    
    const myCall = callsList.find(
      (c: iCallObject) => c?.hostId && c.hostId == userProfile?.id
    )
    if (myCall) {
      return myCall;
    }
    //else {
    //  audio.play();
    //}
    
    // alternatively find participant call
    const participanCall = callsList.find((c: iCallObject) => 
      c?.participants?.indexOf(Number(userProfile?.id)) !== -1 &&
      stoppedCalls.indexOf(c?.key) === -1
    )
    //audio.play()
    return participanCall;
  }

  const unfinishedCall = (isHost, current: iCallObject) => {
    if (
      isHost && 
      current?.key && 
      current.key !== localStorage.getItem("callHostKey")
    ) {
      return true;
    }
    return false;
  }

  const handleAcceptCall = () => {
    audio.pause()
    audio.muted = true;
    console.log("Accept!")
    
    joinCallModal.setOpen(false)
    joinCall(true)
  }

  const handleDeclineCall = () => {
    audio.pause()
    audio.muted = true;
    console.log("Decline!")
    joinCallModal.setOpen(false)
    // add to local ignore list
    addStoppedCall(currentCall?.key)
  }
  const handleAddParticipant = () => {
    if (currentCall?.joinedList?.indexOf(Number(userProfile?.id)) !== -1)
      return;
    updateCall(currentCall.NO_ID_FIELD, {
      joinedList: currentCall.joinedList.concat(Number(userProfile?.id))
    })
  }  

  return (
    <div className="video-chat">
      {currentCall && isJoined && (
        <Conference 
          chatId={currentCall.chatId}
          profile={userProfile}
          callObject={currentCall}
          handleDisconnect={() => setTimeout(() => {
            setCurrentCall(null)
            joinCall(false)
          }, 1000)}
          addParticipant={handleAddParticipant}
          deleteCall={deleteCall}
        />
      )}

      {joinCallModal.open && currentCall && (
        <JoinCallModal 
          {...joinCallModal} 
          callObject={currentCall}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall} 
        />
      )}
    </div>
  );
};
