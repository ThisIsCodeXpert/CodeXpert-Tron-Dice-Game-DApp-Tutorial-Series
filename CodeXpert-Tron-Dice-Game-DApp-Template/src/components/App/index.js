import React from 'react';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';
import Swal from 'sweetalert2';


import './App.scss';

const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';

////////////////////////////////////////////////////////////////////////////////////
const contractAddress = '';   /// Add your contract address here
////////////////////////////////////////////////////////////////////////////////////

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

              tronWeb: {
                  installed: false,
                  loggedIn: false
              },
            }
        this.changeSide = this.changeSide.bind(this)
        this.init = this.init.bind(this)
        this.updateBetValue = this.updateBetValue.bind(this)
    }

    async componentDidMount() {

        this.setState({loading:true})
        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };

            if(tronWebState.installed) {
                this.setState({
                    tronWeb:
                    tronWebState
                });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if(tries >= 10) {
                    const TRONGRID_API = 'https://api.trongrid.io';

                    window.tronWeb = new TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

                if(!tronWebState.installed)
                    return tries++;

                this.setState({
                    tronWeb: tronWebState
                });

                resolve();
            }, 100);
        });

        if(!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', () => {
                if(this.state.tronWeb.loggedIn)
                    return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }

        await Utils.setTronWeb(window.tronWeb, contractAddress);


    }






    async changeSide() {

    }

    async roll() {

    };

    nextPlayer() {
    }

    init() {

    }


    startEventListener(){

    }

    async updateBetValue (evt) {

    }

    render() {
        if(!this.state.tronWeb.installed)
            return <TronLinkGuide />;

        if(!this.state.tronWeb.loggedIn)
            return <TronLinkGuide installed />;

        return (
              <div className='row'>
                <div className='col-lg-12 text-center' >
                  <hr/>

                      <div className="topnav">
                        <img src={'CodeXpert.png'} width="200"/>
                      </div>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>

                  <h1 className="topnav" style={{color : 'red' }}>TRON TRC20 TOKEN DICE GAME</h1>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>
                  <p> Your Address :  </p>
                  <br/>
                  <br/>



      <button className="btn btn-primary" onClick={(event) => {event.preventDefault()
                                                        this.init()}  }>Start New game </button>

      <br/>
      <br/>
      <br/>

      <div id="dice-game" style={{display:'none'}}>
          <div className="grid-container">
               <div className="player-0-panel active">
                  <div className="player-name" id="name-0">Player 1</div>
                  <div className="player-score" ></div>

               </div>
            <div className="player-1-panel">
              <div className="player-name" id="name-1">Player 2</div>
              <div className="player-score"></div>
            </div>
          </div>

          <div id="roll-button" className="div-bet">
               <input style={{ width:"100px" }} value='0' onChange={this.updateBetValue}/>

              <button className="btn-roll" onClick={(event) => {event.preventDefault()
                                                                              this.roll()}  }><i className="fas fa-dice fa-5x"></i></button>
              <p>Roll The Dice</p>
          </div>
      </div>


                </div>
              </div>
        );
    }
}

export default App;

