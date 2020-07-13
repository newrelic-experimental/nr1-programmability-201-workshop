export const mapData = function(countryCode) {
    //by default leveraging the demotron sandbox account: 1966971
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
    return query;
};

export const getMarkerColor = function(measure, apdexTarget = 1.7) {
    if (measure <= apdexTarget) {
        return '#11A600';
    } else if (measure >= apdexTarget && measure <= apdexTarget * 4) {
        return '#FFD966';
    } else {
        return '#BF0016';
    }
};