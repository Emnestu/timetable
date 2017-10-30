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
      data: []
    };
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
    var url = 'https://cors-anywhere.herokuapp.com/https://www.dublinbus.ie/Your-Journey1/Timetables/All-Timetables/67/';
    var xhr = this.createCORSRequest('GET', url);
    if (!xhr) {
      throw new Error('CORS not supported');
    }
    xhr.onload = function () {
      var responseText = xhr.responseText;

      //test
      var el = document.createElement('html');
      el.innerHTML = responseText;
      var timesElement = el.getElementsByClassName('time');
      var allTimes = [];
      var weekdayTimes = [], saturdayTimes = [], sundayTimes = [];

      for (var i = 0; i < timesElement.length; i++) {
        allTimes[i] = timesElement[i].innerText.trim();
      }
      var counter = 0;
      var currentCounter = 0;

      for (var i = counter; i < allTimes.length - 1; i++) {
        if (parseInt(allTimes[i + 1]) >= parseInt(allTimes[i])) {
          weekdayTimes[i - currentCounter] = allTimes[i];
        } else {
          weekdayTimes[i - currentCounter] = allTimes[i];
          counter = i + 1;
          break;
        }
      }

      currentCounter = counter;
      console.log(currentCounter);

      for (var i = counter; i < allTimes.length - 1; i++) {
        if (parseInt(allTimes[i + 1]) >= parseInt(allTimes[i])) {
          saturdayTimes[i - currentCounter] = allTimes[i];
        } else {
          saturdayTimes[i - currentCounter] = allTimes[i];
          counter = i + 1;
          break;
        }
      }

      currentCounter = counter;
      console.log(currentCounter);

      for (var i = counter; i < allTimes.length - 1; i++) {
        if (parseInt(allTimes[i + 1]) >= parseInt(allTimes[i])) {
          sundayTimes[i - currentCounter] = allTimes[i];
        } else {
          sundayTimes[i - currentCounter] = allTimes[i];
          counter = i + 1;
          break;
        }
      }

      var data = [];
      
      var longestArrayLength = Math.max(weekdayTimes.length, saturdayTimes.length, sundayTimes.length);
      for (var i = 0; i < longestArrayLength; i++) {
        data.push({
          "weekdayTime": weekdayTimes[i],
          "saturdayTime": saturdayTimes[i],
          "sundayTime": sundayTimes[i]
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

  render() {
    this.makeCORSRequest();
    const columns = [{
      id: 'weekdays',
      Header: 'Weekdays',
      accessor: 'weekdayTime' // Custom value accessors!
    },
    {
      id: 'saturdays',
      Header: 'Saturdays',
      accessor: 'saturdayTime' // String-based value accessors!
    },
    {
      id: 'sundays',
      Header: 'Sundays',
      accessor: 'sundayTime' // String-based value accessors!
    }]
    return (
      <div>
        <ReactTable
          data={this.state.data}
          columns={columns}
        />
      </div>
    );
  }
}

export default App;
