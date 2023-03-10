import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState, IntegratedEditing, ChangeSet, AppointmentModel } from '@devexpress/dx-react-scheduler';
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

const schedulerData: AppointmentModel[] = [
  { id:1, startDate: '2023-03-01T09:45', endDate: '2023-03-01T11:00', title: 'Meeting' },
  { id:2, startDate: '2023-03-02T12:00', endDate: '2023-03-02T13:30', title: 'Go to a gym', notes: "Trainingsplan Tag 1" },
];

interface IProps {
}

interface IState {
  data: AppointmentModel[];
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

    this.readFile1();

  }

  commitChanges( args:ChangeSet) {
    this.setState((state) => {
      let { data } = state;
      if (args.added) {
        
        var startingAddedId: number = 0;
        if (data.length > 0)
        {
           const lastId = data[data.length - 1].id?.valueOf();
           startingAddedId = Number(lastId) +1;
        }

        var newApp =  { id: startingAddedId, ...args.added } as AppointmentModel
        data = [...data, newApp ];
        
      }
      if (args.changed) { 
          var changed = args.changed;
          data = data.map(appointment => {
              if (appointment.id)
              {
                if (changed[appointment.id?.valueOf()])
                {
                  return { ...appointment, ...changed[appointment.id] }
                }
              }
            
              return appointment;
            }
          );
      }
      if (args.deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== args.deleted);
      }
      return { data };
    });
  }


  async readFile1() {
    try {
      const result = await readTextFile("file1.txt", {
        dir: BaseDirectory.Desktop,
      });
      this.setState((state) => {
        let { data } = state;
          
        var startingAddedId: number = 0;
        if (data.length > 0)
        {
            const lastId = data[data.length - 1].id?.valueOf();
            startingAddedId = Number(lastId) +1;
        }
  
        var newApp: AppointmentModel =  { id: startingAddedId, startDate: '2023-03-04T09:45', endDate: '2023-03-04T11:00', title: result };
        data = [...data, newApp ];
          
      
        return { data };
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