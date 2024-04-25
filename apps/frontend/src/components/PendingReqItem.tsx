import { Select, MenuItem, SelectChangeEvent, IconButton } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { DeleteOutline } from "@mui/icons-material";

type GeneralReq = {
  id: number;
  type: string;
  location: string;
  long_name_loc: string;
  status: string;
  emp_name: string;
  priority: string;
};

function PendingFlowerReq(props: GeneralReq) {
  const { getAccessTokenSilently } = useAuth0();

  // Formats date string to date format
  // function formatDate(requestDate: string) {
  //   const dateToFormat: Date = new Date(requestDate);
  //   return dateToFormat.toLocaleDateString();
  // }

  const [status, setStatus] = useState<string>(props.status);

  async function handleStatusDropdown(e: SelectChangeEvent) {
    const token = await getAccessTokenSilently();
    setStatus(e.target.value);
    await axios.post(
      "/api/fetchAll/update",
      {
        id: props.id,
        status: e.target.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return;
  }

  // Formats date string to time format
  // function formatTime(requestDate: string) {
  //   const dateToFormat: Date = new Date(requestDate);
  //   return dateToFormat.toLocaleTimeString();
  // }

  //takes in the id of the request to be deleted and deletes in the database
  async function deleteData(idVal: number) {
    console.log(idVal);
    try {
      const token = await getAccessTokenSilently();
      //call to backend
      await axios.delete(`api/fetchAll/${idVal}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.log(e);
      return;
    }
    alert("Successfully deleted flower request with ID number " + idVal);
    //window must be reloaded on delete to show updated results
    window.location.reload();
  }

  return (
    <tr className="bg-background border-b-2 border-secondary" key={props.id}>
      <td className="p-3 text-sm">{props.type}</td>
      <td className="p-3 text-sm">
        <Select
          name="status"
          required={true}
          label="Status"
          onChange={handleStatusDropdown}
          value={status}
          defaultValue={props.status}
          size="small"
        >
          <MenuItem value={"Unassigned"}>Unassigned</MenuItem>
          <MenuItem value={"Assigned"}>Assigned</MenuItem>
          <MenuItem value={"InProgress"}>In Progress</MenuItem>
          <MenuItem value={"Closed"}>Closed</MenuItem>
        </Select>
      </td>
      <td className="p-3 text-sm">{props.priority}</td>
      <td className="p-3 text-sm">{props.long_name_loc}</td>
      <td className="p-3 text-sm">{props.emp_name}</td>
      <td className="p-3 text-sm">
        <IconButton
          className="px-7 flex justify-center transform hover:scale-125"
          onClick={() => deleteData(props.id)}
        >
          <DeleteOutline color="error" />
        </IconButton>
      </td>
    </tr>
  );
}

export default PendingFlowerReq;
