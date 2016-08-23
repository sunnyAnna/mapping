# Neighborhood Map Project

Single page app that allows you to learn about upcoming meetups in your neighborhood.

### INSTRUCTIONS

The project is being hosted on [this page](https://sunnyanna.github.io/mapping).

To see a list of upcoming meetups in your neighborhood, type in the address and choose a radius you'd like to be covered (default: 1mi, max: 5mi). After the results are loaded you can use the radius slider to filter the meetups by distance from your address. Clicking on a name of a meetup will display more detailed info about the event.

### GOALS

1. Develop a single-page application featuring a map of a neighborhood.
2. Functionality should include: map markers, a search function and a listview.
3. Implement at least two third-party APIs to provide additional information about interesting locations in the neighborhood.

### ATTRIBUTIONS

Libraries:
- [jQuery](https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js)
- [Oauth2](https://github.com/andreassolberg/jso)
- [GMapsJS](https://hpneo.github.io/gmaps)

Framework:
- [KnockoutJS](http://knockoutjs.com/index.html)

API data:
- [Google Maps](https://maps.googleapis.com/maps/api/js)
- [Meetup](https://secure.meetup.com/meetup_api)

File and module loader:
- [RequireJS](http://requirejs.org)

JS task runner:
- [Grunt](http://gruntjs.com)

Creative:
- Fonts: [Google Fonts](https://fonts.google.com)
- Icon: [Bryn Taylor](https://dribbble.com/shots/1934932-77-Essential-Icons-Free-Download)

### GRUNT

Grunt plugins were used for adding Google Maps API call functionality within RequireJS, minimizing normalize.css file as well as files in js/lib folder (JS files in app folder have not been minimized to preserve readability).

Instructions for adding _node_modules_ and running Grunt for this project:

Download the plugins:
- `npm install amd-googlemaps-loader`
- `npm install grunt-cssnano --save-dev`
- `npm install grunt-contrib-uglify --save-dev`

Run the plugins:
- Compress css file: `grunt cssnano`
- Compress Javascript file: `grunt uglify`
