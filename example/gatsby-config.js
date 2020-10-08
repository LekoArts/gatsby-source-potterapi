require('dotenv').config({
  path: `.env`,
})

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-potterapi',
      options: {},
    },
    'gatsby-plugin-netlify',
  ],
}
