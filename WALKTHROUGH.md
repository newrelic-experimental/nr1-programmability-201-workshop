# INSTRUCTIONS

- Create a new nerdpack and serve it locally
- Open chart builder and run the following query

```sql
FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000
```

<!-- accountId is 1606862 -->

- Add a TableChart to the Nerdlet

```js
<div className="container">
  <div className="row">
    <TableChart accountId={accountId} query={`FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000`} fullWidth className="chart" />
  </div>
</div>
```

- Add the following styles

```css
.container {
  width: 100%;
  height: 99vh;
  display: flex;
  flex-direction: column;
  .row {
    margin: 10px;
    display: flex;
    flex-direction: row;
  }
  .chart {
    height: 250px;
  }
}
```

- Add a TextField

```js
<div className="row">
  <TextField placeholder="US" onChange={(e) => { this.setState({ countryCode: e.target.value })}} />
</div>
```

```js
import React from 'react';
import { TableChart, TextField } from 'nr1';

const accountId = 1606862;

export default class FreeDowntown extends React.Component {
    constructor(props) {
        super(props);
        this.state = { countryCode: null }
    }
    render() {
        const { countryCode } = this.state;
        return <div className="container">
            <div className="row">
              <TextField placeholder="US" onChange={(e) => {
                this.setState({ countryCode: e.target.value });
                }} />
            </div>
            <div className="row">
              <TableChart accountId={accountId} query={`FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' ${countryCode ? ` WHERE countryCode like '%${countryCode}%' ` : ''} FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000`} fullWidth className="chart" />
            </div>
        </div>
    }
}
```

- Go back to Chart Builder with this query

```sql
SELECT count(*), average(duration), sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView FACET regionCode, countryCode WHERE appName = 'WebPortal' LIMIT 1000
```

- import the following

```js
import { TableChart, TextField, NerdGraphQuery, Spinner, Button, BlockText } from 'nr1';
```

- Add the following methods

```js
    getMarkerColor(measure, apdexTarget = 1.7) {
        if (measure <= apdexTarget) {
          return '#11A600';
        } else if (measure >= apdexTarget && measure <= apdexTarget * 4) {
          return '#FFD966';
        } else {
          return '#BF0016';
        }
    };

    mapData() {
        const { countryCode } = this.state;
        const query = `{
          actor {
            account(id: 1966971) {
              mapData: nrql(query: "SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView FACET regionCode, countryCode WHERE appName = 'WebPortal' ${countryCode ? ` WHERE countryCode like '%${countryCode}%' ` : ''} LIMIT 1000 ") {
                results
                nrql
              }
            }
          }
        }`;
        // console.debug(query);
        return query;
    };
```

- Add default center
const defaultMapCenter = [10.5731, -7.5898]

```js
import React from 'react';
import { TableChart, TextField, NerdGraphQuery, Spinner, Button, BlockText } from 'nr1';


const defaultMapCenter = [10.5731, -7.5898]

export default class NyNerdlet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countryCode: null
        }
    }

    render() {
        const accountId = 1966971;
        return <div className="container">
            <div className="row">
                <TextField placeholder="US" onChange={(e) => { this.setState({ countryCode: e.target.value })}} />
            </div>
            <div className="row">
                <NerdGraphQuery query={this.mapData()}>
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
            </div>
            <div className="row">
            <TableChart accountId={accountId} query={`FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' ${countryCode ? ` WHERE countryCode like '%${countryCode}%' ` : ''} FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000`} fullWidth className="chart" />
            </div>
        </div>
    }
}
```

Now we're going to do an...

```bash
npm install --save leaflet react-leaflet
```

Add to the styles.scss

```css
@import '~leaflet/dist/leaflet.css';

.containerMap {
  width: 100%;
  z-index: 0;
  height: 70vh;
}
```

- copy

```bash
cp ../../newrelic_forks/nr1-pageview-map/.extended-webpackrc.js .
```

```js
import { Map, CircleMarker, TileLayer } from 'react-leaflet';


                  <div>
                    <NerdGraphQuery query={this.mapData()}>
                      {({ loading, error, data }) => {
                        if (loading) {
                          return <Spinner fillContainer />;
                        }

                        if (error) {
                          return "Error!!";
                        }
                        const { results } = data.actor.account.mapData;
                        return <Map
                        className="containerMap"
                        center={defaultMapCenter}
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
                              color={this.getMarkerColor(pt.y)}
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
                </div>
```

## Final Application File

```js
import React from 'react';
import { TableChart, TextField, NerdGraphQuery, Spinner, Button, BlockText } from 'nr1';
import { Map, CircleMarker, TileLayer } from 'react-leaflet';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

const accountId = 1606862;
const defaultMapCenter = [10.5731, -7.5898]

export default class FreeDowntown extends React.Component {
    constructor(props) {
        super(props);
        this.state = { countryCode: null }
    }
    getMarkerColor(measure, apdexTarget = 1.7) {
        if (measure <= apdexTarget) {
          return '#11A600';
        } else if (measure >= apdexTarget && measure <= apdexTarget * 4) {
          return '#FFD966';
        } else {
          return '#BF0016';
        }
    };
    mapData() {
        const { countryCode } = this.state;
        const query = `{
          actor {
            account(id: 1606862) {
              mapData: nrql(query: "SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView FACET regionCode, countryCode WHERE appName = 'WebPortal' ${countryCode ? ` WHERE countryCode like '%${countryCode}%' ` : ''} LIMIT 1000 ") {
                results
                nrql
              }
            }
          }
        }`;
        // console.debug(query);
        return query;
    };
    render() {
        const { countryCode } = this.state;
        return <div className="container">
            <div className="row">
                <TextField placeholder="US" onChange={(e) => { this.setState({ countryCode: e.target.value })}} />
            </div>
            <div className="row">
                <NerdGraphQuery query={this.mapData()}>
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
                    center={defaultMapCenter}
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
                          color={this.getMarkerColor(pt.y)}
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
            </div>
            <div className="row">
                <TableChart accountId={accountId} query={`FROM PageView SELECT count(*), average(duration) WHERE appName = 'WebPortal' ${countryCode ? ` WHERE countryCode like '%${countryCode}%' ` : ''} FACET countryCode, regionCode SINCE 1 week ago LIMIT 1000`} fullWidth className="chart" />
            </div>
        </div>
    }
}
```