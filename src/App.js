import React from "react";
import './assets/css/styles.css';
import './assets/css/bulma.min.css';
import vinylImg from "./assets/images/vinyl.jpg";

class App extends React.Component {
  /* initialize state */
  constructor(props) {
    super(props);
    this.state = {
        lastfmData: [],
        inputValue: '',
        DataisLoaded: false
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.numberFormat = this.numberFormat.bind(this);
  }
    /* clear the search bar */
    clearSearch(e) {
      e.preventDefault(); 
      this.setState({
        inputValue: ''
      });
    }
    /* update state as the user types */
    handleChange(e) {
      const val = e.target.value;   
      this.setState({
        inputValue: val
      });
      console.log(this.state.inputValue);
    }
    /* call LastFM API and get data for the searched artist */
    submitSearch(e) {
      e.preventDefault();
      let apiKey = process.env.REACT_APP_LASTFM_KEY;
      let artistName = this.state.inputValue.replace(/ /g, '+'); /* replace spaces with + */
      fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistName}&api_key=${apiKey}&format=json`).then((res) => res.json()).then((json) => {
        let artistData = json.results.artistmatches.artist;
        this.setState({
            lastfmData: artistData,
            DataisLoaded: true,
            inputValue: ''
        });
      })
    }
    numberFormat(val) {
      let newVal = parseInt(val).toLocaleString();
      return newVal;
    }
    render() {
      const { DataisLoaded, lastfmData, inputValue } = this.state;
      return (
        <div className = "App">
            <header>
              <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                  <a class="navbar-item logo" href="./">
                    <span class="icon">
                      <i class="fa fa-solid fa-music"></i>
                    </span>
                    <span class="logo-txt">&nbsp;&nbsp;LastFM Music Artist Search Engine</span>
                  </a>    
                  <a role="button" href="#" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="side-bar" onclick="toggleNav()">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                  </a>
                </div>
              </nav>
            </header>
            <section className="banner">
              <div className="header-wrapper">
                <h1>LastFM Music Artist<br />Search Engine</h1>
                <form className="custom-search">
                    <input id="search" type="text" className="input is-primary" value={inputValue} onChange={e => this.handleChange(e)} placeholder="Search for an artist..."/>
                    <button className="btn-search button is-primary" onClick={e => this.submitSearch(e)}>Search</button>
                    <button className="btn-clear button is-link" onClick={e => this.clearSearch(e)}>Clear</button>
                </form>
              </div>
            </section> 
            <main>
              {!DataisLoaded ? 
                <section className="no-data">
                  {/* displayed when there is no data in the artist state element */}
                  <h1>Search for an artist to see more details.</h1> 
                </section>
                :
                <section className="wrapper">
                  {
                      /* loop through and display each artist in the json object */
                      lastfmData.map((artist,idx) => ( 
                        <article className="artist-card" key={idx}>
                          <div className="post-wrapper">
                            <div class="post-content">
                              <div class="post-thumb">
                                <img src={vinylImg} alt={artist.name} />
                              </div>
                              <p>Artist name:&nbsp;<strong>{artist.name}</strong></p>
                              <p># Listeners:&nbsp;<strong>{this.numberFormat(artist.listeners)}</strong></p>
                            </div>
                            <div className="stream-box">
                              <p>Listen to the stream:&nbsp;<br /><a href={artist.url} target="_blank" rel="noreferrer"><strong>{artist.name}</strong></a></p>
                            </div>
                          </div>
                        </article>
                      ))
                  }
                </section>
              }
            </main>
            <footer className="footer">
              <h4>&copy; 2023 <a href="https://erin-m-keller.github.io/keller-portfolio/" target="_blank" rel="noreferrer">Erin Keller</a></h4>
              <p><a href="https://www.flaticon.com/free-icons/song" title="song icons">Song icons created by Freepik - Flaticon</a></p>
            </footer>
        </div>
      );
    }
}
   
export default App;
