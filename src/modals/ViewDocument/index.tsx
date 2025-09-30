import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "components";
import WebViewer from "@pdftron/webviewer";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  file: {
      name: string;
      url: string;
  }
}
export const ViewDocumentModal = ({
  open,
  setOpen,
  file
}: Props) => {
  const getRenderer = (url: string) => {
    if (/\.(docx?|pptx?)$/.test(url)) 
      return 'msoffice';
    else if (url.indexOf('.pdf') !== -1) 
      return 'pdf';
    else 
      return 'image';
  } 

  const [renderer, setRenderer] = useState(getRenderer(file.url))
  const viewer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (renderer === 'pdf') {
      WebViewer(
        {
          path: "/lib/public",
          initialDoc: decodeURIComponent(file.url),
          loadAsPDF: true,
          // licenseKey: process.env.REACT_APP_PDFTRON_LICENSE,  // should be added after current key is renewed
        },
        viewer.current as HTMLDivElement
      );
    }
  }, []);

  return (
    <Modal
      title={file.name}
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
    >
      <div className="new-message-modal">
        <div className="justify-content-center">
          {renderer === 'msoffice' ? (
            <iframe 
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.url}`} 
              width='100%' height='623px' frameBorder='0'>
            </iframe>
          ) : renderer === 'pdf' ? (
            <div 
              className="pdf-viewer" 
              ref={viewer}
              onClick={e => {
                console.log('test')
                e.stopPropagation()
              }}
            ></div>
          ) : (
            <img src={file.url} style={{ maxWidth: "100%", maxHeight: "100vh" }} />
          )}
        </div>
        <div className="d-flex mt-3">
          <Button
            buttonType="button"
            className="ml-auto"
            theme="white"
            size="large"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
