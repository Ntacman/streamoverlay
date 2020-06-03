var orgConfig = {
  "amazon": {
      "Logo": "logos/amazon.png",
      "Stylesheet": "styles/base.css"
  },
  "microsoft": {
      "Logo": "logos/microsoft.png",
      "Stylesheet": "styles/base.css"
  },
  "hulu": {
      "Logo": "logos/hulu.png",
      "Stylesheet": "styles/hulu.css"
  },
  "mvd": {
      "Logo": "logos/mvd.png",
      "Stylesheet": "styles/mvd.css"
  }
}

var urlParams = {};

function loadStylesheet(sheet) {
  // var link = document.createElement('link');

  // link.rel = 'stylesheet';
  // link.type = 'text/css';
  // link.href = sheet;

  var link_html = "<link rel=\"stylesheet\" " + "href=\"" + sheet + "\">"
  var link = $.parseHTML(link_html);
  $('head').append(link);
}

function getUrlParamCount() {
  return Object.keys(urlParams).length;
}

function getUrlVars() {
  if (getUrlParamCount() === 0) {
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      urlParams[key.toLowerCase()] = value;
    });
  }
  return urlParams;
}

function getUrlParam(parameter, defaultValue) {
  var urlParameter = defaultValue;
  if (parameter in urlParams) {
      urlParameter = urlParams[parameter];
  }
  return decodeURI(urlParameter);
}

function validateOrgParam(org)
{
  org = org.toLowerCase();
  if (org in orgConfig) return org;
  return "microsoft";
}

function fillDataFromVars() {
  // initialize company info
  var company = validateOrgParam(getUrlParam("org", "MS"));
  $('#logo').attr('src', orgConfig[company]["Logo"]);
  loadStylesheet(orgConfig[company]["Stylesheet"]);

  $('#p1_score').html(getUrlParam("p1score", "0"));
  $('#p2_score').html(getUrlParam("p2score", "0"));
  $('#p1_name').html(getUrlParam("p1name", "P1"));
  $('#p2_name').html(getUrlParam("p2name", "P2"));
  $('#round').html(getUrlParam("round", "Friendlies"));

  if (getUrlParam("instructions", "on") === "off") {
      $('#instructions').hide();
  }
}

function setDataFromJSON() {
  var company = data["org"].toLowerCase();
  document.getElementById("logo").src = orgConfig[company]["Logo"];
  loadStylesheet(orgConfig[company]["Stylesheet"]);

  var p1Score = document.getElementById("p1_score");
  var p1Name = document.getElementById("p1_name");
  var p2Score = document.getElementById("p2_score");
  var p2Name = document.getElementById("p2_name");
  var round = document.getElementById("round");

  p1Score.innerHTML = data["p1Score"];
  p2Score.innerHTML = data["p2Score"];
  p1Name.innerHTML = data["p1Name"];
  p2Name.innerHTML = data["p2Name"];
  round.innerHTML = data["round"];
}

// Page Load
var cssCount = document.styleSheets.length;
var ti = setInterval(function() {
  if (document.styleSheets.length > cssCount) {
      document.getElementById("page").style.display = "";
      clearInterval(ti);
  }
}, 10);
window.onload = function() {
  getUrlVars();
  if (location.hostname === "" && getUrlParamCount() === 0) {
      setDataFromJSON();
  } else {
      fillDataFromVars();
  }
}

// page events
function incrementScore(element) {
  var value = parseInt(element.innerHTML);
  element.innerHTML = (value + 1);
}

function decrementScore(element) {
  var value = parseInt(element.innerHTML);
  element.innerHTML = (value - 1);
}

function changeName(element) {
  var result = prompt("Enter a new name for " + element.id.substring(0, 2));
  if (result !== null && result !== "") {
      element.innerHTML = result;
  }
}

function convertUserInputToCharacter(input) {
  var lowcase = input.toLowerCase();
  var noWhitespace = lowcase.replace(/ /g, '_').replace(/-/g, '_');

  var remap = {
      "bayo": "bayonetta",
      "falcon": "captain_falcon",
      "doc": "dr_mario",
      "g&w": "mr_game_and_watch",
      "game_and_watch": "mr_game_and_watch",
      "ganon": "ganondorf",
      "puff": "jigglypuff",
      "d3": "king_dedede",
      "dedede": "king_dedede",
      "krool": "king_k_rool",
      "k_rool": "king_k_rool",
      "megaman": "mega_man",
      "pacman": "pac_man",
      "plant": "piranha_plant",
      "pt": "pokemon_trainer",
      "rosa": "rosalina_and_luma",
      "rosalina": "rosalina_and_luma",
      "wii_fit": "wii_fit_trainer",
      "zss": "zero_suit_samus",
  };

  var result = noWhitespace;
  if (remap[noWhitespace]) {
      result = remap[noWhitespace];
  }

  return result;
}

function changeCharacter(element) {
  var result = prompt("Enter character for " + element.id.substring(0, 2));
  if (result !== null && result !== "") {
      element.style.backgroundImage = "url(characters/" + convertUserInputToCharacter(result) + ".png)";
  }
}

function changeRound(element) {
  element.style.width = "";
  var result = prompt("Enter round title");
  if (result !== null && result !== "") {
      element.innerHTML = result;
  }
  element.style.width = element.offsetWidth + 10;
}

function swapSides() {
  var p1score = document.getElementById("p1_score");
  var p2score = document.getElementById("p2_score");
  var p1name = document.getElementById("p1_name");
  var p2name = document.getElementById("p2_name");

  [p1score.innerHTML, p2score.innerHTML] = [p2score.innerHTML, p1score.innerHTML];
  [p1name.innerHTML, p2name.innerHTML] = [p2name.innerHTML, p1name.innerHTML];
  [p1name.style.backgroundImage, p2name.style.backgroundImage] = [p2name.style.backgroundImage, p1name.style.backgroundImage]
}

function resetScores() {
  document.getElementById("p1_score").innerHTML = 0;
  document.getElementById("p2_score").innerHTML = 0;
}

document.onkeypress = function(e) {
  /*
  var displayString = "";
  displayString += "e.ctrlKey: " + e.ctrlKey + "</br>"; 
  displayString += "e.altKey: " + e.altKey + "</br>"; 
  displayString += "e.code: " + e.code + "</br>"; 
  displayString += "e.keyCode: " + e.keyCode + "</br>"; 
  displayString += "e.charCode: " + e.charCode + "</br>"; 
  document.getElementById("instructions").innerHTML = displayString;
  */
  if (e.keyCode == 117) { // u
      resetScores();
  } else if (e.keyCode == 121) { // y
      swapSides();
  } else if (e.keyCode == 106) { // j
      incrementScore(document.getElementById("p1_score"));
  } else if (e.keyCode == 107) { // k
      incrementScore(document.getElementById("p2_score"));
  } else if (e.keyCode == 110) { // n
      decrementScore(document.getElementById("p1_score"));
  } else if (e.keyCode == 109) { // m
      decrementScore(document.getElementById("p2_score"));
  } else if (e.keyCode == 111) { // o
      changeName(document.getElementById("p1_name"));
  } else if (e.keyCode == 112) { // p
      changeName(document.getElementById("p2_name"));
  } else if (e.keyCode == 59) { // semicolon
      changeCharacter(document.getElementById("p1_name"));
  } else if (e.keyCode == 39) { // single quote
      changeCharacter(document.getElementById("p2_name"));
  } else if (e.keyCode == 44) { // comma
      changeRound(document.getElementById("round"));
  }
}

$(document).ready(function() {

});