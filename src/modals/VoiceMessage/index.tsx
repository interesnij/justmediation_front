import React, { useState, useEffect } from "react";
import { Modal, Button, FormInput } from "components";
import { Formik, Form } from "formik";
import { isEqual } from "lodash";
import { useCommonUIContext } from "contexts";
import * as Yup from "yup";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import { IoIosMic } from "react-icons/io";
import { FaRegStopCircle } from "react-icons/fa";
import { uploadFiles } from "api";
import getBlobDuration from "get-blob-duration";

import "./style.scss";

//const validationSchema = Yup.object().shape({
//  title: Yup.string().required("Title is required"),
//});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onSend(params): void;
}
export const VoiceMessageModal = ({ open, setOpen, onSend }: Props) => {
  const [step, setStep] = useState(0);
  const [audioFile, setAudioFile] = useState<any>();
  const [recordState, setRecordState] = useState(RecordState.NONE);
  const { showErrorModal } = useCommonUIContext();
  let reset = () => {};

  useEffect(() => {
    setStep(0);
    setRecordState(RecordState.NONE);
    return () => {};
  }, [open]);

  const onStop = (audioData) => {
    setAudioFile(audioData);
    setStep(1);
  };
  return (
    <Modal
      title="Voice Message"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="voice-message-modal" style={{ width: 600 }}>
        {step === 0 ? (
          <div className="voice-recorder-container">
            <AudioReactRecorder
              state={recordState}
              onStop={onStop}
              backgroundColor="#fff"
              foregroundColor="rgba(0,0,0,.6)"
              canvasWidth={600}
            />
            <div className="d-flex justify-content-center">
              {recordState === RecordState.NONE ? (
                <IoIosMic
                  color="rgba(0,0,0,.6)"
                  size={48}
                  className="cursor-pointer"
                  onClick={() => setRecordState(RecordState.START)}
                />
              ) : recordState === RecordState.START ? (
                <FaRegStopCircle
                  color="#CC4B39"
                  size={48}
                  className="cursor-pointer"
                  onClick={() => setRecordState(RecordState.STOP)}
                />
              ) : null}
            </div>
          </div>
        ) : (
          <div>
            <Formik
              initialValues={{
                title: "",
              }}
              //validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  const urls = await uploadFiles(
                    [
                      new File(
                        [audioFile.blob], 
                        `${Math.random()}.wav`, 
                        {type: 'audio/wav'}
                      )
                    ],
                    "voice_consents",
                    0 // непонятно
                  );
                  const duration = await getBlobDuration(
                    audioFile.blob as Blob
                  );
                  onSend({
                    files: [{ file: urls[0] }],
                    type: "voice",
                    text: duration.toFixed(0),
                  }); 
                  setOpen(false);
                } catch (error: any) {
                  showErrorModal("Error", error);
                }
              }}
            >
              {({ resetForm, errors, initialValues, values, isSubmitting }) => {
                const hasErrors = Object.keys(errors).length > 0;
                const hasChanged = isEqual(values, initialValues);
                const defVal = "Voice";

                reset = resetForm;
                return (
                  <Form>
                    <div className="row" 
                      style={{display: "none"}}
                    >
                      <FormInput
                        name="title"
                        label="Title"
                        className="col-12"
                        value={defVal}
                        //isRequired
                      /> 
                    </div>
                    <div className="d-flex mt-2">
                      <Button
                        buttonType="button"
                        className="ml-auto"
                        theme="white"
                        size="large"
                        onClick={() => {
                          resetForm();
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="ml-3"
                        buttonType="submit"
                        //disabled=False
                        isLoading={isSubmitting}
                        size="large"
                      >
                        Send Voice Message
                      </Button>
                    </div>
                  </Form>
                ); 
              }}
            </Formik>
          </div>
        )}
      </div>
    </Modal>
  );
};
