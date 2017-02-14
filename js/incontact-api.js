        $(function(){
            var accessToken = '';
            var baseURI = '';
            
            getToken();
            setInterval(getContactsActive, 3000);
            setInterval(timeStamp, 3000);
            
            function getToken(){
                var url_base = 'https://api.incontact.com/InContactAuthorizationServer/Token';
                var auth_token = 'Alberto@Alberto.com:24';
                auth_token = window.btoa(auth_token);
                var requestPayload = {
                    grant_type: 'password',
                    username: 'alberto.garcia@b2.com',
                    password: 'Funkyd0g01',
                    scope:''
                } 

                $.ajax({
                    url: url_base,
                    type: 'POST',
                    dataType: 'json',
                    headers: {
                        Authorization: 'basic ' + auth_token
                    },
                    data: requestPayload,
                    success: function(response){
                        accessToken = response.access_token;
                        baseURI = response.resource_server_base_uri;
                        console.log(response);
                    },
                    error: function(xhr, status, errorThrown){
                        console.log(xhr);
                        console.log(status);
                        console.log(errorThrown);
                        alert(errorThrown);
                    }
                })
            }
            
            function getContactsActive(){
                var contactsActivePayload = {
                    // Not using this, for now.
                }
                
                $.ajax({
                    url: baseURI + '/services/v8.0/contacts/active',
                    type: 'GET',
                    headers: {
                        Authorization: 'bearer ' + accessToken
                    },
                    success: function(result, status, statusCode){
                        console.log(result.resultSet.activeContacts);
                        
                        $('#count').html('Contact Count: ' + result.resultSet.activeContacts.length);
                        var tableHeaders = ['#','Contact Id', 'Skill', 'State', 'From', 'To', 'Agent Id']
                        
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
                            table += '<td>' + contact.agentId + '</td></tr>';
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
        })