require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-potterapi',
      options: {
        key: process.env.KEY,
      }
    },
    'gatsby-plugin-netlify',
  ]
}