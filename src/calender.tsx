import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  TodayButton,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
  BaseDirectory,
  readTextFile
} from "@tauri-apps/api/fs";

const schedulerData = [
  { startDate: '2023-03-01T09:45', endDate: '2023-03-01T11:00', title: 'Meeting' },
  { startDate: '2023-03-02T12:00', endDate: '2023-03-02T13:30', title: 'Go to a gym' },
];

interface IProps {
}

interface IState {
  data: any;
  currentDate: Date;
}



export default class Calender extends React.PureComponent<IProps, IState> {
  currentDateChange: (currentDate: any) => void;
  
  constructor(props: any) {
    super(props);

    var today = new Date();

    this.state = {
      data: schedulerData,
      currentDate: today,
    }; 

    this.currentDateChange = (currentDate) => { this.setState({ currentDate }); };
    this.commitChanges = this.commitChanges.bind(this);

    //readFile1();

  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  }


  async readFile1() {
    try {
      const result = await readTextFile("file.txt", {
        dir: BaseDirectory.App,
      });
      console.log("result: " + result);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  };  

  render() {
    const { data, currentDate }  = this.state;

    return (
      <Paper>
        <Scheduler
          data={data}
        >
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={this.currentDateChange}
          />
                    <EditingState
            onCommitChanges={this.commitChanges}
          />
          <IntegratedEditing />
          <MonthView />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments />
          <ConfirmationDialog
            ignoreCancel
          />
          <AppointmentTooltip
            showCloseButton
            showOpenButton
          />
          <AppointmentForm
          />
        </Scheduler>
      </Paper>
    );
  }
}