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
      data: [],
      busRouteNumber: '',
      timeTableHeadings: ['Please enter a route number', 'Please enter a route number'],
      // For converting bus route number to its browser route equivalent
      routeEquivalentArray: {
        "1": "/Your-Journey1/Timetables/All-Timetables/113/",
        "4": "/Your-Journey1/Timetables/All-Timetables/4/",
        "7": "/Your-Journey1/Timetables/All-Timetables/7-/",
        "7a": "/Your-Journey1/Timetables/All-Timetables/73/",
        "7b": "/Your-Journey1/Timetables/All-Timetables/7b-/",
        "7d": "/Your-Journey1/Timetables/All-Timetables/7d-/",
        "7n": "/Your-Journey1/Timetables/All-Timetables/7n/",
        "9": "/Your-Journey1/Timetables/All-Timetables/922/",
        "11": "/Your-Journey1/Timetables/All-Timetables/1121/",
        "13": "/Your-Journey1/Timetables/All-Timetables/13/",
        "14": "/Your-Journey1/Timetables/All-Timetables/14-2/",
        "15": "/Your-Journey1/Timetables/All-Timetables/15/",
        "15a": "/Your-Journey1/Timetables/All-Timetables/15a/",
        "15d": "/Your-Journey1/Timetables/All-Timetables/15b22/",
        "15b": "/Your-Journey1/Timetables/All-Timetables/15b2/",
        "15n": "/Your-Journey1/Timetables/All-Timetables/15n/",
        "16": "/Your-Journey1/Timetables/All-Timetables/16-2/",
        "17": "/Your-Journey1/Timetables/All-Timetables/New-Route-17/",
        "17a": "/Your-Journey1/Timetables/All-Timetables/17a-/",
        "18": "/Your-Journey1/Timetables/All-Timetables/18/",
        "25": "/Your-Journey1/Timetables/All-Timetables/25/",
        "25a": "/Your-Journey1/Timetables/All-Timetables/25a-/",
        "25d": "/Your-Journey1/Timetables/All-Timetables/25d2/",
        "25b": "/Your-Journey1/Timetables/All-Timetables/25b311/",
        "25n": "/Your-Journey1/Timetables/All-Timetables/25n/",
        "25x": "/Your-Journey1/Timetables/All-Timetables/25x311/",
        "26": "/Your-Journey1/Timetables/All-Timetables/26/",
        "27": "/Your-Journey1/Timetables/All-Timetables/272/",
        "27b": "/Your-Journey1/Timetables/All-Timetables/27b21/",
        "27a": "/Your-Journey1/Timetables/All-Timetables/27a-/",
        "27x": "/Your-Journey1/Timetables/All-Timetables/27x-Revised-Fares/",
        "29a": "/Your-Journey1/Timetables/All-Timetables/29a/",
        "29n": "/Your-Journey1/Timetables/All-Timetables/29n/",
        "31/a": "/Your-Journey1/Timetables/All-Timetables/31a-1/",
        "31b": "/Your-Journey1/Timetables/All-Timetables/31b21/",
        "31d": "/Your-Journey1/Timetables/All-Timetables/7d-Revised-Times2/",
        "31n": "/Your-Journey1/Timetables/All-Timetables/31n-Revised-Times/",
        "32": "/Your-Journey1/Timetables/All-Timetables/321/",
        "32x": "/Your-Journey1/Timetables/All-Timetables/32x-/",
        "33a": "/Your-Journey1/Timetables/All-Timetables/33a3/",
        "33": "/Your-Journey1/Timetables/All-Timetables/33/",
        "33b": "/Your-Journey1/Timetables/All-Timetables/33b/",
        "33d": "/Your-Journey1/Timetables/All-Timetables/33d-/",
        "33n": "/Your-Journey1/Timetables/All-Timetables/33n-Revised-Times/",
        "33x": "/Your-Journey1/Timetables/All-Timetables/33x-/",
        "37": "/Your-Journey1/Timetables/All-Timetables/37-/",
        "38": "/Your-Journey1/Timetables/All-Timetables/38-/",
        "38a": "/Your-Journey1/Timetables/All-Timetables/38a-11/",
        "38b": "/Your-Journey1/Timetables/All-Timetables/38b/",
        "39": "/Your-Journey1/Timetables/All-Timetables/393/",
        "39a": "/Your-Journey1/Timetables/All-Timetables/39a-3/",
        "39x": "/Your-Journey1/Timetables/All-Timetables/27x-Revised-Fares1/",
        "39n": "/Your-Journey1/Timetables/All-Timetables/39n/",
        "40": "/Your-Journey1/Timetables/All-Timetables/40-/",
        "40b": "/Your-Journey1/Timetables/All-Timetables/40b-/",
        "40d": "/Your-Journey1/Timetables/All-Timetables/40d/",
        "41": "/Your-Journey1/Timetables/All-Timetables/41/",
        "41b": "/Your-Journey1/Timetables/All-Timetables/41b/",
        "41c": "/Your-Journey1/Timetables/All-Timetables/41c/",
        "41n": "/Your-Journey1/Timetables/All-Timetables/41n/",
        "41x": "/Your-Journey1/Timetables/All-Timetables/41x3/",
        "42": "/Your-Journey1/Timetables/All-Timetables/422/",
        "42d": "/Your-Journey1/Timetables/All-Timetables/7d-Revised-Times22/",
        "42n": "/Your-Journey1/Timetables/All-Timetables/42n/",
        "43": "/Your-Journey1/Timetables/All-Timetables/432/",
        "44": "/Your-Journey1/Timetables/All-Timetables/44/",
        "44b": "/Your-Journey1/Timetables/All-Timetables/44b2/",
        "45a": "/Your-Journey1/Timetables/All-Timetables/45a/",
        "46a": "/Your-Journey1/Timetables/All-Timetables/46a-21/",
        "46e": "/Your-Journey1/Timetables/All-Timetables/46e-/",
        "46n": "/Your-Journey1/Timetables/All-Timetables/46n/",
        "47": "/Your-Journey1/Timetables/All-Timetables/471/",
        "49": "/Your-Journey1/Timetables/All-Timetables/49/",
        "49n": "/Your-Journey1/Timetables/All-Timetables/49n/",
        "51d": "/Your-Journey1/Timetables/All-Timetables/51d/",
        "51x": "/Your-Journey1/Timetables/All-Timetables/51x2/",
        "53": "/Your-Journey1/Timetables/All-Timetables/53/",
        "54a": "/Your-Journey1/Timetables/All-Timetables/54a-Revised-Times1/",
        "56a": "/Your-Journey1/Timetables/All-Timetables/56a/",
        "59": "/Your-Journey1/Timetables/All-Timetables/59-/",
        "61": "/Your-Journey1/Timetables/All-Timetables/612/",
        "63": "/Your-Journey1/Timetables/All-Timetables/63-/",
        "65": "/Your-Journey1/Timetables/All-Timetables/65/",
        "65b": "/Your-Journey1/Timetables/All-Timetables/65b2/",
        "66": "/Your-Journey1/Timetables/All-Timetables/66/",
        "66a": "/Your-Journey1/Timetables/All-Timetables/66a/",
        "66b": "/Your-Journey1/Timetables/All-Timetables/66b/",
        "66n": "/Your-Journey1/Timetables/All-Timetables/66n/",
        "66x": "/Your-Journey1/Timetables/All-Timetables/66x/",
        "67": "/Your-Journey1/Timetables/All-Timetables/67/",
        "67n": "/Your-Journey1/Timetables/All-Timetables/67n/",
        "67x": "/Your-Journey1/Timetables/All-Timetables/67x3/",
        "68/a": "/Your-Journey1/Timetables/All-Timetables/68-1111/",
        "68x": "/Your-Journey1/Timetables/All-Timetables/68x-/",
        "69": "/Your-Journey1/Timetables/All-Timetables/69-2/",
        "69n": "/Your-Journey1/Timetables/All-Timetables/69n/",
        "69x": "/Your-Journey1/Timetables/All-Timetables/69x-/",
        "70": "/Your-Journey1/Timetables/All-Timetables/703/",
        "70d": "/Your-Journey1/Timetables/All-Timetables/7d-Revised-Times21/",
        "70n": "/Your-Journey1/Timetables/All-Timetables/70n-Revised-Times/",
        "75": "/Your-Journey1/Timetables/All-Timetables/7511/",
        "76a": "/Your-Journey1/Timetables/All-Timetables/76a4/",
        "76": "/Your-Journey1/Timetables/All-Timetables/761/",
        "77a": "/Your-Journey1/Timetables/All-Timetables/77a-1/",
        "77n": "/Your-Journey1/Timetables/All-Timetables/77n/",
        "77x": "/Your-Journey1/Timetables/All-Timetables/77x21/",
        "79/a": "/Your-Journey1/Timetables/All-Timetables/79a/",
        "83": "/Your-Journey1/Timetables/All-Timetables/8321/",
        "84/a": "/Your-Journey1/Timetables/All-Timetables/84a1/",
        "84n": "/Your-Journey1/Timetables/All-Timetables/84n-Revised-Times1/",
        "84x": "/Your-Journey1/Timetables/All-Timetables/84x211/",
        "88n": "/Your-Journey1/Timetables/All-Timetables/88n-Revised-Times/",
        "90": "/Your-Journey1/Timetables/All-Timetables/902/",
        "102": "/Your-Journey1/Timetables/All-Timetables/102/",
        "104": "/Your-Journey1/Timetables/All-Timetables/104111/",
        "111": "/Your-Journey1/Timetables/All-Timetables/11111/",
        "114": "/Your-Journey1/Timetables/All-Timetables/1141/",
        "116": "/Your-Journey1/Timetables/All-Timetables/116/",
        "118": "/Your-Journey1/Timetables/All-Timetables/1181/",
        "120": "/Your-Journey1/Timetables/All-Timetables/120/",
        "122": "/Your-Journey1/Timetables/All-Timetables/122-/",
        "123": "/Your-Journey1/Timetables/All-Timetables/12322/",
        "130": "/Your-Journey1/Timetables/All-Timetables/130/",
        "140": "/Your-Journey1/Timetables/All-Timetables/140-/",
        "142": "/Your-Journey1/Timetables/All-Timetables/1422/",
        "145": "/Your-Journey1/Timetables/All-Timetables/145-/",
        "150": "/Your-Journey1/Timetables/All-Timetables/150-/",
        "151": "/Your-Journey1/Timetables/All-Timetables/1512/",
        "161": "/Your-Journey1/Timetables/All-Timetables/161/",
        "184": "/Your-Journey1/Timetables/All-Timetables/1842/",
        "185": "/Your-Journey1/Timetables/All-Timetables/185-/",
        "220": "/Your-Journey1/Timetables/All-Timetables/2200/",
        "236": "/Your-Journey1/Timetables/All-Timetables/2362/",
        "238": "/Your-Journey1/Timetables/All-Timetables/238/",
        "239": "/Your-Journey1/Timetables/All-Timetables/2392/",
        "270": "/Your-Journey1/Timetables/All-Timetables/270/",
        "747": "/Your-Journey1/Timetables/All-Timetables/7471121/",
        "757": "/Your-Journey1/Timetables/All-Timetables/747111/"
      }
    };

    // For entering route numbers: https://reactjs.org/docs/forms.html
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  convertBusToRoute(n) {
    return this.state.routeEquivalentArray[n];
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
    var url = `https://cors-anywhere.herokuapp.com/https://www.dublinbus.ie${this.convertBusToRoute(this.state.busRouteNumber)}/`;
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

      var fillTimesArray = function (arrayName) {
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

      // At this point, the arrays should contain respective times of buses leaving the terminal
      // Here you can run a function to store the above 6 arrays of times in the database
      // Afterwards, you can edit the getTimesFromDatabase() function below -
      // since the times will now be in the database, it can be used instead of this one

      var data = [];

      var longestArrayLength = Math.max(weekdayTimes1.length, saturdayTimes1.length, sundayTimes1.length, weekdayTimes2.length, saturdayTimes2.length, sundayTimes2.length);
      for (var i = 0; i < longestArrayLength; i++) {
        data.push({
          "weekdayTime1": weekdayTimes1[i],
          "saturdayTime1": saturdayTimes1[i],
          "sundayTime1": sundayTimes1[i],
          "weekdayTime2": weekdayTimes2[i],
          "saturdayTime2": saturdayTimes2[i],
          "sundayTime2": sundayTimes2[i]
        });
      }

      this.setState({ data });

      console.dir(data);

      // process the response.
    }.bind(this);
    xhr.onerror = function () {
      console.log('There was an error!');
    };
    xhr.send();
  }

  getTimesFromDatabase() {
    var data = [];

    // Replace all mentions of the the weekdayTimes arrays below with however you're accessing data from the database
    // Afterwards, replace "this.makeCORSRequest()" in the handleSubmit() function with "this.getTimesFromDatabase()"

    // var longestArrayLength = Math.max(weekdayTimes1.length, saturdayTimes1.length, sundayTimes1.length, weekdayTimes2.length, saturdayTimes2.length, sundayTimes2.length);
    // for (var i = 0; i < longestArrayLength; i++) {

    //   data.push({
    //     "weekdayTime1": weekdayTimes1[i],
    //     "saturdayTime1": saturdayTimes1[i],
    //     "sundayTime1": sundayTimes1[i],
    //     "weekdayTime2": weekdayTimes2[i],
    //     "saturdayTime2": saturdayTimes2[i],
    //     "sundayTime2": sundayTimes2[i]
    //   });
    // }

    this.setState({ data });

    console.dir(data);
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
              data={this.state.data}
              columns={columns1}
              sortable={false}
            />
          </div>
          <div class="timetable">
            <div class="center"><strong>{this.state.timeTableHeadings[1]}</strong></div>
            <ReactTable
              data={this.state.data}
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
