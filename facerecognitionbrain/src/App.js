import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';


const app = new Clarifai.App({
 apiKey: '939526fe79d54ecdbdb57da4574c4d2b'
});
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

class App extends Component {

  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:'',
      route: 'Signin',
      isSignedIn: false  
    }
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
    console.log(Css_box)
    this.setState({ box: Css_box})
  }

  onSubmitButton = () => {
    this.setState({ imageUrl: this.state.input})
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err)) 

  }

  onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    else {
      this.setState({isSignedIn:false})
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
              <Rank />
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
                ? <Signin onRouteChange={this.onRouteChange} />
                : <Register onRouteChange={this.onRouteChange} /> 
            )
        }
      </div>
    );
  }
}

export default App;
