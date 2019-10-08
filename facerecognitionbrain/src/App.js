import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';

const particlesOptions = {
  "particles": {
    "number": {
      "value": 40,
      "density": {
        "enable": true,
        "value_area": 200
      }
    }
  }
}
const initialState = {
      input:'',
      imageUrl:'',
      box:'',
      route: 'Signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joining: ''
      }   
}
class App extends Component {

  constructor() {
    super();
    this.state = initialState
  }
  loadUser = (users) => {
    this.setState({user: {
      id: users.id,
      name: users.name,
      email: users.email,
      entries: users.entries,
      joining: users.joining
    }})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }
   calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (Css_box) => {
    this.setState({ box: Css_box})
  }

  onSubmitButton = () => {
    this.setState({ imageUrl: this.state.input})
      fetch('http://localhost:3000/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err)) 

  }

  onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    else if(route === 'signout') {
      this.setState(initialState)
    }
    this.setState({route: route})
  }  

  render() {
    const { isSignedIn, route, imageUrl, box } = this.state
    return (
      <div className="App" id="particlesJs">
        <Particles className='particles'
          params={particlesOptions}
          />
        <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onSubmitButton = {this.onSubmitButton} 
              />
              <FaceRecognition 
               box = {box}
               imageUrl = {imageUrl}
              />
            </div>
          : (
               this.state.route === 'Signin'
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
            )
        }
      </div>
    );
  }
}

export default App;
