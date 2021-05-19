import { Component, ComponentFactoryResolver, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { saveAs } from 'file-saver';
import * as sites from '../cache/markers.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  url = "";
  csvContent = "";

  test;
  globalListenFunc: Function;
  temp;
  north = 0;
  south = 0;
  east = 0;
  west = 0;
  staticLNG;
  staticLAT;
  isDraggable = true;
  shift = false;
  opacity = 1;

  dropdownSettings = {};

  title = 'gselector';
  maplat = 20;
  maplng = -50;
  sites;

  options1 = false;
  options2 = true;
  options3 = true;

  allStates = [];
  selectedStates = [];
  stateList = [];

  allNetworks = [];
  selectedNetworks = [];
  networkList = [];

  allCoNetworks = [];
  selectedCoNetworks = [];
  coNetworkList = [];

  allCountries = [];
  selectedCountries = [];
  countryList = [];

  allLandUse = [];
  selectedLandUse = [];
  landUseList = [];

  allLocSettings = [];
  selectedLocSettings = [];
  locSettingsList = [];

  allTimezones = [];
  selectedTimezones = [];
  timezonesList = [];

  allGMT = [];
  selectedGMT = [];
  GMTList = [];

  allNearRoad = [];
  selectedNearRoad = [];
  nearRoadList = [];

  maxElevation = 0;
  selectedMaxElevation = 0;
  minElevation = 0;
  selectedMinElevation = 0;

  startDateOut;
  endDateOut;
  startDate
  endDate;

  icons = ["../assets/red_marker.ico", "../assets/blue_marker.ico", "../assets/yellow_marker.ico", "../assets/green_marker.ico", "../assets/purple_marker.ico", "../assets/orange_marker.ico", "../assets/grey_marker.ico",
   "../assets/dark_red_marker.ico", "../assets/dark_blue_marker.ico", "../assets/dark_yellow_marker.ico", "../assets/dark_green_marker.ico", "../assets/dark_purple_marker.ico", "../assets/dark_orange_marker.ico", "../assets/dark_grey_marker.ico",
   "../assets/light_red_marker.ico", "../assets/light_blue_marker.ico", "../assets/light_yellow_marker.ico", "../assets/light_green_marker.ico", "../assets/light_purple_marker.ico", "../assets/light_orange_marker.ico", "../assets/light_grey_marker.ico",
   "../assets/black_marker.ico", "../assets/white_marker.ico", "../assets/white_marker.ico"
]

  markers = [];
  markerNumList = [0];

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private renderer: Renderer2) { }

  generate() {
    console.log("generating!")
    //clear out the currently redered markers
    this.markers = [];

    //clear out old O(1) arrays
    this.networkList = [];
    this.countryList = [];
    this.stateList = [];
    this.landUseList = [];
    this.locSettingsList = [];
    this.timezonesList = [];
    this.GMTList = [];
    this.nearRoadList = [];

    
    //create O(1) accesible arrays from dropdown selections
    this.updateOptions();



    let tempSite;
    //iterate through all sites
    for (let i = 0; i < sites.locations.length; i++) {
      //if site matches criteria
      if (
        this.networkFilter(i) &&
        this.countryFilter(i) &&
        this.stateFilter(i) &&
        this.miscFilter(i) &&
        this.dateFilter(i)
      ) {
        //create an temporary object
        tempSite = sites.locations[i];
        //append a color field based on network
        let j;
        for (j = 0; j < this.networkList.length; j++) { 
          if (this.networkList[j].includes(tempSite.network)) { break; } 
        }
        tempSite.icon = this.icons[j];
        this.markerNumList[j]++;
        //then push to markers which are later rendered on the map
        this.markers.push(tempSite);
      }
    }
    console.log("MarkerList:");
    console.log(this.markers);

    this.csvContent = "";
    for (let i = 0; i < this.markers.length; i++) {
      this.csvContent += this.markers[i].stat_id + "\n";
    }
  }
  
  //##################################################
  //Filters
  //##################################################
  networkFilter(i) {
    return this.networkList.some(el => sites.locations[i].network === el)
  }

  countryFilter(i) {
    return this.countryList.some(el => sites.locations[i].country === el)
  }

  stateFilter(i) {
    return this.stateList.some(el => sites.locations[i].state === el)
  }

  miscFilter(i) {
    // console.log(
    //   this.coNetworkList.some(el => sites.locations[i].co_network === el),
    // this.locSettingsList.some(el => sites.locations[i].loc_setting === el),
    // this.timezonesList.some(el => sites.locations[i].timezone === el),
    // this.GMTList.some(el => sites.locations[i].GMT_Offset === el),
    // this.nearRoadList.some(el => sites.locations[i].near_road === el)
    // )


    return Number(sites.locations[i].elevation) >= this.selectedMinElevation && Number(sites.locations[i].elevation) <= this.selectedMaxElevation &&
    this.landUseList.some(el => sites.locations[i].landuse === el) &&
    this.coNetworkList.some(el => sites.locations[i].co_network === el) &&
    this.locSettingsList.some(el => sites.locations[i].loc_setting === el) &&
    this.timezonesList.some(el => sites.locations[i].timezone === el) &&
    this.GMTList.some(el => sites.locations[i].GMT_Offset === el) &&
    this.nearRoadList.some(el => sites.locations[i].near_road === el)
  }

  dateFilter(i) {
    let tempStart = new Date(sites.locations[i].start_date);
    let tempEnd = new Date(sites.locations[i].end_date);
    //if no start or end date specified, return true
    //if both are specified, make sure date is whithin range
    //if only start date specified, test start dates
    //if only end date specified, test end dates
    if (this.startDate.getTime() === 0 && this.endDate.getTime() === 0) {
      return true;
    } else if (!(this.startDate.getTime() === 0) && !(this.endDate.getTime() ===0)) {
      if (tempStart >= this.startDate.getTime() && tempEnd <= this.endDate.getTime()) {
        return true;
      }
      return false;
    } else if (!(this.startDate.getTime() === 0)) {
      if (tempStart >= this.startDate.getTime()) {
        return true;
      }
      return false;
    } else if (!(this.endDate.getTime() ===0)) {
      if (tempEnd <= this.endDate.getTime()) {
        return true;
      }
      return false;
    }
    return false;
  }


  //##################################################
  //Helper functions
  //##################################################
  updateOptions() {
    for (let i = 0; i < this.selectedNetworks.length; i++) {
      this.networkList.push(this.selectedNetworks[i].itemName);
      this.markerNumList[i] = 0;
    }
    for (let i = 0; i < this.selectedCoNetworks.length; i++) {
      this.coNetworkList.push(this.selectedCoNetworks[i].itemName);
    }
    for (let i = 0; i < this.selectedCountries.length; i++) {
      this.countryList.push(this.selectedCountries[i].itemName);
    }
    for (let i = 0; i < this.selectedStates.length; i++) {
      this.stateList.push(this.selectedStates[i].itemName);
    }
    for (let i = 0; i < this.selectedLandUse.length; i++) {
      this.landUseList.push(this.selectedLandUse[i].itemName);
    }
    for (let i = 0; i < this.selectedLocSettings.length; i++) {
      this.locSettingsList.push(this.selectedLocSettings[i].itemName);
    }
    for (let i = 0; i < this.selectedTimezones.length; i++) {
      this.timezonesList.push(this.selectedTimezones[i].itemName);
    }
    for (let i = 0; i < this.selectedGMT.length; i++) {
      this.GMTList.push(this.selectedGMT[i].itemName);
    }
    for (let i = 0; i < this.selectedNearRoad.length; i++) {
      this.nearRoadList.push(this.selectedNearRoad[i].itemName);
    }
  
    this.startDate = new Date(this.startDateOut);
    this.endDate = new Date(this.endDateOut);
    if (isNaN(this.startDate)) {
      this.startDate.setTime(0);
    }
    if (isNaN(this.endDate)) {
      this.endDate.setTime(0);
    }
  }

  reconfig() {
    this.findOptions(this.markers)
    this.selectedNetworks = [...this.allNetworks];
    this.generate();
  }

  reset() {
    this.findOptions(sites.locations);
  }

  onChooseLocation(event) {
    this.opacity = 0;
    let extra = 1;
    if (this.shift) {
      console.log("Lat: " + event.coords.lat,
      "Lon: " + event.coords.lng)
      this.north = event.coords.lat+extra;
      this.east = event.coords.lng+extra;
      this.south = event.coords.lat-extra;
      this.west = event.coords.lng-extra;
      this.staticLNG = event.coords.lng;
      this.staticLAT = event.coords.lat;
    }
    
  }

  dragging(event) {
    if (this.opacity < .5) {
      console.log("check");
      this.north = event.coords.lat;
      this.south = event.coords.lat
      this.east = event.coords.lng
      this.west = event.coords.lng
    }
    this.opacity = .5;
    if (event.coords.lat > this.staticLAT) {
      this.north = event.coords.lat;
    } else {
      this.south = event.coords.lat;
    }

    if (event.coords.lng > this.staticLNG) {
      this.east = event.coords.lng;
    } else {
      this.west = event.coords.lng;
    }
  }

  dragEnd(event) {
    this.opacity = 1;
    this.deleteMarkersWithin();
    this.north = 0;
    this.east = 0;
    this.south = 0;
    this.west = 0;
    this.staticLNG = 0;
    this.staticLAT = 0;
  }

  dragStart(event) {
    this.opacity = 0;
    this.north = 0;
    this.east = 0;
    this.south = 0;
    this.west = 0;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardDown(event: KeyboardEvent) { 
    
    if (event.key === "Shift") {
      this.isDraggable = false;

      this.shift = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUp(event: KeyboardEvent) { 
    
    if (event.key === "Shift") {
      this.isDraggable = true;

      this.shift = false;
    }
  }

  zoomChange(event) {
    // console.log(event)
  }

  ngOnInit() {
    this.globalListenFunc = this.renderer.listen('document', 'keyup', e => {
      // console.log(e);
    });
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      // console.log(e);
    });
    this.findOptions(sites.locations);
    this.dropdownSettings = {
      singleSelection: false, 
      text:"Select",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class",
      badgeShowLimit: 3
    };
  }

  findOptions(siteArray) {
  this.allStates = [];
  this.selectedStates = [];
  this.stateList = [];

  this.allNetworks = [];
  this.selectedNetworks = [];
  this.networkList = [];

  this.allCoNetworks = [];
  this.selectedCoNetworks = [];
  this.coNetworkList = [];

  this.allCountries = [];
  this.selectedCountries = [];
  this.countryList = [];

  this.allLandUse = [];
  this.selectedLandUse = [];
  this.landUseList = [];

  this.allLocSettings = [];
  this.selectedLocSettings = [];
  this.locSettingsList = [];

  this.allTimezones = [];
  this.selectedTimezones = [];
  this.timezonesList = [];

  this.allGMT = [];
  this.selectedGMT = [];
  this.GMTList = [];

  this.allNearRoad = [];
  this.selectedNearRoad = [];
  this.nearRoadList = [];

  this.maxElevation = 0;
  this.selectedMaxElevation = 0;
  this.minElevation = 0;
  this.selectedMinElevation = 0;
    for (let i = 0; i < siteArray.length; i++) {
      if (!this.contains(siteArray[i].network, this.allNetworks)) {
        var tempObj = { id: i, itemName: siteArray[i].network };
        this.allNetworks.push(tempObj);
      }
      if (!this.contains(siteArray[i].co_network, this.allCoNetworks)) {
        var tempObj = { id: i, itemName: siteArray[i].co_network };
        this.allCoNetworks.push(tempObj);
      }
      if (!this.contains(siteArray[i].country, this.allCountries)) {
        var tempObj = { id: i, itemName: siteArray[i].country };
        this.allCountries.push(tempObj);
      }
      if (!this.contains(siteArray[i].state, this.allStates)) {
        var tempObj = { id: i, itemName: siteArray[i].state };
        this.allStates.push(tempObj);
      }
      if (Number(siteArray[i].elevation) > this.maxElevation) {
        this.maxElevation = Number(siteArray[i].elevation)
      }
      if (Number(siteArray[i].elevation) < this.minElevation) {
        this.minElevation = Number(siteArray[i].elevation)
      }
      if (!this.contains(siteArray[i].landuse, this.allLandUse)) {
        var tempObj = { id: i, itemName: siteArray[i].landuse };
        this.allLandUse.push(tempObj);
      }
      if (!this.contains(siteArray[i].loc_setting, this.allLocSettings)) {
        var tempObj = { id: i, itemName: siteArray[i].loc_setting };
        this.allLocSettings.push(tempObj);
      }
      if (!this.contains(siteArray[i].timezone, this.allTimezones)) {
        var tempObj = { id: i, itemName: siteArray[i].timezone };
        this.allTimezones.push(tempObj);
      }
      if (!this.contains(siteArray[i].GMT_Offset, this.allGMT)) {
        var tempObj = { id: i, itemName: siteArray[i].GMT_Offset };
        this.allGMT.push(tempObj);
      }
      if (!this.contains(siteArray[i].near_road, this.allNearRoad)) {
        var tempObj = { id: i, itemName: siteArray[i].near_road };
        this.allNearRoad.push(tempObj);
      }
    }

    this.selectedCountries = [...this.allCountries];
    this.selectedCoNetworks = [...this.allCoNetworks];
    this.selectedStates = [...this.allStates];
    this.selectedMaxElevation = this.maxElevation;
    this.selectedMinElevation = this.minElevation;
    this.selectedLandUse = [...this.allLandUse];
    this.selectedLocSettings = [...this.allLocSettings];
    this.selectedTimezones = [...this.allTimezones];
    this.selectedGMT = [...this.allGMT];
    this.selectedNearRoad = [...this.allNearRoad];
  }

  contains(name, array) {
    if (array === []) {
      return false;
    }
    for (var i = 0; i < array.length; i++) {
      if (array[i].itemName === name) {
        return true;
      }
    }
    return false;
  }

  deleteMarkersWithin() {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i].lon >= this.west && this.markers[i].lon <= this.east &&
        this.markers[i].lat >= this.south && this.markers[i].lat <= this.north) {
          this.markers.splice(i,1);
          i--;
        }
    }

    console.log(this.markers);
  }

  exportMarkers() {
    let file = new Blob([this.csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(file, 'helloworld.csv');
  }

  loadCSV(newCSV: string) {

  }
}


