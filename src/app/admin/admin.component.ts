import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  adminData: any;
  searchQuery: string;
  searchResults: string[];

  constructor(private apiService: ApiService) {
    this.searchQuery = '';
    this.searchResults = [];
  }

  ngOnInit(): void {
    this.getAdminData();
  }

  search(): void {
    this.apiService.searchData(this.searchQuery)
      .subscribe(results => {
        this.searchResults = results;
      });
  }

  getAdminData(): void {
    this.apiService.getAdminData()
      .subscribe(response => {
        this.adminData = response;
      });
  }
}
