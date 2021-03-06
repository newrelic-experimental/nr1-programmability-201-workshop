# Programmability 201: Building Applications
---

## Workshop Agenda

During this 90-minute session you will be building the following New Relic Application. The ap uses browser data to display the number of sessions and average duration by the users country and region. If a country code is enter into the `TextField`, the application will update displaying data just for the provided country.

Each step is created to allow you to practice building a complete New Relic Application, while providing helpful hints, code snippets, and resources through the the developement process.

- Find additional resources in the RESOURCES.md
- If stuck, see the full walkthrough in WALKTHROUGH.md

At the end of the Programmability 201 workshop, your final application will look similar to below:

![Finished app](https://github.com/newrelic-experimental/nr1-programmability-201-workshop/blob/master/screenshots/complete-application.png)


### Agenda
- STEP 0: Getting Started [10 min]
- STEP 1: Buildng with New Relic Components [25 min]
- Step 2: More Data. More Packages. [40 min]


## STEP 0: Getting Started
---
---

Step 0 is all about getting started. Take a few minutes to review the files included in the **Programmability 201: Building Apps application**. Some data and pre-work have been added to assist you as you complete the workshop, but you will notice that this application is missing a Nerdpack.

To complete **Step 0**, perform the following steps:

1. Review the files in the root directory
    - README.md
    - INSTRUCTIONS.md
    - RESOURCES.md
    - WALKTHROUGH.md (Cheat Codes)
2. Create a Nerdlet using the [NR1 CLI](https://developer.newrelic.com/explore-docs/nr1-cli)
3. Create a launcher using the [NR1 CLI](https://developer.newrelic.com/explore-docs/nr1-cli)
4. [Connect your launcher to the new Nerdlet](https://developer.newrelic.com/explore-docs/nerdpack-file-structure)
5. Update your application UUID
6. Serve your Nerdpack and view your application in [New Relic One](https://one.newrelic.com/?nerdpacks=local)

Your application should look similar to this:

![New Nerdpack](https://github.com/newrelic-experimental/nr1-programmability-201-workshop/blob/master/screenshots/step-0-complete.png?raw=true)



## STEP 1: Building with New Relic Components
---
---

After **Step 0**, you have a running New Relic One application that will contain all of your code while completing the workshop. In this next step, you will be importing components from the `nr1` library to create the [`TableChart`](https://developer.newrelic.com/components/table-chart) and [`TextField`](https://developer.newrelic.com/components/text-field). And, using the application state to allow users to update the [`TableChart`](https://developer.newrelic.com/components/table-chart) with the country of their choice.

To complete **Step 1** do the following steps:
1. Import the [`Grid`](https://developer.newrelic.com/components/grid), [`GridItem`](https://developer.newrelic.com/components/grid-item), [`TableChart`](https://developer.newrelic.com/components/table-chart), and `TextField` components into your application from the `nr1` library
2. Create layout using [`Grid`](https://developer.newrelic.com/components/grid) and [`GridItem`](https://developer.newrelic.com/components/grid-item)
3. Use the following query in your TableChart: "`FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' ${countryCode ? ` WHERE countryCode like '%${countryCode}%' ` : ''} FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000`"
4. In the `constructor`, store the country code into application state: `this.state = { countryCode: null }`
5. Update the country code when a user types in the text field: `onChange={(e) => { this.setState({ countryCode: e.target.value }); }}`

Your application should look similar to this:

![Nerdlet with TableChart](https://github.com/newrelic-experimental/nr1-programmability-201-workshop/blob/master/screenshots/step-1-complete.png?raw=true)


## Step 2: More Data. More Packages.
---
---

After completing **Step 1**, your application now has a working [`TableChart`](https://developer.newrelic.com/components/table-chart) controlled by the user input into the [`TextField`](https://developer.newrelic.com/components/text-field). In this final section, you will be using the [`NerdGraphQuery`](https://developer.newrelic.com/components/nerd-graph-query) component, adding additional data into your application and then installing a third-party package called react-leaflet to create the interactive map. Some helper methods have been created to assist you in completing this last step of the workshop.

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
3. Import components from [**react-leaflet**](https://react-leaflet.js.org/): `import { Map, CircleMarker, TileLayer } from 'react-leaflet';`
4. Import and use [`NerdGraphQuery`](https://developer.newrelic.com/components/nerd-graph-query) to query the data needed build the map
    - Import [`NerdGraphQuery`](https://developer.newrelic.com/components/nerd-graph-query) from `nr1`
    - Import `mapData` and `getMarkerColor` from './helpers' into your Nerdlets index.js file
        - Use the `mapData` function to get your NerdGraph query. Passing the function the **countryCode** stored to the application state.
    - Use the [`Map`](https://react-leaflet.js.org/docs/en/components#map), [`CircleMarker`](https://react-leaflet.js.org/docs/en/components#circlemarker), `TileLayer` components to create a map in the return statement of the [`NerdGraphQuery`](https://developer.newrelic.com/components/nerd-graph-query) component.
        - Set the [`Map`](https://react-leaflet.js.org/docs/en/components#map) component props:
            - defaultCenter: `this.defaultMapCenter = [10.5731, -7.5898];`
            - className: `containerMap`
        - Map the query results returned from [`NerdGraph`](https://developer.newrelic.com/collect-data/get-started-nerdgraph-api-explorer)
            - Return a [`CircleMarker`](https://react-leaflet.js.org/docs/en/components#circlemarker) for each result
            - Use the `getMarkerColor` function to provide colors to the [`CircleMarker`](https://react-leaflet.js.org/docs/en/components#circlemarker) component


Your application should look similar to below:

![Step 2 complete](https://github.com/newrelic-experimental/nr1-programmability-201-workshop/blob/master/screenshots/step-2-complete.png?raw=true)


## Recap
---
---

After completing all steps for the Programmability workshop, you've successfully created a New Relic application using chart components, NerdGraph, and third-party packages. To explore more of what's possible building applications on New Relic, review our [open source applications](https://opensource.newrelic.com/nerdpacks) and complete the open-source programmability workshop in [GitHub](https://github.com/newrelic/nr1-workshop).
