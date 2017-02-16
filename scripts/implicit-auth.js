var application = "dashboard";
var vendor = "agarciamog.github.io";
var client_id = application + "@" + vendor;
var implicitURI = "https://api.incontact.com/InContactAuthorizationServer/Authenticate";
var token_scope = "RealTimeApi";
var redirect_uri = "https://agarciamog.github.io/incontact-dashboard/redirect";
var state_object = "myState";

function RedirectToAuthPage() {
  var url = implicitURI;
  url = url + "?state=" + state_object;
  url = url + "&response_type=token";
  url = url + "&client_id=" + encodeURIComponent(client_id);
  url = url + "&redirect_uri=" + encodeURIComponent(redirect_uri);
  url = url + "&scope=" + encodeURIComponent(token_scope);
  window.location.href = url;
}

RedirectToAuthPage();
