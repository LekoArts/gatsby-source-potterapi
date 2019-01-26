import React, { Component } from 'react'
import { graphql } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faHeading, faGhost, faHatWizard } from '@fortawesome/free-solid-svg-icons'
import Helmet from 'react-helmet'
import matchSorter from 'match-sorter'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import '../styles/normalize.css'
import '../styles/index.css'
import themes from '../styles/themes'

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default class Index extends Component {
  state = {
    selectedOption: 'gryffindor',
  }

  handleOptionChange = e => {
    this.setState({
      selectedOption: e.target.value,
    })
  }

  render() {
    const { data } = this.props
    const { selectedOption } = this.state

    const spellsDuplicates = data.spells.edges
    const houses = data.houses.edges
    const charsNotNormalized = data.chars.edges

    const spellsUnique = spellsDuplicates.reduce((unique, o) => {
      if (!unique.some(obj => obj.node.spell === o.node.spell)) {
        unique.push(o)
      }
      return unique
    }, [])

    const spells = spellsUnique.map(({ node }) => ({ ...node }))
    const chars = charsNotNormalized.map(({ node }) => ({ ...node }))

    const pageSizeOptions = [10, 20, 50, 100]

    const spellsColumns = [
      {
        Header: 'Spell',
        accessor: 'spell',
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['spell'] }),
        filterAll: true,
      },
      {
        Header: 'Type',
        accessor: 'type',
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true
          }
          if (filter.value === 'Charm') {
            return row[filter.id] === 'Charm'
          }
          if (filter.value === 'Curse') {
            return row[filter.id] === 'Curse'
          }
          if (filter.value === 'Enchantment') {
            return row[filter.id] === 'Enchantment'
          }
          if (filter.value === 'Hex') {
            return row[filter.id] === 'Hex'
          }
          if (filter.value === 'Jinx') {
            return row[filter.id] === 'Jinx'
          }
          if (filter.value === 'Spell') {
            return row[filter.id] === 'Spell'
          }
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            <option value="all">Show All</option>
            <option value="Charm">Charm</option>
            <option value="Curse">Curse</option>
            <option value="Enchantment">Enchantment</option>
            <option value="Hex">Hex</option>
            <option value="Jinx">Jinx</option>
            <option value="Spell">Spell</option>
          </select>
        ),
      },
      {
        Header: 'Effect',
        accessor: 'effect',
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['effect'] }),
        filterAll: true,
      },
    ]

    const charsColumns = [
      {
        Header: 'Name',
        accessor: 'name',
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['name'] }),
        filterAll: true,
      },
      {
        Header: 'Role',
        accessor: 'role',
        Cell: ({ value }) => (value === null ? '' : (value === 'student' ? 'Student' : value)),
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['role'] }),
        filterAll: true,
      },
      {
        Header: 'House',
        id: 'house',
        accessor: 'house.name',
        width: 120,
        Cell: ({ value }) => (value === null ? '' : value),
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true
          }
          if (filter.value === 'Gryffindor') {
            return row[filter.id] === 'Gryffindor'
          }
          if (filter.value === 'Hufflepuff') {
            return row[filter.id] === 'Hufflepuff'
          }
          if (filter.value === 'Ravenclaw') {
            return row[filter.id] === 'Ravenclaw'
          }
          if (filter.value === 'Slytherin') {
            return row[filter.id] === 'Slytherin'
          }
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            <option value="all">All</option>
            <option value="Gryffindor">Gryffindor</option>
            <option value="Hufflepuff">Hufflepuff</option>
            <option value="Ravenclaw">Ravenclaw</option>
            <option value="Slytherin">Slytherin</option>
          </select>
        ),
      },
      {
        Header: 'Alias',
        accessor: 'alias',
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['alias'] }),
        filterAll: true,
        width: 200,
      },
      {
        Header: 'Patronus',
        accessor: 'patronus',
        Cell: ({ value }) => (value === null ? '' : capitalize(value)),
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['patronus'] }),
        filterAll: true,
        width: 160,
      },
      {
        Header: 'OotP',
        accessor: 'orderOfThePhoenix',
        width: 90,
        Cell: ({ value }) => (value === true ? 'Yes' : 'No'),
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true
          }
          if (filter.value === 'Yes') {
            return row[filter.id] === true
          }
          if (filter.value === 'No') {
            return row[filter.id] === false
          }
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            <option value="all">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        ),
      },
      {
        Header: 'DA',
        accessor: 'dumbledoresArmy',
        width: 80,
        Cell: ({ value }) => (value === true ? 'Yes' : 'No'),
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true
          }
          if (filter.value === 'Yes') {
            return row[filter.id] === true
          }
          if (filter.value === 'No') {
            return row[filter.id] === false
          }
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            <option value="all">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        ),
      },
      {
        Header: 'Death Eater',
        accessor: 'deathEater',
        width: 110,
        Cell: ({ value }) => (value === true ? 'Yes' : 'No'),
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true
          }
          if (filter.value === 'Yes') {
            return row[filter.id] === true
          }
          if (filter.value === 'No') {
            return row[filter.id] === false
          }
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            <option value="all">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        ),
      },
    ]

    return (
      <>
        <a
          href="https://github.com/LekoArts/gatsby-source-potterapi"
          className="github-corner"
          aria-label="View source on GitHub"
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 250 250"
            style={{
              fill: 'var(--one)',
              color: 'var(--two)',
              position: 'absolute',
              top: 0,
              border: 0,
              right: 0,
            }}
            aria-hidden="true"
          >
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
            <path
              d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor"
              style={{ transformOrigin: '130px 106px' }}
              className="octo-arm"
            />
            <path
              d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              fill="currentColor"
              className="octo-body"
            />
          </svg>
        </a>
        <Helmet>
          <html lang="en" />
          <title>Harry Potter API: Example | gatsby-source-potterapi</title>
          <style>
            {`
          :root {
            --one: ${themes[selectedOption].one};
            --two: ${themes[selectedOption].two};
            --grey: #323232;
            --grey-light: #e0e0e0;
            --bg: #f4f4f4;
            --black: #000;
          }
        `}
          </style>
        </Helmet>
        <div className="wrapper">
          <header>
            <h1>Harry Potter API: Example</h1>
            <form>
              <div className="theme-title">Theme:</div>
              <div className="radio-buttons">
                <div className="form-check">
                  <label>
                    <input
                      type="radio"
                      name="house-colors"
                      value="gryffindor"
                      checked={selectedOption === 'gryffindor'}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    />
                    Gryffindor
                  </label>
                </div>

                <div className="form-check">
                  <label>
                    <input
                      type="radio"
                      name="house-colors"
                      value="hufflepuff"
                      checked={selectedOption === 'hufflepuff'}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    />
                    Hufflepuff
                  </label>
                </div>

                <div className="form-check">
                  <label>
                    <input
                      type="radio"
                      name="house-colors"
                      value="ravenclaw"
                      checked={selectedOption === 'ravenclaw'}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    />
                    Ravenclaw
                  </label>
                </div>

                <div className="form-check">
                  <label>
                    <input
                      type="radio"
                      name="house-colors"
                      value="slytherin"
                      checked={selectedOption === 'slytherin'}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    />
                    Slytherin
                  </label>
                </div>
              </div>
            </form>
          </header>
          <main>
            <h2 id="houses">Houses</h2>
            <div className="grid">
              {houses.map(({ node: house }) => (
                <div className="grid-item" key={house._id}>
                  <h3>{house.name}</h3>
                  <h4>Information</h4>
                  <div className="grid-item__info">
                    <div className="grid-item__info__item">
                      <FontAwesomeIcon icon={faPaw} /> <span>{capitalize(house.mascot)}</span>
                    </div>
                    <div className="grid-item__info__item">
                      <FontAwesomeIcon icon={faHeading} /> <span>{house.headOfHouse}</span>
                    </div>
                    <div className="grid-item__info__item">
                      <FontAwesomeIcon icon={faGhost} /> <span>{house.houseGhost}</span>
                    </div>
                    <div className="grid-item__info__item">
                      <FontAwesomeIcon icon={faHatWizard} /> <span>{house.founder}</span>
                    </div>
                  </div>
                  <h4>Values</h4>
                  <div className="grid-item__info">
                    {house.values.map(value => (
                      <div className="grid-item__info__item" key={value}>
                        {capitalize(value)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <h2 id="spells">Spells</h2>
            <div className="table-wrapper">
              <ReactTable
                data={spells}
                columns={spellsColumns}
                defaultSorted={[{ id: 'spell', desc: false }]}
                defaultPageSize={20}
                pageSizeOptions={pageSizeOptions}
                filterable
              />
            </div>
            <h2 id="chars">Characters</h2>
            <div className="table-wrapper">
              <ReactTable
                data={chars}
                columns={charsColumns}
                defaultSorted={[{ id: 'name', desc: false }]}
                defaultPageSize={25}
                pageSizeOptions={pageSizeOptions}
                filterable
              />
            </div>
          </main>
          <footer>
            API is powered by <a href="https://www.potterapi.com/">potterapi.com</a>. Built with source plugin{' '}
            <a href="https://github.com/LekoArts/gatsby-source-potterapi">gatsby-source-potterapi</a> by{' '}
            <a href="https://www.lekoarts.de">LekoArts</a>.
          </footer>
        </div>
      </>
    )
  }
}

export const query = graphql`
  query IndexQuery {
    houses: allHarryPotterHouse(sort: { fields: name, order: ASC }) {
      edges {
        node {
          _id
          name
          mascot
          headOfHouse
          houseGhost
          founder
          values
          colors
        }
      }
    }
    spells: allHarryPotterSpell {
      edges {
        node {
          spell
          type
          effect
        }
      }
    }
    chars: allHarryPotterCharacter {
      edges {
        node {
          name
          role
          house {
            name
          }
          orderOfThePhoenix
          dumbledoresArmy
          deathEater
          alias
          patronus
        }
      }
    }
  }
`
