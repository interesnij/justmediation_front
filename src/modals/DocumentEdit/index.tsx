import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { Modal, Button, RiseLoader } from "components";
import WebViewer from "@pdftron/webviewer";
import { uploadFiles, updateDocument } from "api";
import { useCommonUIContext } from "contexts";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(params: any): void;
  url: string;
  id: number;
  name: string;
  onUpdate?(): void;
}
export const DocumentEditModal = ({
  open,
  setOpen,
  url,
  onCreate = () => { },
  id,
  name,
  onUpdate = () => { },
}: Props) => {
  const viewer = useRef<HTMLDivElement>(null);
  const [instance, setInstance] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { showErrorModal, showAlert } = useCommonUIContext();
  const decodedURL = decodeURIComponent(url);
  useEffect(() => {
    WebViewer(
      {
        path: "/lib/public",
        initialDoc: decodedURL,
        // licenseKey: process.env.REACT_APP_PDFTRON_LICENSE,  // should be added after current key is renewed
        loadAsPDF: true,
      },
      viewer.current as HTMLDivElement
    ).then((instance) => {
      setInstance(instance);
    });
  }, []);

  const saveDocument = async () => {
    try {
      setSaving(true);
      const { documentViewer, annotationManager } = instance.Core;
      const doc = documentViewer.getDocument();
      const xfdfString = await annotationManager.exportAnnotations();
      const fileData = await doc.getFileData({
        // saves the document with annotations in it
        xfdfString
      });
      const arr = new Uint8Array(fileData);
      const type = 'application/pdf'
      const blob = new Blob([arr], { type });
      const file = new File([blob], new Date().getTime().toString() + ".pdf", { type, lastModified: new Date().getTime() });
      const urls = await uploadFiles([file], "documents", id); // upload only 1 file so urls[0] is being the file url
      let data: any = { 
        file: urls[0],
      };
      // if current edited one is office file, then should change its extension to pdf.
      if (/\.(doc?x|xls?x|ppt?x)$/i.test(name)) {
        const pos = name.lastIndexOf(".");
        data = {
          ...data,
          title: name.substr(0, pos < 0 ? name.length : pos) + ".pdf",
        }
      }
      await updateDocument({
        id,
        data,
      });
      onUpdate();
      setSaving(false);
      showAlert("Success", "Document saved successfully!");
    } catch (error) {
      showErrorModal("Error", "There's a problem saving this document");
      setSaving(false);
    }
  }

  return (
    <Modal
      title={"Edit Document"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
      disableOutsideClick
    >
      <Container>
        <Button
          className="ml-auto save-btn"
          isLoading={saving}
          onClick={saveDocument}
        >
          Save
        </Button>
        <div className="pdf-container">
          {
            saving && <div className="loader">
              <RiseLoader />
            </div>
          }
          <div className="viewer" ref={viewer}></div>
        </div>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  height: 800px;
  width: 1000px;
`;
