// Liste over TFT-features vi er interessert i
var g_interestedInFeatures = [
  'counters',
  'match_info',
  'me',
  'roster',
  'store',
  'board',
  'bench',
  'carousel',
  'live_client_data',
  'augments',
  'game_info'
];

var onErrorListener, onInfoUpdates2Listener, onNewEventsListener;

// Åpne et deklarert vindu (f.eks. overlayet)
function openWindow(name) {
  overwolf.windows.obtainDeclaredWindow(name, result => {
    if (result.status === "success") {
      overwolf.windows.restore(result.window.id, console.log);
    } else {
      console.error("Klarte ikke åpne vindu:", result);
    }
  });
}

// Registrer game event listeners
function registerEvents() {
  onErrorListener = function(info) {
    console.log("Error: " + JSON.stringify(info));
  };

  onInfoUpdates2Listener = function(info) {
    console.log("Info UPDATE: " + JSON.stringify(info));
  };

  onNewEventsListener = function(info) {
    console.log("EVENT FIRED: " + JSON.stringify(info));
  };

  overwolf.games.events.onError.addListener(onErrorListener);
  overwolf.games.events.onInfoUpdates2.addListener(onInfoUpdates2Listener);
  overwolf.games.events.onNewEvents.addListener(onNewEventsListener);
}

// Fjern event listeners
function unregisterEvents() {
  overwolf.games.events.onError.removeListener(onErrorListener);
  overwolf.games.events.onInfoUpdates2.removeListener(onInfoUpdates2Listener);
  overwolf.games.events.onNewEvents.removeListener(onNewEventsListener);
}

// Funksjon som sjekker om spillet er TFT og ble startet
function gameLaunched(gameInfoResult) {
  if (!gameInfoResult || !gameInfoResult.gameInfo) return false;
  if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) return false;
  if (!gameInfoResult.gameInfo.isRunning) return false;
  if (Math.floor(gameInfoResult.gameInfo.id / 10) !== 5426) return false;

  console.log("TFT Launched");
  return true;
}

// Funksjon som sjekker om TFT allerede kjører
function gameRunning(gameInfo) {
  if (!gameInfo || !gameInfo.isRunning) return false;
  if (Math.floor(gameInfo.id / 10) !== 5426) return false;

  console.log("TFT running");
  return true;
}

// Sett opp hvilke game features vi vil ha
function setFeatures() {
  overwolf.games.events.setRequiredFeatures(g_interestedInFeatures, function(info) {
    if (info.status === "error") {
      console.log("Kunne ikke sette required features: " + info.reason);
      window.setTimeout(setFeatures, 2000);
      return;
    }

    console.log("Set required features:");
    console.log(JSON.stringify(info));
  });
}

// Lytt når spillet starter (eller endres)
overwolf.games.onGameInfoUpdated.addListener(function (res) {
  console.log("onGameInfoUpdated: " + JSON.stringify(res));
  if (gameLaunched(res)) {
    unregisterEvents();
    registerEvents();
    setTimeout(setFeatures, 1000);
    openWindow("index"); // 👈 Åpne overlay-vinduet
  }
});

// Ved oppstart: sjekk om TFT allerede kjører
overwolf.games.getRunningGameInfo(function (res) {
  console.log("getRunningGameInfo: " + JSON.stringify(res));
  if (gameRunning(res)) {
    registerEvents();
    setTimeout(setFeatures, 1000);
    openWindow("index"); // 👈 Åpne overlay-vinduet
  }
});
