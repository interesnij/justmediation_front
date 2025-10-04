import React from "react";
import { Breadcrumb, Button, User, RiseLoader } from "components";
import { RouteComponentProps, useParams, navigate } from "@reach/router";
import { getPostedMatterById } from "api";
import { useModal } from "hooks";
import { MediatorLayout, EngagementLayout } from "apps/mediator/layouts";
import { Proposal } from "modals";
import { useQuery } from "react-query";
import { format } from "date-fns";
import { getUserName } from "helpers";
import { renderBudget } from "helpers";
import { useAuthContext } from "contexts";

export const EngagementInquiryPostPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const { userType } = useAuthContext();
    const submitModal = useModal();
    const params = useParams();

    const { isLoading, isError, error, data } = useQuery<any, Error>(
      ["posted-matter-id"],
      () => getPostedMatterById(params.id),
      {
        keepPreviousData: true,
      }
    );

    const onCreate = () => {
      navigate(`/${userType}/engagement/submitted_post/${params.id}`);
    };

    return (
      <MediatorLayout showButtons={false} userType={userType}>
        <EngagementLayout tab="Browse Inquiries" userType={userType}>
          <div className="forums-page__topic">
            {isLoading ? (
              <div className="post-page__post mt-3">
                <RiseLoader className="my-4" />
              </div>
            ) : isError ? (
              <div className="post-page__post mt-3">
                <div className="my-4 text-center text-gray">{error}</div>
              </div>
            ) : (
              <>
                <Breadcrumb
                  previous={[
                    { label: "Browse Inquiries", url: `/${userType}/engagement` },
                    {
                      label: data?.practice_area_data?.title,
                      url: `/${userType}/engagement/topic/${data?.practice_area}`,
                    },
                  ]}
                  current={data?.title}
                  className="mb-3"
                />

                <div className="post-page__post mt-3">
                  <div className="w-100">
                    <div className="d-flex mb-2">
                      <span className="title">{data?.title}</span>
                      <span className="category">
                        {data?.practice_area_data?.title}
                      </span>
                    </div>

                    <div className="d-flex">
                      <User size="normal" avatar={data?.client_data?.avatar} />
                      <div className="ml-2">
                        <div className="name mt-auto">
                          {getUserName(data?.client_data)}
                        </div>
                        <div className="date mb-auto">
                          {data?.created
                            ? 'Posted ' + format(new Date(data?.created), "MM/dd/yy")
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="my-3 d-flex font-size-md capitalize">
                      <span className="mr-05">Budget:</span>
                      {renderBudget(data)}
                    </div>
                    <div className="text-dark pre-wrap">{data?.description}</div>
                  </div>
                  <div className="ml-auto" style={{ minWidth: 180 }}>
                    <Button widthFluid onClick={e=>submitModal.setOpen(true)}>
                      Submit Proposal
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </EngagementLayout>
        <Proposal {...submitModal} post={data} onCreate={onCreate} />
      </MediatorLayout>
    );
  };
