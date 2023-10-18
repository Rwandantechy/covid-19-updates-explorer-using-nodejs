// Import required modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// Set up the app
app.use(morgan('dev'));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
const axios = require('axios');
app.use(express.urlencoded({ extended: false }));

// Fetch data from the API
async function fetchData() {
  try {
    const response = await axios.get('https://disease.sh/v3/covid-19/countries');
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data from the API:', error);
    throw error; 
  }
}
// Render the home page
app.get('/', async (req, res) => {
    try {
      const data = await fetchData(); 
      res.render('home', { data }); 
    } catch (error) {
      res.status(500).send('Error fetching real-time data.');
    }
  });

 // form submission route
 app.post('/country', (req, res) => {
    const selectedCountry = req.body.selectedCountry;
  
    // Redirect to the country details page
    res.redirect(`/${selectedCountry}`);
  });
  
  // Render the country details page
    app.get('/:country', async (req, res) => {
        const  chosenCountry = req.params.country;
    
        try {
        const response = await axios.get(`https://disease.sh/v3/covid-19/countries/${chosenCountry}`);
        const country = response.data;
    
        // Render the "country-details" page with the country data
        res.render('country', { country});
        } catch (error) {
        res.status(500).send('Error fetching real-time data.');
        }
    });
 
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
