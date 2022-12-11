const express = require('express')
const axios = require('axios')

const app = express()

// outdoortemp - temp zewnętrzna rzeczywista
// curflowtemp - temp rzeczywista kotla
// selflowtemp - temp zadana kotła
// heatingtemp - maks temp wyłączania
// heatingpumpmod - pompa kotła %
// switchtemp - temp sprzęgła
// burnstarts - starty palnika
// burnworkmin - min pracy palnika
// ubauptime - min pracy instalacji
// flamecurr - prąd jonizacjia uA
// curburnpow - moc rzeczywista palinika %
// wwcurtemp - temp przeczwyista cwu
// mixer/flowsettemp - temp zasilania zadana
// mixer/flowtemphc - temp zazukabua rzeczywista
// mixer/valvestatus - pozycja zaworu mieszającego
// thermostat/dampedoutdoortemp - temp zewnętrzna tłumiona



const defaultDisplayedMetrics = [
    'outdoortemp',
    'dampedoutdoortemp',
    'curflowtemp',
    'selflowtemp',
    'switchtemp',
    'heatingtemp',
    'heatingpumpmod',
    'switchtemp',
    'burnstarts',
    'burnworkmin',
    'flamecurr',
    'curburnpow',
    'wwcurtemp',
    'flowsettemp',
    'flowtemphc',
    'valvestatus']

const port = process.env.PORT ?? 80
const emsEspIp = process.env.EMS_ESP_IP ?? 'localhost'
const displayedMetrics = process.env.METRICS_NAMES_CSV?.split(',') ?? defaultDisplayedMetrics

console.log(`emsEspIp = ${emsEspIp}`)
console.log(`displayedMetrics =`, displayedMetrics)

app.get('/metrics', async (req, res) => {
    const boilerPromise = getDeviceMetrics('boiler')
    const mixerPromise = getDeviceMetrics('mixer/hc1')
    const thermostatPromise = getDeviceMetrics('thermostat')

    const metrics = await Promise.all([boilerPromise, mixerPromise, thermostatPromise])

    res.set('Content-Type', 'text/plain')
    res.send(metrics.join('\n'))
})

async function getDeviceMetrics(device) {
    const {data} = await axios.get(`http://${emsEspIp}/api/${device}/`)

    return  Object.entries(data)
        .filter(([propName]) => {
            return displayedMetrics.includes(propName)
        })
        .map(([propName, propValue]) => {
            return `${propName}{device="${device}"} ${propValue}`
        })
        .join('\n');
}


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})