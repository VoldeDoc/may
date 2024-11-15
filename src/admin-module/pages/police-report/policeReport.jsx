import { useState, useEffect } from "react";
import useAdminManagement from "../../../hooks/useAdminManagement";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import { Button } from "primereact/button";
import { FaArrowLeftLong } from "react-icons/fa6";

function AllPoliceReports() {
  const { getStaffReport, loading } = useAdminManagement();
  const [policereports, setPoliceReports] = useState([]);

  useEffect(() => {
    ( async () => {
      const data = await getStaffReport("police-report");
      console.log("Fetched Data:", data); // Log the fetched data
      
      if (data) {
        setPoliceReports(data.PoliceReports);
      } else {
        console.error("No data received");
      }
    })();
  }, []);

  const heading = ["ID", "State","LGA", "Station Address", "Report File", "Status","StaffID"];
  
  const data = policereports.map(police => ({
    [heading[0].toLowerCase()]: police.id,
    [heading[1].toLowerCase()]: police.state,
    [heading[2].toLowerCase()]: police.lga,
    [heading[3].toLowerCase()]: police.station_address,
    [heading[4].toLowerCase()]: police.report_file,
    [heading[5].toLowerCase()]: police.status === null ? "Pending" : police.status, // Check if status is null
    [heading[6].toLowerCase()]: police.domestic_staff_id,
  }));

  return (
    <div className="mx-14 mt-10">
      <Button label="Back" className="mb-4" outlined onClick={() => window.history.back()} icon={<FaArrowLeftLong className="me-4" />} />
      <h2 className="text-black border-b border-gray-500 text-2xl font-bold mt-10">Police Reports</h2>
      <DataTableComponent heading={heading} data={data} loading={loading} name="domestic-staff" allowEdit={false}/>
    </div>
  );
}

export default AllPoliceReports;