const axios = require('axios')

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, { key }) => {
  const { createNode } = actions

  if (!key) {
    throw new Error('Please define an API key')
  }

  const axiosClient = axios.create({
    baseURL: 'https://www.potterapi.com/v1/'
  })

  const getID = node => (node ? createNodeId(`potterapi-${node._id}`) : null)

  const nodeMeta = ({ node, name }) => ({
    id: createNodeId(`potterapi-${node._id}`),
    parent: null,
    children: [],
    internal: {
      type: `HarryPotter${name}`,
      content: JSON.stringify(node),
      contentDigest: createContentDigest(node)
    }
  })

  try {
    const { data: houses } = await axiosClient.get(`/houses?key=${key}`)
    const { data: characters } = await axiosClient.get(`/characters?key=${key}`)
    const { data: spells } = await axiosClient.get(`/spells?key=${key}`)

    houses.forEach(house => {
      const node = Object.assign({}, house, nodeMeta({ node: house, name: 'House' }))

      createNode(node)
    })

    characters.forEach(character => {
      character['house___NODE'] = getID(houses.find(h => h.name === character.house))

      const node = Object.assign({}, character, nodeMeta({ node: character, name: 'Character' }))

      createNode(node)
    })

    spells.forEach(spell => {
      const node = Object.assign({}, spell, nodeMeta({ node: spell, name: 'Spell' }))

      createNode(node)
    })

  } catch(e) {
    console.error(e)
    process.exit(1)
  }
}