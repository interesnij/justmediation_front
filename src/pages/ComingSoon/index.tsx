import React from "react";
import { RouteComponentProps } from "@reach/router";
import LogoImg from "assets/images/logo.svg";
import "./style.scss";
export const ComingSoon: React.FunctionComponent<RouteComponentProps> = () => {
  return (
    <div className="bg" style={{padding:'15px'}}>
      <div className="logo-holder">
        <img src={LogoImg} alt="logo" />
      </div>
      <h2 style={{textAlign:'center', color:'white'}}>
        Mobile browser is not supported
      </h2>
      <h4 style={{textAlign:'center'}}>
        Please install the application to use Justlaw on your mobile device.
        <br /><br />
        <a target="_blank" style={{color:'white'}} href="https://apps.apple.com/us/app/juslaw/id1608960459">IOS</a>
        &nbsp;&nbsp;
        <a target="_blank" style={{color:'white'}} href="https://play.google.com/store/apps/details?id=com.jusglobal.juslaw.android">Android</a>
      </h4> 
    </div>
  );
};
