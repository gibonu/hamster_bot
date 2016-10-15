Change Notes 15.10.2016:
- moved production api keys to be fetched from system variable
- bot will not respond to someone typing just exclamation marks ('!', '!!', etc)
- merged !image response into 1 message to people being spammed by notifications
- fixed bot message for sending image ('here is yours' => 'here is your')
- gw2wiki support!



Basic info:
create google api keys here:
  https://console.cloud.google.com/iam-admin/projects?_ga=1.76143829.1397548711.1473504468&pli=1

  create custom web search:
  https://cse.google.com/cse/create/new
  - add random site (ie. www.google.com)
  - create name
  - click create button
  - after creation go and edit your custom search engine
  - unlock image search
  - disable voice search
  - from dropdown select search whole web
  - delete previously added site (www.google.com)
  - get ID and paste it to config.json (cxImg)
