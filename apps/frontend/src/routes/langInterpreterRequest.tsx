import { useAuth0 } from "@auth0/auth0-react";
import React, { FormEvent, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { langInterpreterType } from "common/src/langInterpreterType.ts";
import { Dayjs } from "dayjs";
import axios from "axios";
import UserDropdown from "../components/userDropdown.tsx";
import LocationDropdown from "../components/locationDropdown.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function LangInterpreterReq() {
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

  const { getAccessTokenSilently } = useAuth0();
  const initialFormData: langInterpreterType = {
    name: "",
    location: "",
    date: null,
    priority: "Medium",
    language: "",
    modeOfInterp: "",
    specInstruct: "",
    status: "Unassigned",
  };

  const [formData, setFormData] =
    useState<langInterpreterType>(initialFormData);

  const [open, setOpen] = useState(false);

  function handleFormDataChanges(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function updateName(val: string) {
    setFormData({ ...formData, name: val });
  }

  function updateLoc(val: string) {
    setFormData({ ...formData, location: val });
  }

  function handleDateInput(date: Dayjs | null) {
    setFormData({ ...formData, date: date });
  }

  function handlePriorityInput(e: SelectChangeEvent) {
    setFormData({ ...formData, priority: e.target.value });
  }

  function handleLangInput(e: SelectChangeEvent) {
    setFormData({ ...formData, language: e.target.value });
  }

  function handleModeOfInterpInput(e: SelectChangeEvent) {
    setFormData({ ...formData, modeOfInterp: e.target.value });
  }

  function handleStatusInput(e: SelectChangeEvent) {
    setFormData({ ...formData, status: e.target.value });
  }

  function clear() {
    setFormData(initialFormData);
  }

  function handleSubmitClose() {
    setOpen(false);
    clear();
    window.location.reload();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    if (
      formData.name == "" ||
      formData.location == "" ||
      formData.date == null ||
      formData.priority == "" ||
      formData.language == "" ||
      formData.modeOfInterp == "" ||
      formData.status == ""
    ) {
      alert("All fields need to be filled");
      return;
    }
    try {
      await axios.post("/api/langInterpreter", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      alert(
        "Error storing in the database, make sure nodes/edges are uploaded and you are logged in.",
      );
      console.error(e);
      return;
    }

    setOpen(true);
  }

  return (
    <div className="w-full">
      <div className="m-auto mt-3 flex flex-col px-10 h-full w-full justify-center py-1">
        <h1 className="my-2 font-header text-primary font-extrabold text-3xl text-center">
          Language Interpreter Form
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 my-4">
            <UserDropdown
              room={formData.name}
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
              room={formData.location}
              update={updateLoc}
              label={"Location"}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                sx={{ bgcolor: "#eceff0" }}
                label="Date Requested *"
                value={formData.date}
                disablePast
                onChange={handleDateInput}
                //renderInput={(params) => <TextField {...params} required/>}
              />
            </LocalizationProvider>
            <FormControl variant="filled" required>
              <InputLabel id="lang">Language Requested</InputLabel>
              <Select
                name="lang"
                labelId="lang"
                id="lang"
                value={formData.language}
                onChange={handleLangInput}
              >
                <MenuItem value={"Arabic"}>
                  <span style={{ marginRight: "auto" }}>(Arabic)</span>
                  <span style={{ marginLeft: "auto" }}> عربي</span>
                </MenuItem>
                <MenuItem value={"Bengali"}>বাংলা (Bengali)</MenuItem>
                <MenuItem value={"French"}>Français (French)</MenuItem>
                <MenuItem value={"German"}>Deutsch (German)</MenuItem>
                <MenuItem value={"Greek"}>Ελληνικά (Greek)</MenuItem>
                <MenuItem value={"Gujarati"}>ગુજરાતી (Gujarati)</MenuItem>
                <MenuItem value={"Hindi"}>हिन्दी (Hindi)</MenuItem>
                <MenuItem value={"Italian"}>Italiano (Italian)</MenuItem>
                <MenuItem value={"Japanese"}>日本語 (Japanese)</MenuItem>
                <MenuItem value={"Korean"}>한국인 (Korean)</MenuItem>
                <MenuItem value={"Lao"}>ອັກສອນລາວ (Lao)</MenuItem>
                <MenuItem value={"Marathi"}>मराठी (Marathi)</MenuItem>
                <MenuItem value={"Polish"}>Język Polski (Polish)</MenuItem>
                <MenuItem value={"Portuguese"}>Português (Portuguese)</MenuItem>
                <MenuItem value={"Punjabi"}>
                  <span style={{ marginRight: "auto" }}>ਪੰਜਾਬੀ (Punjabi)</span>
                  <span style={{ marginLeft: "auto" }}> پنجابی</span>
                </MenuItem>
                <MenuItem value={"Russian"}>Pусский (Russian)</MenuItem>
                <MenuItem value={"Spanish"}>Español (Spanish)</MenuItem>
                <MenuItem value={"Tagalog"}>Wikang Tagalog (Filipino)</MenuItem>
                <MenuItem value={"Tamil"}>தமிழ் (Tamil)</MenuItem>
                <MenuItem value={"Turkish"}>Türkçe (Turkish)</MenuItem>
                <MenuItem value={"Mandarin"}>普通话 (Mandarin)</MenuItem>
                <MenuItem value={"Urdu"}>
                  <span style={{ marginRight: "auto" }}>(Urdu)</span>
                  <span style={{ marginLeft: "auto" }}> اردو</span>
                </MenuItem>
                <MenuItem value={"Vietnamese"}>
                  Tiếng Việt (Vietnamese)
                </MenuItem>
                <MenuItem value={"Yoruba"}>Èdè Yorùbá (Yoruba)</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="filled" required>
              <InputLabel id="MoI">Mode of Interpretation</InputLabel>
              <Select
                name="MoI"
                labelId="MoI"
                id="MoI"
                value={formData.modeOfInterp}
                onChange={handleModeOfInterpInput}
              >
                {/*<MenuItem value="">*/}
                {/*  <em>None</em>*/}
                {/*</MenuItem>*/}
                <MenuItem value={"In Person"}>In Person</MenuItem>
                <MenuItem value={"Video Call"}>Video Call</MenuItem>
                <MenuItem value={"Audio Call"}>Audio Call</MenuItem>
                <MenuItem value={"Written Word"}>Written Word</MenuItem>
              </Select>
            </FormControl>
            <TextField
              onChange={handleFormDataChanges}
              value={formData.specInstruct}
              id="specInstruct"
              name="specInstruct"
              variant="filled"
              label="Special Instructions"
              placeholder=""
            />
            <FormControl variant="filled" required>
              <InputLabel id="status">Status</InputLabel>
              <Select
                name="status"
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
                id="clear"
                onClick={clear}
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
            Name: {formData.name}
            <br />
            Location: {formData.location}
            <br />
            Date: {formData.date?.toString()}
            <br />
            Priority: {formData.priority}
            <br />
            Language Requested: {formData.language}
            <br />
            Mode of Interpretation: {formData.modeOfInterp}
            <br />
            Special Instructions: {formData.specInstruct}
            <br />
            Status: {formData.status}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmitClose} autoFocus>
              Okay
            </Button>
          </DialogActions>
        </Dialog>
        <div className="text-text ml-2 font-header place-self-right">
          Credits: Najum
        </div>
      </React.Fragment>
    </div>
  );
}

export default LangInterpreterReq;
