var ArableLandStats = function (arableLandStatsFile, continentCountryFile, percOfLandArea1960_2015File, hectaresPerPerson1960_2015File, hectares1960_2015File, percOfLandAreaAfrican2010File, hectaresByContinent1960_2015File) {
  this.continentCountryFile = continentCountryFile;
  this.arableLandStatsFile = arableLandStatsFile;
  this.percOfLandArea1960_2015File = percOfLandArea1960_2015File;
  this.hectaresPerPerson1960_2015File = hectaresPerPerson1960_2015File;
  this.hectares1960_2015File = hectares1960_2015File;
  this.percOfLandAreaAfrican2010File = percOfLandAreaAfrican2010File;
  this.hectaresByContinent1960_2015File = hectaresByContinent1960_2015File;
  this.strSpliterOnComma = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
}
//
// function escapeRegExp(str) {
//   return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\$]/g, "\\$&");
// }

ArableLandStats.prototype.continentCountryLookUpMaker = function () {
  // console.log(this);
  var fs = require ('fs');
  var continentCountryLookUp = new Object();
  var strSpliterOnComma = this.strSpliterOnComma;

  fs.readFileSync(this.continentCountryFile).toString().split("\n").map(function(strLine){
    // console.log("**********************************");
    // console.log(this);

    if(strLine !== "") {
      // console.log(strLine);
      // console.log(this.strSpliterOnComma);
      var arrOfCells = strLine.split(strSpliterOnComma);
      // console.log(arrOfCells);
      arrOfCells[1] = arrOfCells[1].trim();
      if (arrOfCells[1] in continentCountryLookUp)
        continentCountryLookUp[arrOfCells[1]] += "|^"+ [arrOfCells[0]]
      else
        continentCountryLookUp[arrOfCells[1]] = "^" + [arrOfCells[0]];
    }
  });
  for(continent in continentCountryLookUp) {
    var escapeReg = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\$]/g;
    continentCountryLookUp[continent] = new RegExp(continentCountryLookUp[continent].replace(escapeReg, "\\$&"));
    // continentCountryLookUp[continent] = new RegExp(continentCountryLookUp[continent]);

  }
  return continentCountryLookUp;
}

function dataFormatterForIndiaStats(strLine, strSpliterOnComma, headerLine, statParam, indexFor1960) {
  var arrResultant = new Array();
  var arrOfCells = strLine.trim().split(strSpliterOnComma);
  // console.log(arrOfCells);
  console.log(indexFor1960);
  for(var headerIndex = indexFor1960; headerIndex < headerIndex + 56 ; headerIndex++) {

    var tempObj = new Object();
    tempObj["year"] = headerLine[headerIndex]
    if(arrOfCells[headerIndex] == '')
      tempObj[statParam] = 0;
    else
        tempObj[statParam] = parseInt(arrOfCells[headerIndex])
    console.log(tempObj);
    arrResultant<<tempObj;
  }// end of headerForLoop
  console.log(arrResultant);
  return arrResultant;
}

function continentFinder (continentCountryLookUp, strLine) {
  for (continent in continentCountryLookUp) {
    if (strLine.match(continentCountryLookUp[continent]))
      return continent;
  }
  return null;
}
ArableLandStats.prototype.allStatsGen = function () {
  var indexFor1960;
  var indexOf2010;
  var continent;
  var arrPercOfLandArea1960_2015 = new Array();
  var arrHectaresPerPerson1960_2015 = new Array();
  var arrHectares1960_2015   = new Array();
  var arrPercOfLandAreaAfrican2010   = new Array();
  var objHectaresByContinent1960_2015  = new Object();
  var fs = require('fs');
  var strText = fs.readFileSync(this.arableLandStatsFile).toString();
  var continentCountryLookUp = this.continentCountryLookUpMaker();
  var strSpliterOnComma = this.strSpliterOnComma;
  strText.split('\n').map(function (strLine, lineNum) {
    if(strLine !== "") {
      if(lineNum != 0) {

        var arrOfCells;
        if (strLine.indexOf("Arable land (% of land area)")>-1) {


          if(strLine.match("^India")) {
            //Arable land (% of land area) 1960 - 2015. data for India.
            //Resultant Array: arrPercOfLandArea1960_2015
            // console.log(indexFor1960);
            arrPercOfLandArea1960_2015 = dataFormatterForIndiaStats(strLine, strSpliterOnComma, headerLine, "percOfLandArea1960_2015", indexFor1960);
            console.log("************");
            console.log(arrPercOfLandArea1960_2015);
          }
          else if(strLine.match(continentCountryLookUp["Africa"])) {
            //Arable land (% of land area) for African countries in the year 2010.
            //Resultant Array: arrPercOfLandAreaAfrican2010
            arrOfCells = strLine.split(strSpliterOnComma);
            arrPercOfLandAreaAfrican2010<<{country: arrOfCells[0].trim(), percOfLandAreaAfrican2010: parseInt(indexOf2010) }
          }//end of Africa Conditional if

        }//end of % of land area Conditional if
        else if(strLine.indexOf("Arable land (hectares per person)")>-1 && strLine.match("^India")) {
          // Arable land (hectares per person). for India. 1960 - 2015
          //Resultant Array: arrHectaresPerPerson1960_2015
            arrHectaresPerPerson1960_2015 = dataFormatterForIndiaStats(strLine, strSpliterOnComma, headerLine,"hectaresPerPerson1960_2015", indexFor1960 );

        }//end of hectares per person if
        else if (strLine.indexOf("Arable land (hectares)")>-1){
          if(strLine.match("^India")) {
            //Arable land (hectares). for India. 1960 - 2015
            //Resultant Array: arrHectares1960_2015
            arrHectares1960_2015 = dataFormatterForIndiaStats(strLine,strSpliterOnComma, headerLine, "hectares1960_2015", indexFor1960);

          }
          else if (continent = continentFinder(continentCountryLookUp,strLine)){
            arrOfCells = strLine.split(strSpliterOnComma);
            var aggHectaresPerCountry = 0;
            for(headerIndex = indexFor1960; headerIndex < headerIndex + 56 ; headerIndex++) {
              aggHectaresPerCountry += parseInt(arrOfCells[headerIndex]);
            }
            if (continent in objHectaresByContinent1960_2015) {
              objHectaresByContinent1960_2015[continent]["hectaresPerContinent"] += aggHectaresPerCountry;

            }
            else {
              objHectaresByContinent1960_2015[continent] = {continent: continent, hectaresPerContinent: aggHectaresPerCountry};
            }
          }
        }
      }
      else {
        var headerLine = strLine.split(strSpliterOnComma);
        indexFor1960 = headerLine.indexOf("1960");
       indexOf2010 = headerLine.indexOf("2010");
       console.log("*************++++++" + indexOf2010);
      }
    }
  });//End of map of strText
  console.log(arrPercOfLandArea1960_2015);
  console.log(arrHectaresPerPerson1960_2015);
  console.log(arrHectares1960_2015  );
  console.log(arrPercOfLandAreaAfrican2010  );
  console.log(objHectaresByContinent1960_2015  );

}

var objArableStats = new ArableLandStats("inputFiles/WDI_Data.csv","inputFiles/continent-lookup-latest.csv","","","","","");
// console.log(objArableStats);
// var loopUp = objArableStats.continentCountryLookUpMaker();
objArableStats.allStatsGen();
// console.log(loopUp);
