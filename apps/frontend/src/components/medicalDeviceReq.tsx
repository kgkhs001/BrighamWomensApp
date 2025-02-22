import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useAuth0 } from "@auth0/auth0-react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { medicalDeviceDelivery } from "common/src/medicalDeviceDelivery.ts";
import { Dayjs } from "dayjs";
import LocationDropdown from "../components/locationDropdown.tsx";
import axios from "axios";
import UserDropdown from "../components/userDropdown.tsx";
import DeviceDropdown from "./DeviceDropdown.tsx";
import { Alert, Snackbar } from "@mui/material";
import { AlertColor } from "@mui/material/Alert";
function MedicalDeviceReq() {
  const { getAccessTokenSilently } = useAuth0();
  const [formData, setFormData] = useState<medicalDeviceDelivery>({
    employeeName: "",
    roomName: "",
    medicalDeviceName: "",
    quantity: 1,
    priority: "Medium",
    status: "Unassigned",
    deliveryDate: null,
  });

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<string, string>;
    },
    ref: React.Ref<unknown>,
  ) {
    return (
      <Slide direction="up" ref={ref} {...props} children={props.children} />
    );
  });
  const LOW_QUANTITY_THRESHOLD = 10;
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  function clear() {
    setFormData({
      employeeName: "",
      roomName: "",
      medicalDeviceName: "",
      quantity: 1,
      priority: "Medium",
      status: "Unassigned",
      deliveryDate: null,
    });
  }

  function handlePriorityInput(e: SelectChangeEvent) {
    setFormData({ ...formData, priority: e.target.value });
  }

  function handleStatusInput(e: SelectChangeEvent) {
    setFormData({ ...formData, status: e.target.value });
  }

  function updateName(val: string) {
    setFormData({ ...formData, employeeName: val });
  }
  function handleDateChange(date: Dayjs | null) {
    setFormData({ ...formData, deliveryDate: date });
  }

  function handleFormInput(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }

  function updateRoom(val: string) {
    setFormData({ ...formData, roomName: val });
  }

  async function updateItem(val: string) {
    const token = await getAccessTokenSilently();
    setFormData({ ...formData, medicalDeviceName: val });
    try {
      const item = await axios.get("/api/inventory/getNum", {
        params: { name: val },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(item.data);
      // Check if the quantity is below a threshold
      if (item.data.quant <= LOW_QUANTITY_THRESHOLD) {
        showSnackbar(`Low stock for ${val}`, "warning"); // Change severity to "warning" or another appropriate level
      }
    } catch (e) {
      console.error(e);
      showSnackbar("Can find the Medical", "error");
    }
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    if (
      formData.employeeName == "" ||
      formData.roomName == "" ||
      formData.medicalDeviceName == "" ||
      formData.quantity == 0 ||
      formData.priority == "" ||
      formData.status == "" ||
      formData.deliveryDate == null
    ) {
      alert("All fields need to be filled");
      return;
    }
    if (
      !Number.isInteger(Number(formData.quantity)) ||
      Number(formData.quantity) < 0 ||
      Number(formData.quantity) > 100
    ) {
      alert("Quantity must be an integer between 0 and 100");
      return;
    }
    try {
      await axios.post("api/medicalDevice", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setOpen(true); // Open dialog box on successful submission
    } catch (e) {
      alert(
        "Error storing in the database, make sure nodes/edges are uploaded and you are logged in.",
      );
      return;
    }
  }

  function handleSubmitClose() {
    setOpen(false);
    clear();
    window.location.reload();
  }

  return (
    <div className="w-full">
      <div
        className="overflow-m-auto mt-3 flex flex-col  px-10 h-full w-full justify-center py-1"
        // style={{
        //     boxShadow: "1px 1px 0px #999, 2px 2px 0px #999, 3px 3px 0px #999, 4px 4px 0px #999, 5px 5px 0px #999, 6px 6px 0px #999"
        // }}>
      >
        <h1 className="m-2 font-header text-primary font-extrabold text-3xl text-center">
          Medical Device Delivery Form
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 my-4">
            <UserDropdown
              room={formData.employeeName}
              update={updateName}
              label={"Username"}
            />

            <FormControl variant="filled" required>
              <InputLabel id="priority">Priority</InputLabel>
              <Select
                name="priority"
                labelId="priority"
                id="priority"
                value={formData.priority}
                onChange={handlePriorityInput}
              >
                {/*<MenuItem value="">*/}
                {/*  <em>None</em>*/}
                {/*</MenuItem>*/}
                <MenuItem value={"High"}>High</MenuItem>
                <MenuItem value={"Medium"}>Medium</MenuItem>
                <MenuItem value={"Low"}>Low</MenuItem>
                <MenuItem value={"Emergency"}>Emergency</MenuItem>
              </Select>
            </FormControl>
            <LocationDropdown
              room={formData.roomName}
              update={updateRoom}
              label={"Room"}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                sx={{ bgcolor: "#eceff0" }}
                label="Delivery Date*"
                value={formData.deliveryDate}
                disablePast
                onChange={handleDateChange}
                //renderInput={(params) => <TextField {...params} required/>}
              />
            </LocalizationProvider>

            {/*<TextField*/}
            {/*  onChange={handleFormInput}*/}
            {/*  value={formData.medicalDeviceName}*/}
            {/*  name="medicalDeviceName"*/}
            {/*  id="medicalDeviceName"*/}
            {/*  variant="filled"*/}
            {/*  label="Medical Device Name"*/}
            {/*  required={true}*/}
            {/*/>*/}
            <DeviceDropdown
              room={formData.medicalDeviceName}
              update={updateItem}
              label={"Device Name"}
            />
            <TextField
              onChange={handleFormInput}
              value={formData.quantity}
              name="quantity"
              id="quantity"
              variant="filled"
              type="number"
              inputProps={{ min: 0, max: 100, step: 1 }}
              label="Quantity"
              required={true}
            />

            <FormControl variant="filled" required>
              <InputLabel id="status">Status</InputLabel>
              <Select
                name="Status"
                labelId="status"
                id="status"
                value={formData.status}
                onChange={handleStatusInput}
              >
                {/*<MenuItem value="">*/}
                {/*  <em>None</em>*/}
                {/*</MenuItem>*/}
                <MenuItem value={"Unassigned"}>Unassigned</MenuItem>
                <MenuItem value={"Assigned"}>Assigned</MenuItem>
                <MenuItem value={"InProgress"}>In Progress</MenuItem>
                <MenuItem value={"Closed"}>Closed</MenuItem>
              </Select>
            </FormControl>

            <div className="flex justify-center mt-3">
              <Button
                className="w-32 self-center pt-10"
                onClick={clear}
                id="requestClear"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: "30px",
                  marginRight: "20px",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                CLEAR
              </Button>

              <Button
                className="w-32 self-center pt-10"
                type="submit"
                id="requestSubmit"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: "30px",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                SUBMIT
              </Button>
            </div>
          </div>
        </form>
      </div>
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleSubmitClose}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>We received your request!</DialogTitle>
          <DialogContent>
            <strong>Here are your responses:</strong>
            <br />
            Employee Name: {formData.employeeName}
            <br />
            Room Name: {formData.roomName}
            <br />
            Medical Device Name: {formData.medicalDeviceName}
            <br />
            Quantity: {formData.quantity}
            <br />
            Priority: {formData.priority}
            <br />
            Status: {formData.status}
            <br />
            Date:{formData.deliveryDate?.toString()}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleSubmitClose} autoFocus>
              Okay
            </Button>
          </DialogActions>
        </Dialog>
        <div className="text-text ml-2 font-header place-self-right">
          Credits: Najum and Sahil
        </div>
      </React.Fragment>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MedicalDeviceReq;
