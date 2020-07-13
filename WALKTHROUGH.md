# Programmability 201: Building Applications: Cheat Codes

## Step Zero

- Create a new Nerdlet and new Launcher: `nr1 create`
  - Connect the launcher using the `nr1.json` files

## Step One

- Create your `Grid` in the application return statement

```js
return (
  <Grid>
    // GridItems go here...
  <Grid>
)
```

- Open chart builder and run the following query

```sql
FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000
```

- Add constructor in react class

```js
constructor(props) {
    super(props);
    this.state = { countryCode: null }
}
```

- Add a TableChart to the Nerdlet

```js
<GridItem columnSpan={12}>
  <TableChart accountId={accountId} query={`FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000`} fullWidth />
</GridItem>
```

- Add a TextField

```js
<GridItem columnSpan={12}>
  <TextField placeholder="US" onChange={(e) => { this.setState({ countryCode: e.target.value })}} />
</GridItem>
```

### Step One Complete

```js
import React from 'react';
import { Grid, GridItem, TableChart, TextField } from 'nr1';

export default class SampleAppNerdletNerdlet extends React.Component {
    constructor(props) {
        super(props);
        this.state = { countryCode: null }
        this.accountId = <YOUR_ACCOUNT_ID>; //1966971
    }
    render() {
        const { countryCode } = this.state;
        return <Grid>
            <GridItem columnSpan={12}>
              <TextField placeholder="US" onChange={(e) => {
                this.setState({ countryCode: e.target.value });
                }} />
            </GridItem>
            <GridItem columnSpan={12}>
              <TableChart accountId={this.accountId} query={`FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' ${countryCode ? ` WHERE countryCode like '%${countryCode}%' ` : ''} FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000`} fullWidth />
            </GridItem>
        </Grid>
    }
}

```

## Step Two

Now we're going to do an...

```bash
npm install --save leaflet react-leaflet
```

- Add to the styles.scss

```css
@import '~leaflet/dist/leaflet.css';

.containerMap {
  width: 98.5vw;
  z-index: 0;
  height: 70vh;
}
```

- Update your import statements adding the following

```js
import { Grid, GridItem, TableChart, TextField, NerdGraphQuery, Spinner } from 'nr1';
import { Map, CircleMarker, TileLayer } from 'react-leaflet';
import { mapData, getMarkerColor } from '../../helpers'
```

- Go back to Chart Builder with this query

```sql
SELECT count(*), average(duration), sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView FACET regionCode, countryCode WHERE appName = 'WebPortal' LIMIT 1000
```

- Add default center to the constructor

```js
this.defaultMapCenter = [10.5731, -7.5898]
```

- Add new GridItem with NerdGraphQuery component

```js
<GridItem>
  <NerdGraphQuery query={mapData(countryCode)}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner fillContainer />;
        }

        if (error) {
          return "Error!!";
        }
        const { results } = data.actor.account.mapData;
        console.debug(results);
        return "Map Data";
        }}
    </NerdGraphQuery>
</GridItem>
```

- Create Map using react-leaf component inside of NerdGraph component

```js
<GridItem>
    <NerdGraphQuery query={mapData(countryCode)}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner fillContainer />;
        }

        if (error) {
          return "Error!!";
        }

        const { results } = data.actor.account.mapData;
        console.debug(results);

        return <Map
        className="containerMap"
        center={this.defaultMapCenter}
        zoom={2}
        zoomControl>
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
                {results.map((pt, i) => {
                const center = [pt.lat, pt.lng];
                return (
                    <CircleMarker
                    key={`circle-${i}`}
                    center={center}
                    color={getMarkerColor(pt.y)}
                    radius={Math.log(pt.x) * 3}
                    onClick={() => {
                        alert(JSON.stringify(pt));
                    }}
                    />
                );
                })}
          </Map>
        }}
    </NerdGraphQuery>
</GridItem>
```

## Final Application File

```js
import React from 'react';
import { Grid, GridItem, TableChart, TextField, NerdGraphQuery, Spinner } from 'nr1';
import { Map, CircleMarker, TileLayer } from 'react-leaflet';
import { mapData, getMarkerColor } from '../../helpers'

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class SampleAppNerdletNerdlet extends React.Component {
    constructor(props) {
        super(props);
        this.state = { countryCode: null }
        this.defaultMapCenter = [10.5731, -7.5898];
        this.accountId = 1966971;
    }
    render() {
        const { countryCode } = this.state;
        return <Grid>
            <GridItem columnSpan={12}>
              <TextField placeholder="US" onChange={(e) => {
                this.setState({ countryCode: e.target.value });
                }} />
            </GridItem>
            <GridItem>
                <NerdGraphQuery query={mapData(countryCode)}>
                  {({ loading, error, data }) => {
                    if (loading) {
                      return <Spinner fillContainer />;
                    }

                    if (error) {
                      return "Error!!";
                    }

                    const { results } = data.actor.account.mapData;
                    console.debug(results);

                    return <Map
                    className="containerMap"
                    center={this.defaultMapCenter}
                    zoom={2}
                    zoomControl>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                            {results.map((pt, i) => {
                            const center = [pt.lat, pt.lng];
                            return (
                                <CircleMarker
                                key={`circle-${i}`}
                                center={center}
                                color={getMarkerColor(pt.y)}
                                radius={Math.log(pt.x) * 3}
                                onClick={() => {
                                    alert(JSON.stringify(pt));
                                }}
                                />
                            );
                            })}
                      </Map>
                    }}
                </NerdGraphQuery>
            </GridItem>
            <GridItem columnSpan={12}>
              <TableChart accountId={this.accountId} query={`FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' ${countryCode ? ` WHERE countryCode like '%${countryCode}%' ` : ''} FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000`} fullWidth />
            </GridItem>
        </Grid>
    }
}
```