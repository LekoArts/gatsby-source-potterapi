const axios = require('axios')

// The first param are the functions passed through Gatsby, the second param is the "pluginOptions"
// Both params get destructured instantly, you get "key" from the pluginOpions for example

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, { key }) => {
  const { createNode } = actions

  // Throw an error early if the API key is missing
  if (!key) {
    throw new Error('Please define an API key')
  }

  const axiosClient = axios.create({
    baseURL: 'https://www.potterapi.com/v1/',
  })

  // Helper function
  //
  // The API returns a unique ID for every item under the "_id" property
  // This is nice as "id" is a reserved word in Gatsby (see nodeMeta)
  // If it would be "id" you'd want to manually set "id" to "_id" to circumvent this issue
  //
  // The purpose of this helper function is to get the node with the desired "id"
  // For that the function generates with "createNodeId" in the same way as in "nodeMeta" the "id"

  const getID = node => (node ? createNodeId(`potterapi-${node._id}`) : null)

  const nodeMeta = ({ node, name }) => ({
    id: createNodeId(`potterapi-${node._id}`), // Unique identifier for the nodes. You can also search for that (see getID)
    parent: null,
    children: [],
    internal: {
      type: `HarryPotter${name}`, // Defines the name your query by, e.g. HarryPotterHouses
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

    houses.forEach(house => {
      const node = Object.assign({}, house, nodeMeta({ node: house, name: 'House' }))

      createNode(node)
    })

    characters.forEach(character => {
      // Characters go to different houses (Gryffindor etc.)
      // The API gives back for "character.house" : 'Gryffindor'
      // But that's only the name. If you want to get more data about a house while querying for characters
      // you can't get that
      //
      // Unless you replace the "house___NODE" with your own content
      // "house___NODE" would be created with the "character.house" key automatically, here you overwrite it
      // The node should have the "id" of the specific house created in the "houses.forEach" loop
      // In that loop the 'Gryffindor' house was created with the "id" (of nodeMeta). Now you search for that
      // The search itself is: Find the house with the same name as "character.house"

      character.house___NODE = getID(houses.find(h => h.name === character.house))

      const node = Object.assign({}, character, nodeMeta({ node: character, name: 'Character' }))

      createNode(node)
    })

    spells.forEach(spell => {
      const node = Object.assign({}, spell, nodeMeta({ node: spell, name: 'Spell' }))

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
    console.error(e)
    process.exit(1)
  }
}
