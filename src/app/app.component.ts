import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { HotelDataService } from './hotel-data.service';
import { Hotel } from './hotel.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'OpenStreetMap';
  private map!: L.Map;
  private markerLayer = L.layerGroup(); // Layer group for markers


  hotelDataList: Hotel[] = [];
  brandList: string[] = [];
  //hotelBrandNameList: Hotel[] = [];
  selectedValue: string = "";  // Change type from Hotel to string


  constructor(private _hotelData: HotelDataService) { }


  private initMap(): void {
    console.log("this.hotelDataList[i] latitude" + this.hotelDataList[0].latitude);
    console.log("this.hotelDataList[i] longitude" + this.hotelDataList[0].longitude);


    this.map = L.map('map', {
     // center: [51.505, -0.09], // Default center (latitude, longitude)
      center: [this.hotelDataList[0].latitude, this.hotelDataList[0].longitude], // Default center (latitude, longitude)

      zoom: 13
    });



    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);



    this.markerLayer.addTo(this.map); // Add marker layer
    this.updateMarkers();
  }

  private updateMarkers(): void {

    for (let i = 0; i < this.hotelDataList.length; i++) {
      let hotel = this.hotelDataList[i];
      console.log("hotel brandname === " + hotel.brandDataName);

   
      if (hotel.latitude && hotel.longitude && this.selectedValue =="All" || this.selectedValue == hotel.brandDataName) {
        const customIcon = L.icon({
          iconUrl: 'location.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -32]

        });
        const marker = L.marker([hotel.latitude, hotel.longitude], { icon: customIcon }).addTo(this.map)  // Ensure the marker is added to the map
          .bindPopup(`<b>${hotel.hotelName}</b>`)
          .openPopup();

        if (!this.markerLayer) {
          this.markerLayer = L.layerGroup().addTo(this.map);
        }

        this.markerLayer.addLayer(marker);
      } else {
        console.warn("Invalid coordinates for:", hotel);
        console.log(`Skipping hotel: ${hotel.hotelName} as the brand doesn't match.`);
        continue; // Skip to the next iteration if brand doesn't match
      }
    }
    
  }

  onSelect() {
   this.markerLayer.clearLayers(); // Clear existing markers

    this.updateMarkers();
  }
  ngOnInit(): void {
    this.loadHotelData();
  }


  loadHotelData() {
    this._hotelData.getHotelData().subscribe({
      next: (data) => {

        if (Array.isArray(data) && data.length > 0) {
          // Create a set to store unique brand names
          const uniqueBrands = new Set<string>();

          // Map the data and add brand names to the set
          this.hotelDataList = data.map(item => {
            uniqueBrands.add(item.brandName); // Collect unique brand names
            return {
              id: item.id,
              hotelName: item.hotelName,
              latitude: item.lat,
              longitude: item.long,
              brandDataName: item.brandName
            };
          });

          // Convert Set to Array and sort it (optional)
          this.brandList = ["All", ...Array.from(uniqueBrands)];

          this.selectedValue = this.brandList[0]; // ✅ No more error

          this.initMap();

        }
      },
      error: (err) => {
        console.error("Error fetching hotel data:", err);
      }
    });
  }


  ngAfterViewInit(): void {
    //this.initMap();
  }

 
}