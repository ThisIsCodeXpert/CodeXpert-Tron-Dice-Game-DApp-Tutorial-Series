import React from 'react';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';
import Swal from 'sweetalert2';


import './App.scss';

const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';

////////////////////////////////////////////////////////////////////////////////////
const contractAddress = 'TDtbmxg4zhHYYaVRa7eTpyprpQuL5XtWEw';   /// Add your contract address here
////////////////////////////////////////////////////////////////////////////////////
var activePlayer, cube, currentClass;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              tronwebaddress:'',
              score0:'',
              score1:'',
              betvalue:10,

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
        const tmp_tronwebaddress = Utils.tronWeb.address.fromHex(((await Utils.tronWeb.trx.getAccount()).address).toString())
        await this.setState({tronwebaddress : tmp_tronwebaddress});

        console.log("tmp_tronwebaddress", tmp_tronwebaddress);
        this.startEventListener();

    }






    async changeSide() {

        var dice = (Math.floor(Math.random()*6) + 1);
        var showClass = 'show-' + dice;
        if(currentClass){

            cube.classList.remove(currentClass);
        }
        cube.classList.add(showClass);

        if(activePlayer == 0){
            await this.setState({
              score0: dice
            });

            Utils.contract.placeBet(this.state.betvalue*100000000, dice).send({
                shouldPollResponse:true,
                callValue:0

            }).then(res => Swal({
                title:'Bet Successful',
                type: 'success'

            })).catch(err => Swal(
                {
                     title:'Bet Failed',
                     type: 'error'
                }
            ));

        }


        if(activePlayer == 1){
            await this.setState({
              score1: dice
            });

            Utils.contract.placeBet(this.state.betvalue*100000000, dice).send({
                shouldPollResponse:true,
                callValue:0

            }).catch(err => Swal(
                {
                     title:'Bet Failed',
                     type: 'error'
                }
            ));


        }

        this.nextPlayer();
    }

    async roll() {

      cube.classList.remove('animation-1');
      var counter = 0;
      var loopCount = 30;
      function spinCube() {

        if (++counter >= loopCount) {
            clearInterval(interval);
            cube.classList.remove('animation-2');
        } else {
            cube.classList.add('animation-2');
        }
      }
      var interval = setInterval(spinCube, 60);

      this.changeSide();


    };

    nextPlayer() {

      activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
      document.querySelector('.player-0-panel').classList.toggle('active');
      document.querySelector('.player-1-panel').classList.toggle('active');
      document.querySelector('.fa-dice').classList.toggle('fa-flip-horizontal');

    }

    init() {

          activePlayer = 0;

          cube = document.querySelector('.cube');

          this.setState({score0:0});
          this.setState({score1:0});

          document.getElementById('name-0').textContent = 'Player1';
          document.getElementById('name-1').textContent = 'Player2';
          document.querySelector('.player-0-panel').classList.remove('active');
          document.querySelector('.player-1-panel').classList.remove('active');
          document.querySelector('.player-0-panel').classList.add('active');
          document.querySelector('.dice').classList.remove('displaynone');
          cube.classList.add('animation-1');
          document.getElementById("dice-game").style.display = "block";
          document.getElementById("roll-button").style.display = "block";

    }


    startEventListener(){

    Utils.contract.DiceResult().watch((err, {result}) =>{

    if(err){return console.log("Failed to bind the event : ", err);}

    if(result.value == 1){

         Swal({
                title:'Player1 Won!',
                type: 'success'

            })
    }

    if(result.value == 2){

         Swal({
                title:'Player2 Won!',
                type: 'success'

            })
    }

    if(result.value == 0){

         Swal({
                title:'Match Draw!',
                type: 'success'

            })
    }

    })

    }

    async updateBetValue (evt) {

        await this.setState({
          betvalue: evt.target.value
        });
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
                  <p> Your Address : {this.state.tronwebaddress} </p>
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
                  <div className="player-score" >{this.state.score0}</div>

               </div>
            <div className="player-1-panel">
              <div className="player-name" id="name-1">Player 2</div>
              <div className="player-score">{this.state.score1}</div>
            </div>
          </div>

          <div id="roll-button" className="div-bet">
               <input style={{ width:"100px" }} value={this.state.betvalue} onChange={this.updateBetValue}/>

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

