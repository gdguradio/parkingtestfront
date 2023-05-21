import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userData: any;
  dropdownEntryPoints: { id: number, value: string, description: string }[] = [];
  dropdownParkingSlot: { id: number, location: string, size: string }[] = [];
  selectedEntryPoint: string = '';
  selectedVehicleType: string = '';
  selectedParkedSlot: string = '';

  timeInErrorMessage: string = '';
  timeOutErrorMessage: string = '';
  successResultMessage: string = '';
  isError: boolean = false;
  isSuccess: boolean = false;
  payloadTimeIn: {
    entryPoint: string;
    vehicleType: string;
  } = { entryPoint: '', vehicleType: '' }; // Initialize the payload property

  payloadTimeOut: {
    id: string;
  } = { id: ''}; // Initialize the payload property
  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.getUserData();
    this.loadDropdownValues();
  }

  loadDropdownValues(): void {
    this.apiService.getDropdownEntryPoints()
      .subscribe(response => {
        this.dropdownEntryPoints = response;
      });
    this.apiService.dropdownParkingSlot()
      .subscribe(response => {
        this.dropdownParkingSlot = response;
      });
  }

  onSubmitTimeIn(): void {
    // Implement the logic to handle the form submission
    // Access the selected values using this.selectedValue1 and this.selectedValue2
    console.log(this.selectedEntryPoint);
    // Create the payload object with the selected values
    const payloadTimeIn = {
      entryPoint: this.selectedEntryPoint,
      vehicleType: this.selectedVehicleType
    };
    if (!payloadTimeIn.entryPoint && !payloadTimeIn.vehicleType) {
      this.isError = true;
      this.timeInErrorMessage = 'Empty payload. Please provide the required data.';
      return;
    }

    if (!payloadTimeIn.entryPoint || !payloadTimeIn.vehicleType) {
      this.isError = true;
      this.timeInErrorMessage = 'Incomplete payload. Please provide all the required fields.';
      return;
    }

    this.apiService.submitDataTimeIn(payloadTimeIn)
      .subscribe(
        response => {
          try {
            const jsonResponse = JSON.parse(response);
            // Handle the JSON response here
            // ...
          } catch (error) {
            console.log('Response is not valid JSON:', response);
            // Handle the response as is
            // ...
          }
        },
        error => {
          console.log('Error:', error);
          console.log('Error:', error.error.text);
          this.timeInErrorMessage = error.error.text;
          if (error.error.text === 'Insert Successful') {
            this.isError = false;
            this.isSuccess = true;
          } else {
            this.isError = true;
            this.isSuccess = false;
          }
          // Handle the error here
          // ...
        }
      );

  }

  onSubmitTimeOut(): void {
    // Implement the logic to handle the form submission
    // Access the selected values using this.selectedValue1 and this.selectedValue2
    console.log(this.selectedParkedSlot);
    // Create the payload object with the selected values
    const payloadTimeOut = {
      id: this.selectedParkedSlot
    };

    interface TimeoutSuccessMessage {
      id: number;
      entryPoint: string;
      location: string;
      size: string;
      vehicleType:string;
      timeIn:string;
      timeOut:string;
      // Add other properties as needed
      amount: number; // Optional property, if 'amount' is present in the response
    }

    if (!payloadTimeOut.id) {
      this.isError = true;
      this.timeOutErrorMessage = 'Empty payload. Please provide the required data.';
      return;
    }
    this.apiService.submitDataTimeOut(payloadTimeOut)
      .subscribe(
        response => {
          try {
            const jsonResponse = JSON.parse(response);
            // Handle the JSON response here
            // ...
          } catch (error) {
            console.log('Response is not valid JSON:', response);
            // Handle the response as is
            // ...
          }
        },
        error => {
          console.log('Error:', error);
          console.log('Error:', error.error.text);
          this.timeOutErrorMessage = error.error.text;
          if (error.error.text === 'Update Success') {
            this.isError = false;
            this.isSuccess = true;
          } else {
            this.isError = true;
            this.isSuccess = false;
          }
          // Handle the error here
          if (error.error.text == "Update Success") {
            // Call another API using the http property from the ApiService
            this.apiService.http.get<TimeoutSuccessMessage>('http://127.0.0.1:8080/parking-slot/' + payloadTimeOut.id).subscribe(
              response => {
                // Handle the response from the second API call
                console.log('Second API Response:', response);
                const parkingSize = `${getSizeLabel(response.size)} Parking`;
                const vehicleSize = `${getSizeLabel(response.vehicleType)} Vehicle`;
                // this.successResultMessage = 'Total amount: ' + response.amount?.toString() ?? 'Amount not available';
                this.successResultMessage = `
                Entry Point: ${response.entryPoint}<br>
                Total Amount: ${response.amount?.toString()}<br>
                Time In: ${response.timeIn}<br>
                Time Out: ${response.timeOut}<br>
                Location: ${parkingSize}<br>
                Vehicle Type: ${vehicleSize}
              `;
              },
              error => {
                // Handle any error that occurred in the second API call
                console.log('Second API Error:', error);
                // ...
              }
            );
          }
        }
      );

    // Define a function to map the size value to the corresponding label
    function getSizeLabel(size: string): string {
      switch (size) {
        case 'SP':
          return 'Small';
        case 'MP':
          return 'Medium';
        case 'LP':
          return 'Large';
        default:
          return '';
      }
    }
  }

  getUserData(): void {
    this.apiService.getUserData()
      .subscribe(response => {
        this.userData = response;
      });
  }
}
