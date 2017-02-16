$(function () {
  var access_token, base_uri;
  init();
  setInterval(getContactsActive, 3000);
  setInterval(timeStamp, 3000);

  function init(){
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        query_string[pair[0]] = pair[1];
    }
    console.log(query_string);
    if (typeof(query_string.access_token) != "undefined") {
        access_token = decodeURIComponent(query_string.access_token);
        console.log("access_token: " + access_token);
        base_uri = decodeURIComponent(query_string.resource_server_base_uri);
        console.log("base_uri: " + base_uri);
    }
  }

  function getContactsActive(){
      var contactsActivePayload = {
          // Not using this, for now.
      }

      $.ajax({
          url: base_uri + 'services/v8.0/contacts/active',
          type: 'GET',
          headers: {
              Authorization: 'bearer ' + access_token
          },
          success: function(result, status, statusCode){
              console.log(result.resultSet.activeContacts);

              $('#count').html('Contact Count: ' + result.resultSet.activeContacts.length);
              var tableHeaders = ['#','Contact Id', 'Skill', 'State', 'From', 'To', 'Agent']

              var table = '<table border=&quot;1&quot;><tr>';

              // Add Headers
              $.each(tableHeaders, function(i, headers){
                  table += '<th>'+ headers + '</th>';
              });
              table += '</tr>';

              // Add data to table
              $.each(result.resultSet.activeContacts, function(index, contact){
                  table += '<tr><td>' + (index + 1) + '</td>';
                  table += '<td>' + contact.contactId + '</td>';
                  table += '<td>' + contact.skillName + '</td>';
                  table += '<td>' + contact.state + '</td>';
                  table += '<td>' + contact.fromAddr + '</td>';
                  table += '<td>' + contact.toAddr + '</td>';
                  table += '<td>' + contact.firstName + ' ' + contact.lastName
                                  + ' (' + contact.agentId + ')</td></tr>';
              });
              table += '</table>';
              $('#output').html(table);
          },
          error: function(xhr, status, errorThrown){
              console.log(xhr);
              console.log(status);
              console.log(errorThrown);
              $('#output').text('failed');
          }

      })
  }

  function timeStamp(){
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
  }

});
