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
      data: [[]]
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
    var url = 'https://cors-anywhere.herokuapp.com/https://www.dublinbus.ie/Your-Journey1/Timetables/All-Timetables/66/';
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
        allTimes[i] = timesElement[i].innerText
      }

      var counter = 0;

      for (var i = counter; i < allTimes.length - 1; i++) {
        if (parseInt(allTimes[i + 1]) >= parseInt(allTimes[i])) {
          weekdayTimes[i] = allTimes[i];
        } else {
          counter = i + 1;
          break;
        }
      }

      for (var i = counter; i < allTimes.length - 1; i++) {
        if (parseInt(allTimes[i + 1]) >= parseInt(allTimes[i])) {
          saturdayTimes[i] = allTimes[i];
        } else {
          counter = i + 1;
          break;
        }
      }

      for (var i = counter; i < allTimes.length - 1; i++) {
        if (parseInt(allTimes[i + 1]) >= parseInt(allTimes[i])) {
          sundayTimes[i] = allTimes[i];
        } else {
          counter = i + 1;
          break;
        }
      }

      const data = [[weekdayTimes],[saturdayTimes],[sundayTimes]];
      // var data = {};
      // data['weekdayTimes'] = weekdayTimes;
      // data['saturdayTimes'] = saturdayTimes;
      // data['sundayTimes'] = sundayTimes;

      this.setState({ data });

      console.dir(weekdayTimes);
      console.dir(saturdayTimes);
      console.dir(sundayTimes);
      
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
      accessor: '0' // Custom value accessors!
    },
    {
      Header: 'Saturdays',
      accessor: '0' // String-based value accessors!
    },
    {
      Header: 'Sundays',
      accessor: '0' // String-based value accessors!
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
