require('./style.css');
var _ = require('lodash');

var DAYS = _.range(1, 32).map((day) => ("Oct " + day));

var randomMillis = function() {
  return 0; //Math.floor(Math.random() * 500);
}

/* React Components */

var EventEmitter = require('events');
var React = require('react/addons');
var Cell = React.createClass({
  render: function() {
    if (this.state.isSearching) {
      return (
        <td className='hour-cell'>
          <div className='searching'>
            ...
          </div>
        </td>
      );
    } else if (this.state.searchResults) {
      var options = this.state.searchResults.options;
      var classes = React.addons.classSet({
        'good-results': options > 3,
        'weak-results': options > 1 && options <= 3,
        'bad-results' : options >= 0 && options <= 1
      });
      return (
        <td className='hour-cell' onClick={this.clicked}>
          <div className={classes}>
            <div>{this.state.searchResults}</div>
            <div className="result-label">results</div>
          </div>
        </td>
      );
    } else {
      return (
        <td className='hour-cell' onClick={this.clicked}>
          <div className='time'>
            {this.props.hour}:00
          </div>
        </td>
      );
    }
  },
  getInitialState: function() {
    return {
      isSearching: false,
      searchResults: null
    }
  },
  clicked: function() {
    this.search();
  },
  search: function() {
    var self = this;
    self.setState({
      isSearching: true,
      searchResults: {options: null}
    });
    setTimeout(function() {
      self.setState({
        isSearching: false,
        searchResults: {options: Math.floor(Math.random() * 5)}
      });
    }, randomMillis());
  },
  componentWillMount: function() {
    this.props.events.on('search', () => this.search());
  }
});

var Calendar = React.createClass({
  render: function() {
    return (
      <div>
        {this.state.isLoaded ||
         <button className='btn' onClick={this.load}>Load</button>}
        {this.state.isLoaded &&
         <button className='btn' onClick={this.searchAll}>Search all month</button>}
        {this.state.isLoaded &&
         <table>
           <tr>
             {DAYS.map((day) => (
               <th className='day-header' onClick={this.clicked}>{day}</th>
             ))}
           </tr>
           {_.range(24).map((hour) => (
             <tr>
               {DAYS.map((day) => (
                 <Cell hour={hour} day={day} key={day} events={this.events} />
               ))}
             </tr>
           ))}
         </table>
        }
      </div>
      )
  },
  componentWillMount: function() {
    this.events = new EventEmitter();
    this.events.setMaxListeners(0);
  },
  getInitialState: function() {
    return {
      isLoaded: false
    }
  },
  load: function() {
    this.setState({isLoaded: true});
  },
  searchAll: function(args) {
    this.events.emit('search');
  }
});

setTimeout(function() {
  React.render(<Calendar/>, document.querySelector('my-calendar-react'));
}, 0);
