import React, { useState, useEffect } from "react";
import { SignupLayout } from "layouts";
import classNames from "classnames";
import { SignupBar, LinkButton, Button } from "components";
interface Props {
  onNext(param): void;
  onBack(): void;
}
export const ChooseType = ({ onNext, onBack }: Props) => {
  const [type, setType] = useState("");
  let handleNext = () => {
    onNext(type);
  };
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  return (
    <SignupLayout>
      <div className="label">Step 2 of 3</div>
      <div className="title pb-4">
        Are you signing up as a Paralegal or Other?
      </div>

      <div className="d-flex mt-4 mb-4">
        <div
          className={classNames("choose-type", {
            active: type === "paralegal",
          })}
          onClick={() => setType("paralegal")}
        >
          <div className="choose-type__title">Paralegal</div>
        </div>
        <div
          className={classNames("choose-type", {
            active: type === "other",
          })}
          onClick={() => setType("other")}
        >
          <div className="choose-type__title">Other</div>
          <div className="choose-type__desc">(E.g. Accounting, HR, etc. ) </div>
        </div>
      </div>
      <SignupBar>
        <LinkButton onClick={onBack}>Go Back</LinkButton>
        <Button
          disabled={type.length === 0}
          className="ml-auto"
          onClick={handleNext}
        >
          Next
        </Button>
      </SignupBar>
    </SignupLayout>
  );
};
