import React from "react";
import dateFns from "date-fns";
import axios from 'axios';
class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    availableData:[]

  };

  componentDidMount() {
    axios.get(`http://188.166.34.157/service/jazz/dates`)
        .then(res => {
          const availableData = res.data.dates;
          this.setState({ availableData:availableData});
        });


  }
  checkDate(date){
    if(this.state.availableData.includes(date)){
      return true;
    }
  }
  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }
  getSchedule( serviceAlias, date ){
    let day = dateFns.parse(date);
    this.setState({
      selectedDate: day
    });
  }

  renderCells() {
    console.log(this.state.availableData)
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const checkFormat = "DD.MM.YYYY";
    const rows = [];

    let days = [];
    let day = startDate;


    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = dateFns.format(day, dateFormat);
        const formattedCheck = dateFns.format(day, checkFormat);
        const cloneDay = day;
        let activeDay=false;
        if(this.checkDate(formattedCheck)){
          activeDay=true;
        }
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""

            } ${activeDay ? "" : " disabled"}`}
            key={day}
            onClick={() => this.getSchedule(formattedCheck,cloneDay )}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {

  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

export default Calendar;
