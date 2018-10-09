import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { API, graphqlOperation } from "aws-amplify";

const ListCities = `
query list {
  listCitys {
    items{
      id name description
    }
  }
}
`;

const CreateCity = `
mutation($name: String!, $description: String) {
    createCity(input:{
    name:$name
    description:$description
  }){
    id name description
  }
}
`

const SubscribeToCities = `
subscription {
  onCreateCity {
    id name description
  }
}
`;

class App extends Component {

  state = {cities: [], name:"", description:""}
  async componentDidMount() {
    const cities = await API.graphql(graphqlOperation(ListCities))
    console.log('cities:', cities)
    this.setState({cities: cities.data.listCitys.items})

    //Cityが作られたイベントを購読
    API.graphql(
      graphqlOperation(SubscribeToCities)
    ).subscribe({
      next: (eventData) => {
        const city = eventData.value.data.onCreateCity
        const cities = [...this.state.cities.filter(content => {
          return ((content.name !== city.name) && (content.description !== city.description))
        }), city]
        console.log('eventData : ', eventData)
        this.setState({cities})
      }
    });
  }

  onChange = e => {
    this.setState({[e.target.name] : e.target.value})
  }

  //ここが graphQL を叩く部分
  createCity = async() => {
    if ((this.state.name === '') || (this.state.description === '')) return
    const city = {name: this.state.name, description: this.state.description}
    try {
      const cities = [...this.state.cities, city]
      this.setState({cities, name:"", description:""})
      await API.graphql(graphqlOperation(CreateCity, city))
      console.log('success')
    } catch (error) {
      console.log('error: ', error)
    }
  }

  render() {
    return (
      <div className="App">
        <div>
          <input value={this.state.name} name="name" onChange={this.onChange} />
          <input value={this.state.description} name="description" onChange={this.onChange} />
          <button onClick={this.createCity}>Create City</button>
        </div>
        {
          this.state.cities.map((content, index) => (
            <div key={index}>
              <h3>{content.name}</h3>
              <p>{content.description}</p>
            </div>
          ))
        }
      </div>
    );
  }
}

export default App;
