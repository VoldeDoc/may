import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  FaCheck,
  FaSearch,
  FaTimes,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaPauseCircle,
} from "react-icons/fa";
import { RiFilterOffLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BiPencil } from "react-icons/bi";
import { Dialog } from "primereact/dialog";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";

const DataTableComponent = ({ data, name, heading, isLoading, allowEdit }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const { loading, updateStatus } = UseAdminManagement();
  const [dataState, setDataState] = useState(null);

  useEffect(() => {
    if (data) {
      setDataState(data);
    }
  }, [data]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const clearFilter = () => {
    setGlobalFilterValue("");
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={clearFilter}
            className="flex items-center gap-2 bg-green-300 px-4 py-2 rounded text-white"
          >
            <RiFilterOffLine className="mr-2" /> Clear
          </button>
        </div>

        <span className="p-input-icon-left w-full sm:w-auto">
          <FaSearch className="ml-2 text-gray-500" />
          <InputText
            value={globalFilterValue}
            className="pl-8 w-full sm:w-auto"
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const editData = async (e, rowData) => {
    e.stopPropagation();
    setEditDialog(true);
    setSelectedData(rowData);
  };

  const onStatusChange = (e) => {
    const val = e.value.code;
    let _selectedData = { ...selectedData };
    _selectedData.status = val;
    setSelectedData(_selectedData);
  };

  const updateSelectedData = async () => {
    if (!selectedData) {
      console.error('selectedData is null or undefined');
      toast.error('An error occurred. Please try again');
      return;
    }

    const formData = {
      id: selectedData.id,
      status: selectedData.status,
      type: name === 'domestic-staff' || name === 'artisan' ? 'domestic' : name,
    };

    console.log('Updating status with data:', formData);

    toast.promise(
      updateStatus(formData)
        .then((res) => {
          if (res) {
            setEditDialog(false);
            setDataState(
              dataState.map((d) =>
                d.id === selectedData.id ? selectedData : d
              )
            );
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        })
        .catch((error) => {
          console.error('Error updating status:', error);
          return Promise.reject();
        }),
      {
        pending: 'Updating status...',
        success: 'Status updated successfully',
        error: 'An error occurred while updating status',
      }
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-center space-x-2">
        {allowEdit && (
          // <Button
          //   type="button"
          //   icon={<BiPencil className="mr-2 text-lg" />}
          //   outlined
          //   className="mr-2"
          //   onClick={(e) => editData(e, rowData)}
          // />

          <button
            type="button"
            onClick={(e) => editData(e, rowData)}
            className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded"
          >
            <BiPencil className="ml-2 text-lg text-white" />
          </button>

        )}
        <button
          type="button"
          className="bg-green-500 px-4 py-2 text-white"
          onClick={() => handleViewDetails(rowData)}
        >
          View
        </button>
      </div>
    );
  };

  const handleViewDetails = (rowData) => {
    const id = rowData.id;
    const routeName = name === 'artisan' ? 'artisan' : name;
    navigate(`/admin/${routeName}/details/${id}`);
  };

  const editDialogFooter = (
    <>
      {/* <Button
        label="Cancel"
        icon={<FaTimes className="mr-2" />}
        outlined
        onClick={() => setEditDialog(false)}
      /> */}
      <button
        className="outline outline-green-700 px-2 py-2 flex items-center gap-2 text-green-700 rounded"
        onClick={() => setEditDialog(false)}
      >
        <FaTimes className="mr-2" />
        Cancel
      </button>
      <button
        className="bg-green-800 px-2 py-2 flex items-center gap-2 text-white rounded"
        onClick={updateSelectedData}
      >
        <FaCheck className="mr-2" />
        Save
      </button>
    </>
  );

  const header = renderHeader();

  const navigate = useNavigate();

  const htmlBodyTemplate = (rowData) => {
    return <div dangerouslySetInnerHTML={{ __html: rowData.profile }} />;
  };

  const statusBodyTemplate = (rowData) => {
    let statusClass = "";
    let statusIcon = null;

    switch (rowData.status) {
      case "pending":
        statusClass = "bg-yellow-100 text-yellow-800";
        statusIcon = <FaExclamationCircle className="mr-2" />;
        break;
      case "approved":
        statusClass = "bg-green-500 text-white";
        statusIcon = <FaCheckCircle className="mr-2" />;
        break;
      case "rejected":
        statusClass = "bg-red-500 text-white";
        statusIcon = <FaTimesCircle className="mr-2" />;
        break;
      case "suspended":
        statusClass = "bg-orange-500 text-white";
        statusIcon = <FaPauseCircle className="mr-2" />;
        break;
      default:
        statusClass = "bg-yellow-800 text-yellow-100";
        statusIcon = <FaExclamationCircle className="mr-2" />;
        break;
    }

    return (
      <span className={`flex items-center px-3 py-1 rounded-lg ${statusClass}`}>
        {statusIcon}
        {rowData.status}
      </span>
    );
  };

  const statuses = [
    { status: "Pending", code: "pending" },
    { status: "Approved", code: "approved" },
    { status: "Rejected", code: "rejected" },
    { status: "Suspend", code: "suspend" },
  ];

  const rowClassName = (rowData, { rowIndex }) => {
    return {
      "bg-gray-100": rowIndex % 2 === 0,
      "bg-white": rowIndex % 2 !== 0,
    };
  };

  return (
    <>
      <div className="mt-16">
        <DataTable
          value={dataState}
          rows={10}
          paginator
          removableSort
          loading={isLoading}
          dataKey="id"
          header={header}
          globalFilter={globalFilterValue}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          rowsPerPageOptions={[5, 10, 20, 50]}
          rowClassName={rowClassName}
          className="w-full sm:w-auto"
        >
          {heading?.map(
            (head, index) =>
              head.toLowerCase() !== "staffid" && (
                <Column
                  key={index}
                  field={head.toLowerCase()}
                  sortable
                  header={head}
                  filter
                  filterPlaceholder={`Search ${head}`}
                  body={
                    head.toLowerCase() === "profile"
                      ? htmlBodyTemplate
                      : head.toLowerCase() === "status"
                        ? statusBodyTemplate
                        : null
                  }
                />
              )
          )}
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ width: "10em" }}
          />
        </DataTable>
      </div>

      {/* Edit Dialog */}
      <Dialog
        maximizable
        visible={editDialog}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={
          name === "employer"
            ? "Change Status"
            : name === "artisan"
              ? "Edit Artisan"
              : name === "job"
                ? "Edit Job"
                : "Edit Domestic Staff"
        }
        modal
        className="p-fluid overflow-y-auto"
        footer={editDialogFooter}
        onHide={() => setEditDialog(false)}
      >
        {selectedData && (
          <Dropdown
            optionLabel="status"
            value={
              statuses.find((status) => status.code === selectedData.status) ||
              ""
            }
            options={statuses}
            onChange={onStatusChange}
            placeholder="Select Status"
            highlightOnSelect={true}
            className="!w-full"
          />
        )}
      </Dialog>
    </>
  );
};

export default DataTableComponent;