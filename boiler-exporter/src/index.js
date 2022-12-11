const express = require('express')
const axios = require('axios')

const app = express()
const port = 80

app.get('/metrics', async (req, res) => {
    const response = await axios.get('http://192.168.10.56/api/boiler/')
    const metrics = Object.entries(response.data)
        .map(([propName, propValue]) => {
            return `${propName} "${propValue}"`
        })
        .join('\n');

    res.set('Content-Type', 'text/plain')
    res.send(metrics)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})