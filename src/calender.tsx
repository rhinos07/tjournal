import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
  BaseDirectory,
  readTextFile
} from "@tauri-apps/api/fs";

const schedulerData = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
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


    //readFile1();

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
          <MonthView />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments />
        </Scheduler>
      </Paper>
    );
  }
}