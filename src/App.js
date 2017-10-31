import React, { Component } from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import axios from 'axios';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data1: [],
      data2: [],
      busRouteNumber: '',
      timeTableHeadings: ['Please enter a route number','Please enter a route number']
    };

    // For entering bus stop numbers: https://reactjs.org/docs/forms.html
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ busRouteNumber: event.target.value });
  }

  handleSubmit(event) {
    this.makeCORSRequest();
    event.preventDefault();
  }

  createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);

    } else {

      // Otherwise, CORS is not supported by the browser.
      xhr = null;

    }
    return xhr;
  }

  makeCORSRequest() {
    // var url = 'https://www.dublinbus.ie/Your-Journey1/Timetables/All-Timetables/66/';
    var url = `https://cors-anywhere.herokuapp.com/https://www.dublinbus.ie/Your-Journey1/Timetables/All-Timetables/${this.state.busRouteNumber}/`;
    var xhr = this.createCORSRequest('GET', url);
    if (!xhr) {
      throw new Error('CORS not supported');
    }
    xhr.onload = function () {
      var responseText = xhr.responseText;

      var el = document.createElement('html');
      el.innerHTML = responseText;

      // HEADINGS
      var headingsElement = el.getElementsByClassName('TT_Title_left');
      var allHeadings = [];

      for (var i = 0; i < headingsElement.length; i++) {
        allHeadings[i] = headingsElement[i].innerText.replace(/(\r\n|\n|\r)/gm, "").trim();
      }

      this.setState({ timeTableHeadings: allHeadings });

      // TIMES
      var timesElement = el.getElementsByClassName('time');
      var allTimes = [];
      var weekdayTimes1 = [], saturdayTimes1 = [], sundayTimes1 = [], weekdayTimes2 = [], saturdayTimes2 = [], sundayTimes2 = [];

      for (var i = 0; i < timesElement.length; i++) {
        allTimes[i] = timesElement[i].innerText.trim();
      }

      var counter = 0;
      var currentCounter = 0;

      var fillTimesArray = function(arrayName) {
        for (var i = counter; i < allTimes.length - 1; i++) {
          if (parseInt(allTimes[i + 1]) >= parseInt(allTimes[i])) {
            arrayName[i - currentCounter] = allTimes[i];
          } else {
            arrayName[i - currentCounter] = allTimes[i];
            counter = i + 1;
            break;
          }
        }
        currentCounter = counter
      }

      fillTimesArray(weekdayTimes1);
      fillTimesArray(saturdayTimes1);
      fillTimesArray(sundayTimes1);

      fillTimesArray(weekdayTimes2);
      fillTimesArray(saturdayTimes2);
      fillTimesArray(sundayTimes2);

      var data1 = [];

      var longestArrayLength = Math.max(weekdayTimes1.length, saturdayTimes1.length, sundayTimes1.length, weekdayTimes2.length, saturdayTimes2.length, sundayTimes2.length);
      for (var i = 0; i < longestArrayLength; i++) {
        data1.push({
          "weekdayTime1": weekdayTimes1[i],
          "saturdayTime1": saturdayTimes1[i],
          "sundayTime1": sundayTimes1[i],
          "weekdayTime2": weekdayTimes2[i],
          "saturdayTime2": saturdayTimes2[i],
          "sundayTime2": sundayTimes2[i]
        });
      }

      this.setState({ data1 });

      console.dir(data1);

      // process the response.
    }.bind(this);
    xhr.onerror = function () {
      console.log('There was an error!');
    };
    xhr.send();
  }

  render() {
    const columns1 = [{
      id: 'weekdays',
      Header: 'Weekdays',
      accessor: 'weekdayTime1' // Custom value accessors!
    },
    {
      id: 'saturdays',
      Header: 'Saturdays',
      accessor: 'saturdayTime1' // String-based value accessors!
    },
    {
      id: 'sundays',
      Header: 'Sundays',
      accessor: 'sundayTime1' // String-based value accessors!
    }]
    const columns2 = [{
      id: 'weekdays',
      Header: 'Weekdays',
      accessor: 'weekdayTime2' // Custom value accessors!
    },
    {
      id: 'saturdays',
      Header: 'Saturdays',
      accessor: 'saturdayTime2' // String-based value accessors!
    },
    {
      id: 'sundays',
      Header: 'Sundays',
      accessor: 'sundayTime2' // String-based value accessors!
    }]
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Route Number:
          <input type="text" value={this.state.busRouteNumber} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Go" />
        </form>

        <div id="timetable-container">
          <div class="timetable">
            <div class="center"><strong>{this.state.timeTableHeadings[0]}</strong></div>
            <ReactTable
              data={this.state.data1}
              columns={columns1}
              sortable={false}
            />
          </div>
          <div class="timetable">
            <div class="center"><strong>{this.state.timeTableHeadings[1]}</strong></div>
            <ReactTable
              data={this.state.data1}
              columns={columns2}
              sortable={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
