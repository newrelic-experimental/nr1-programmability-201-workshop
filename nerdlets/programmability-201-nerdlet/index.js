import React from 'react';
import { TableChart, TextField, NerdGraphQuery, Spinner, Button, BlockText } from 'nr1';
import { Map, CircleMarker, TileLayer } from 'react-leaflet';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

const accountId = 1606862;
const defaultMapCenter = [10.5731, -7.5898]

export default class ExampleApp1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countryCode: null
        }
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
                <TextField placeholder="US" onChange={(event) => {
                    this.setState({ countryCode: event.target.value });
                }} />
            </div>
            <div className="row">
                <NerdGraphQuery query={this.mapData()}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            return <Spinner fillContainer />
                        }
                        if (error) {
                            return "Error";
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
