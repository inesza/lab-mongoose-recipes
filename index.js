const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://127.0.0.1/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()

  })
  .then(async () => {
    try {
      // Create one recipe
      const ramen = await Recipe.create({
        title: 'Tonkotsu ramen',
        level: 'Amateur Chef',
        ingredients: ['Tonkotsu broth', 'Ramen noodles', 'Marinated egg', 'Bamboo shoots', 'Nori'],
        cuisine: 'Japanese',
        dishType: 'main_course',
        image: './assets/ramen.jpg',
        duration: 180,
        creator: 'Ines',
      })
      console.log(ramen.title)

      // Insert multiple recipe from json file
      const recipeArray = require('./data.json')
      await Recipe.insertMany(recipeArray)
      const recipeTitles = await Recipe.find({}, { title: 1, _id: 0 })
      console.log(recipeTitles)

      // Update recipe
      const rigatoni = await Recipe.findOneAndUpdate(
        { title: 'Rigatoni alla Genovese' },
        { duration: 100 }
      )
      console.log(`Rigatoni duration updated`)

      // Remove recipe
      await Recipe.findOneAndDelete({ title: 'Carrot Cake' })
      console.log(`Carrot cake deleted from base`)
    } catch (error) {
      console.error(error)
    } finally {
      // Disconnect
      mongoose.disconnect()
    }
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
