import React, { useState, useEffect } from "react";
import {
    Modal,
    Button,
    FormContactSelect,
    FormSelect,
} from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useQuery } from "react-query";
import { getLeadClients, getMatters } from "api";
import { useAuthContext } from "contexts";

const validationFullSchema = Yup.object().shape({
    matter: Yup.string().required("Matter is required"),
    client: Yup.string().required("Client is required"),
});

interface Props {
    open: boolean;
    setOpen(param: boolean): void;
    matter?: number | undefined;
    client?: number | undefined;
    updateTag(client?: number, matter?: number);
    onCreate?(): void;
}

export const TagEditModal = ({
    open,
    setOpen,
    matter,
    client,
    updateTag,
}: Props) => {
    let reset = () => { };
    const { userId, userType, profile } = useAuthContext();
    const [innerClient, setInnerClient] = useState(client);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isLoading: isClientsLoading, data: clientsData } = useQuery<
        { results: any[]; count: number },
        Error
    >(["leads_clients"], () => getLeadClients(userId, userType, profile.role), {
        keepPreviousData: true,
        enabled: open,
    });

    const {
        isLoading: isMattersLoading,
        data: matterData,
        isFetching: isMattersFetching,
    } = useQuery<{ results: any[]; count: number }, Error>(
        ["matters-all", innerClient],
        () =>
          getMatters({
            client: innerClient,
          }),
        {
            keepPreviousData: true,
            enabled: !!innerClient && open,
        }
    );

    return (
        <Modal
            title='Tagged to'
            open={open}
            setOpen={(param) => {
                setOpen(param);
                reset();
            }}
        >
            <div className="new-message-modal">
                <Formik
                    initialValues={{
                        matter,
                        client,
                    }}
                    validationSchema={validationFullSchema}
                    onSubmit={async (values) => {
                        setIsSubmitting(true);
                        await updateTag(values.client, values.matter);
                        setOpen(false);
                    }}
                >
                    {({ resetForm, errors, values }) => {
                        reset = resetForm;
                        setInnerClient(values.client);
                        return (
                            <Form>
                                <FormContactSelect
                                    name="client"
                                    isRequired
                                    label="Client"
                                    values={clientsData?.results || []}
                                    isLoading={isClientsLoading}
                                />
                                <FormSelect
                                    name="matter"
                                    isRequired
                                    className="mt-1"
                                    label="Matter"
                                    isLoading={isMattersLoading || isMattersFetching}
                                    values={matterData?.results || []}
                                />
                                <div className="d-flex mt-3">
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
                                        disabled={Object.keys(errors).length > 0}
                                        buttonType="submit"
                                        size="large"
                                        isLoading={isSubmitting}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </Modal>
    );
};
