import React, { useRef, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import WebViewer from "@pdftron/webviewer";
import "./style.scss";

export const DocumentEditPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const viewer = useRef<HTMLDivElement>(null);

    useEffect(() => {
      WebViewer(
        {
          path: "/lib",
          initialDoc: "http://www.africau.edu/images/default/sample.pdf",
          licenseKey: process.env.REACT_APP_PDFTRON_LICENSE,
        },
        viewer.current as HTMLDivElement
      ).then((instance) => {
        console.log("edit doc", instance);
      });
    }, []);

    return (
      <div>
        <div
          className="webviewer"
          ref={viewer}
          style={{ height: "100vh" }}
        ></div>
      </div>
    );
  };
