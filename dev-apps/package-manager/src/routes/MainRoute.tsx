import { Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";
import { useControlModal } from "@packages/modal";
import { useControlToast } from "@packages/toast";
import { useQueryParamsState, usePath } from "@packages/router";
import { useTempRequest } from "../useTempRequest";
import { Spinner, Skeleton } from "@packages/loading";

export const MainRoute = () => {
  const { openModal, closeModal } = useControlModal();
  const { openModal: openModal2, closeModal: closeModal2 } = useControlModal();
  const { showToast, hideToast } = useControlToast();
  const { showToast: showToast2, hideToast: hideToast2 } = useControlToast();

  return (
    <div>
      <button
        onClick={() =>
          showToast({
            content: (
              <div
                style={{
                  width: "fit-content",
                  height: "fit-content",
                  padding: "20px",
                  backgroundColor: "ActiveCaption",
                  borderRadius: "10%",
                  border: "1px solid red",
                }}
              >
                <button
                  onClick={() => {
                    hideToast();
                  }}
                >
                  hide
                </button>
                <button
                  onClick={() => {
                    showToast2({
                      content: (
                        <div
                          style={{
                            width: "fit-content",
                            height: "fit-content",
                            padding: "20px",
                            backgroundColor: "ActiveCaption",
                            borderRadius: "10%",
                            border: "1px solid red",
                          }}
                        >
                          test
                        </div>
                      ),
                    });
                  }}
                >
                  open
                </button>
              </div>
            ),
          })
        }
      >
        open toast
      </button>
      <button
        onClick={() =>
          openModal({
            content: (
              <div
                style={{
                  width: "800px",
                  height: "500px",
                  backgroundColor: "ThreeDShadow",
                  borderRadius: "5%",
                }}
              >
                testing123
                <button
                  onClick={() =>
                    openModal2({
                      content: (
                        <div
                          style={{
                            width: "900px",
                            height: "250px",
                            backgroundColor: "ActiveCaption",
                            borderRadius: "5%",
                            border: "1px solid red",
                          }}
                        >
                          test123456
                        </div>
                      ),
                    })
                  }
                >
                  click
                </button>
              </div>
            ),
          })
        }
      >
        click
      </button>
      <MainRouteTable />
    </div>
  );
};

const MainRouteTable = () => {
  const { data, isLoading, isError, fetchMetadata, isLoadingVersions, isErrorVersions } =
    useTempRequest();
  const { moveTo } = usePath();
  const queryParams = useQueryParamsState({ specificParams: ["pagination"] });
  const pagination = Number(queryParams.pagination ?? 1);
  const rowsPerPage = 10;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Table
      rowContainer={{
        height: "250px",
      }}
      rows={{
        dataRow: {
          size: 25,
        },
      }}
      columns={[
        {
          header: "Name",
          cell: (data) => {
            const { name } = data;

            return (
              <EllipsisTooltip offset={-10} content={name}>
                {name}
              </EllipsisTooltip>
            );
          },
          size: 100,
        },
        {
          header: "Instances",
          cell: (data) => {
            const { instances } = data;
            const amount = instances.length;

            return (
              <EllipsisTooltip offset={-10} content={amount}>
                {amount}
              </EllipsisTooltip>
            );
          },
          size: 100,
        },
        {
          header: "Versions",
          cell: (data) => {
            const { instances } = data;
            const versionsSet = new Set<string>();
            instances.forEach((instance) => {
              versionsSet.add(instance.version);
            });
            const amount = versionsSet.size;

            return (
              <EllipsisTooltip offset={-10} content={amount}>
                {amount}
              </EllipsisTooltip>
            );
          },
          size: 100,
        },
        {
          header: "Latest version",
          cell: (data) => {
            if (isLoadingVersions) {
              return <Skeleton height="100%" width="100%" backgroundColor="lightgray" />;
            }

            const { latestVersion } = data;
            const { version } = latestVersion ?? {};

            if (!version) {
              return <div>---</div>;
            }

            return (
              <EllipsisTooltip offset={-10} content={version}>
                {version}
              </EllipsisTooltip>
            );
          },
          size: 120,
        },
        {
          header: "Last update date",
          cell: (data) => {
            if (isLoadingVersions) {
              return <Skeleton height="100%" width="100%" backgroundColor="lightgray" />;
            }

            const { latestVersion } = data;
            const { date } = latestVersion ?? {};

            if (!date) {
              return <div>---</div>;
            }

            return (
              <EllipsisTooltip offset={-10} content={date}>
                {date}
              </EllipsisTooltip>
            );
          },
          size: 150,
        },
        {
          header: "Can upgrade",
          cell: (data) => {
            if (isLoadingVersions) {
              return <Skeleton height="100%" width="100%" backgroundColor="lightgray" />;
            }

            const { instances, latestVersion } = data;
            const versionsSet = new Set<string>();
            instances.forEach((instance) => {
              versionsSet.add(instance.version);
            });
            const amount = versionsSet.size;
            const { version } = latestVersion ?? {};

            if (!version) {
              return <div>---</div>;
            }

            const isUpdated = versionsSet.has(version) && amount === 1;
            const text = isUpdated ? "Up to date" : "Can upgrade";

            return (
              <EllipsisTooltip offset={-10} content={text}>
                {text}
              </EllipsisTooltip>
            );
          },
          size: 100,
        },
      ]}
      data={data}
      pagination={{
        rowsPerPage,
        paginationProps: {
          currentPage: pagination,
          maxPagesToShow: 5,
          onPageChange: (page) => {
            moveTo({
              pathname: window.location.pathname,
              queryParams: page === 1 ? undefined : { pagination: page },
            });
            fetchMetadata({ rowsPerPage, pagination: page });
          },
        },
      }}
    />
  );
};
