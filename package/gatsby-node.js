const axios = require('axios')

// Throw an error early if the API key is missing
// Gatsby provides an API for that, too: https://www.gatsbyjs.com/docs/configuring-usage-with-plugin-options/

exports.pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    key: Joi.string().required().messages({
      'any.required': `"key" is required. Please provide an API key for https://www.potterapi.com/

You can obtain this by signing up for an account here: https://www.potterapi.com/login/

We'd also recommend to place the API key in an .env file with API_KEY=your-key
To learn more on how to use environment variables, head over to the docs: https://www.gatsbyjs.com/docs/environment-variables/
`,
    }),
  })

// Create the Schema Types with Gatsby's schema customization API
// https://www.gatsbyjs.org/docs/schema-customization/
// This allows the schema to be explicitly typed and also easy foreign-key relationships

// For the foreign-key relationship go here:
// https://www.gatsbyjs.org/docs/schema-customization/#foreign-key-fields
// The API for "HarryPotterHouse" normally retunrs for "members" an array of "_id"
// Therefore it should be linked by "_id"

// The API returns for "house" the name, therefore it needs to be linked by that

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type HarryPotterHouse implements Node {
      _id: String
      colors: [String]
      founder: String
      headOfHouse: String
      houseGhost: String
      mascot: String
      members: [HarryPotterCharacter] @link(by: "_id")
      name: String
      school: String
      values: [String]
    }
    
    type HarryPotterCharacter implements Node {
      _id: String
      alias: String
      animagus: String
      bloodStatus: String
      boggart: String
      deathEater: Boolean
      dumbledoresArmy: Boolean
      house: HarryPotterHouse @link(by: "name")
      ministryOfMagic: Boolean
      name: String
      orderOfThePhoenix: Boolean
      patronus: String
      role: String
      school: String
      species: String
      wand: String
    }
    
    type HarryPotterSpell implements Node {
      _id: String
      effect: String
      spell: String
      type: String
    }
    
    type HarryPotterSortingHat implements Node {
      house: String
    }
  `)
}

// The first param are the functions passed through Gatsby, the second param is the "pluginOptions"
// Both params get destructured instantly, you get "key" from the pluginOpions for example

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }, { key }) => {
  const { createNode } = actions

  const axiosClient = axios.create({
    baseURL: 'https://www.potterapi.com/v1/',
  })

  const nodeMeta = ({ node, name }) => ({
    id: createNodeId(`potterapi-${node._id}`), // Unique identifier for the nodes. You can also search for that (see getID)
    parent: null,
    children: [],
    internal: {
      type: `HarryPotter${name}`, // Use the name defined in above schema types
      content: JSON.stringify(node),
      contentDigest: createContentDigest(node),
    },
  })

  // Catch any errors with a try/catch block

  try {
    // Since this function is async you have to "await" the responses from the API
    // axios delivers the results in response: { data, other_stuff }
    // So you want to immediately destructure and only get "data"
    // Furthermore every "data" get aliased

    const { data: houses } = await axiosClient.get(`/houses?key=${key}`)
    const { data: characters } = await axiosClient.get(`/characters?key=${key}`)
    const { data: spells } = await axiosClient.get(`/spells?key=${key}`)
    const { data: sortingHat } = await axiosClient.get(`/sortingHat`)

    // The API response is an array of objects
    // Loop over this array. The individual item (object) is the node then
    // So in the first example "house" is the individual object

    houses.forEach((house) => {
      const node = { ...house, ...nodeMeta({ node: house, name: 'House' }) }

      createNode(node)
    })

    characters.forEach((character) => {
      const node = { ...character, ...nodeMeta({ node: character, name: 'Character' }) }

      createNode(node)
    })

    spells.forEach((spell) => {
      const node = { ...spell, ...nodeMeta({ node: spell, name: 'Spell' }) }

      createNode(node)
    })

    const sortingNode = {
      house: sortingHat,
      id: createNodeId(`potterapi-${sortingHat}`),
      parent: null,
      children: [],
      internal: {
        type: `HarryPotterSortingHat`,
        content: JSON.stringify(sortingHat),
        contentDigest: createContentDigest(sortingHat),
      },
    }
    createNode(sortingNode)
  } catch (e) {
    reporter.panicOnBuild(`An error occured in gatsby-source-potterapi.`, e)
  }
}
