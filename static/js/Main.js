let game;
let net;
let ui;
let user;
window.onload = () => { 
    let params = new URLSearchParams(location.search)
    user = params.get("user")
    game = new Game();
    net = new Net();
    ui = new Ui();
}; 