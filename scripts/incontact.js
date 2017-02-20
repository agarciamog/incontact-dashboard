// file:///C:/Users/Alberto/Documents/GitHub/incontact-dashboard/dashboard.html?state=myState&scope=RealTimeApi%2cReportingApi&access_token=y9k7KdSTy%2bmFHylTNT0h9gS3QwaN2ISaDRaY7o%2bvDJdwUXquZvjcB2gOvA95Cc%2fvda3eu%2fTjpvnIt4s2VMpAif6KJ%2f23phLdv9sqt4Ohg26bU%2b%2fyGMAXnpjZn8chLJyB3%2fNAxWsCTMV%2brImZhU1HAS0JbBw6d6QFn8OuWCnZ0hWN6ALeZvP0aviZCA%2fmmTEjOf%2fMRixO3moEfEGa2r%2bZNWn%2fBtigHoX6M9474Z2uVLfxRQimITO3Mvc3AfKRZbiVDIrFlVX3W10nzYfOjx0Z0tXORpCdIMLMpgl0lqCn1Z32vQQ2CrSbm1QpmEXDsuuSMCx7L2cjS8OFeM2moV5soeMX%2fICAI1NUTaekEYenbrePS6wSd8qac1EAeBdaDrBE%2bCHLD%2fgHndA2AA2y6r%2bDzg%3d%3d&expires_in=5184000&resource_server_base_uri=https%3a%2f%2fapi-b2.incontact.com%2finContactAPI%2f&token_type=bearer
var Credentials = {
  access_token: '',
  base_uri: '',
  expires_in: '',
  setCreds: function(){
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        query_string[pair[0]] = pair[1];
    }
    console.log(query_string);
    if (typeof(query_string.access_token) != "undefined") {
        this.access_token = decodeURIComponent(query_string.access_token);
        this.base_uri = decodeURIComponent(query_string.resource_server_base_uri);
        this.expires_in = query_string.expires_in;
    }
  }
};


//********************************
// Reusable Dashboard function
//********************************
function Dashboard (el) {
  this.el = el;
  var self = this;
  var contactCount = 0;

  // Instantiate Dashboard
  //********************************
  this.init = function() {
    // TODO Add event listeners/handlers for each dashboard
    //      module.
  }

  // Get Active Contacts and display
  // in table.
  //********************************
  this.getContactsActive = function() {
      $.ajax({
          url: Credentials.base_uri + 'services/v8.0/contacts/active',
          type: 'GET',
          headers: {
              Authorization: 'bearer ' + Credentials.access_token
          },
          context: self,
          success: self.createActiveContactsTable,
          error: self.resultWrite
      })
  }

  // Create active contacts table.
  //********************************
  this.createActiveContactsTable = function(result, status, statusCode){
    var tableHeaders = ['#','Contact Id', 'Skill', 'State', 'From', 'To', 'Agent'];

    this.resultWrite(result, status, statusCode);
    if(typeof(result) != "undefined"){
      setContactCount(result.resultSet.activeContacts.length);
      var table = this.createTable(tableHeaders);

      // Add data to table
      var tableBody = ""
      $.each(result.resultSet.activeContacts, function(index, contact){
          tableBody += '<tr><td>' + (index + 1) + '</td>';
          tableBody += '<td>' + contact.contactId + '</td>';
          tableBody += '<td>' + contact.skillName + '</td>';
          tableBody += '<td>' + contact.state + '</td>';
          tableBody += '<td>' + contact.fromAddr + '</td>';
          tableBody += '<td>' + contact.toAddr + '</td>';
          tableBody += '<td>' + contact.firstName + ' ' + contact.lastName + '</td></tr>';
      });
      $('#output').html(table).find('tbody').append(tableBody);
    }
    else{ // No contacts for period.
      setContactCount(0);
      var table = this.createTable(tableHeaders);
      $('#output').html(table);
    }
  };

  // Set Contact Count
  //********************************
  var setContactCount = function(count){
    contactCount = count;
    $('#count').html('Contact Count: ' + contactCount);
  };
}

// Create table and return.
//********************************
Dashboard.prototype.createTable = function(tableHeaders){
  var table = '<table border=&quot;1&quot;><thead><tr>';

  // Add Headers
  $.each(tableHeaders, function(i, header){
      table += '<th>'+ header + '</th>';
  });
  table += '</thead></tr>';
  table += '<tbody></tbody></table>';

  return table;
};

// Return current time stamp.
//********************************
Dashboard.prototype.timeStamp =  function() {
      var now = new Date();
      var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
      var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
      var suffix = ( time[0] < 12 ) ? "AM" : "PM";

      // Convert hour from military time
      time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

      // If hour is 0, set it to 12
      time[0] = time[0] || 12;

      // If seconds and minutes are less than 10, add a zero
      for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
          time[i] = "0" + time[i];
        }
      }

    $('#timeStamp').html("<br><br> Updated on " + date.join("/") + " " + time.join(":") + " " + suffix);
};

// Write ajax result to console.
//********************************
Dashboard.prototype.resultWrite = function(result, status, statusCode){
  console.log(result);
  console.log(status);
  console.log(statusCode);
}


// Document Ready - init Dashboard
//********************************
$(function () {
  Credentials.setCreds();
  var dashboard = new Dashboard();
  dashboard.init();
  setInterval(dashboard.getContactsActive, 3000);
  setInterval(dashboard.timeStamp, 3000);
});
