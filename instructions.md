# Programmability 201: Building Applications
---

## Workshop Agenda

During this 90-minute session you will be building the following New Relic Application. The ap uses browser data to display the number of sessions and average duration by the users country and region. If a country code is enter into the `TextField`, the application will update displaying data just for the provided country.

Each step is created to allow you to practice building a complete New Relic Application, while providing helpful hints, code snippets, and resources through the the developement process.

- Find additional resources in the RESOURCES.md
- If stuck, see the full walkthrough in WALKTHROUGH.md

At the end of the Programmability 201 workshop, your final application will look similar to below:

![Finished app]()


### Agenda
- STEP 0: Getting Started [10 min]
- STEP 1: Buildng with New Relic Components [25 min]
- Step 2: More Data. More Packages. [40 min]


## STEP 0: Getting Started
---
---

Step 0 is all about getting started. Take a few minutes to review the files included in the **Programmability 201: Building Apps application**. Some data and pre-work have been added to assist you as you complete the workshop, but you will notice that this application is missing a Nerdpack.

To complete **Step 0** do the following steps:
1. Review the files in the `./building-apps` directory
    - README.md
    - INSTRUCTIONS.md
    - RESOURCES.md
    - WALKTHROUGH.md (Cheat Codes)
2. Create a Nerdpack using the NR1 CLI
3. Update your application UUID
4. Serve your Nerdpack and view your application in [New Relic One](https://one.newrelic.com/?nerdpacks=local)

Your application should look similar to this:

![New Nerdpack]()



## STEP 1: Building with New Relic Components
---
---

After **Step 0**, you have a running New Relic One application that will contain all of your code while completing the workshop. In this next step, you will be importing components from the `nr1` library to create the `TableChart` and `TextField`. And, using the application state to allow users to update the `TableChart` with the country of their choice.

To complete **Step 1** do the following steps:
1. Import the `Grid`, `GridItem`, `TableChart`, and `TextField` components into your application from the `nr1` library
2. Create layout using `Grid` and `GridItem`
3. Use the following query in your TableChart: "`FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' ${countryCode ? ` WHERE countryCode like '%${countryCode}%' ` : ''} FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000`"
4. In the `contructor`, store the country code into application state: `this.state = { countryCode: null }`
5. Update the country code when a user types in the text field: `onChange={(e) => { this.setState({ countryCode: e.target.value }); }}`

Your application should look similar to this:

![Nerdlet with TableChart]()


## Step 2: More Data. More Packages.
---
---

After completing **Step 1**, your application now has a working `TableChart` controlled by the user input into the `TextField`. In this final section, you will be using `NerdGraph`, adding additional data into your application and then installing a third-party package called react-leaflet to create the interactive map. Some helper methods have been created to assist you in completing this last step of the workshop.

To complete **Step 2** do the following steps:
1. NPM install **leaflet** and **react-leaflet** packages: `npm install --save leaflet react-leaflet`
2. Import the leaflet css into you **Nerdlet** './nerdlets/YOUR_NERDLET_NAME/styles.scss' file:
    ```css
    @import '~leaflet/dist/leaflet.css';

    .containerMap {
    width: 98.5vw;
    z-index: 0;
    height: 70vh;
    }
    ```
3. Import components from **react-leaflet**: `import { Map, CircleMarker, TileLayer } from 'react-leaflet';`
4. Import and use `NerdGraphQuery` to query the data needed build the map
    - Import `NerdGrpahQuery` from `nr1`
    - Import `mapData` and `getMarkerColor` from './helpers' into your Nerdlets index.js file
        - Use the `mapData` function to get your NerdGraph query. Passing the function the **countryCode** stored to the application state.
    - Use the `Map`, `CircleMarker`, `TileLayer` components to create a map in the return statement of the `NerdGraphQuery` component.
        - Set the `Map` component props:
            - defaultCenter: `this.defaultMapCenter = [10.5731, -7.5898];`
            - className: `containerMap`
        - Map the query results returned from `NerdGraph`
            - Return a `CircleMarker` for each result
            - Use the `getMarkerColor` function to provide colors to the `CircleMarker` component