import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private http: HttpClient) {
  }

  title = 'demoapp';
  firstName = '';
  lastName = '';
  vowelCount = 0;
  consonantCount = 0;
  reversedFirstName = '';
  reversedLastName = '';
  socialSkills: string[] = [];
  socialMedia: string[] = [];
  socialAddress: string[] = [];
  socialMediamap: { media: string, address: string }[] = [];

  // Method invoked by the form submit
  getValue(first: string, last: string, skills: string, media: string, address: string) {
    this.firstName = first;
    this.lastName = last;

    // Check for invalid input (empty first name or last name)
    if (this.isInvalidInput(this.firstName, this.lastName)) {
      alert('Please enter both first name and last name.');
      return;
    }

    // Perform various operations based on the input values
    this.calculateCounts();
    this.reverseNames();
    this.extractSocialSkills(skills);
    this.mapSocialMediaAndAddress(media, address);
    this.saveSessionData();
  }

  // Send data to an external API
  private loadPosts(data: string) {
    this.http.post('https://jsonplaceholder.typicode.com/posts', data).subscribe(response => {
      alert(JSON.stringify(response));
    });
  }

  // Validate if first name or last name is empty
  private isInvalidInput(firstName: string, lastName: string): boolean {
    return firstName.length === 0 || lastName.length === 0;
  }

  // Calculate vowel and consonant count in the combined first and last name
  private calculateCounts() {
    const fullName = this.firstName + this.lastName;
    this.vowelCount = this.countOccurrences(fullName.toLowerCase(), 'aeiou');
    this.consonantCount = this.countOccurrences(fullName.toLowerCase(), 'bcdfghjklmnpqrstvwxyz');
  }

  // Count occurrences of specific characters in a string
  private countOccurrences(str: string, characters: string): number {
    return str.split('').filter(char => characters.includes(char)).length;
  }

  // Reverse the first name and last name
  private reverseNames() {
    this.reversedFirstName = this.reverseString(this.firstName);
    this.reversedLastName = this.reverseString(this.lastName);
  }

  // Reverse a string
  private reverseString(str: string): string {
    return str.split('').reverse().join('');
  }

  // Extract social skills from a comma-separated string
  private extractSocialSkills(skills: string) {
    this.socialSkills = skills.split(',').map(skill => skill.trim());
  }

  // Map social media and addresses into an array of objects
  private mapSocialMediaAndAddress(media: string, address: string) {
    this.socialMedia = media.split(',').map(mediaItem => mediaItem.trim());
    this.socialAddress = address.split(',').map(addressItem => addressItem.trim());

    if (this.socialMedia.length === this.socialAddress.length) {
      this.socialMediamap = this.socialMedia.map((mediaItem, index) => ({
        media: mediaItem,
        address: this.socialAddress[index]
      }));
    }
  }

  // Save session data in local storage and send it to the external API
  private saveSessionData() {
    const jsonObject = {
      firstName: this.firstName,
      lastName: this.lastName,
      socialSkills: this.socialSkills,
      socialMediamap: this.socialMediamap
    };

    const jsonFormatted = JSON.stringify(jsonObject, null, 2);
    console.log(jsonFormatted);
    localStorage.setItem('session', jsonFormatted);
    this.loadPosts(jsonFormatted);
  }
}