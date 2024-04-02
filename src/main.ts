import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CommonModule } from '@angular/common';
const dbConfig: DBConfig = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'people',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: false } },
      ],
    },
  ],
};

@Component({
  selector: 'app-root',
  standalone: true,
  styles: [
    `
  ul{
    list-style: auto;
  }
  `,
  ],
  template: `
    <h1>Angular - stored data in indexdb</h1>
    <pre>{{people | json}}</pre>

    <ul>
  @for (user of people; track user.id) {
    <li>{{ user.name }}</li>
  } @empty {
    <span>Empty list of users</span>
  }
</ul>



  `,
  providers: [NgxIndexedDBService],
  imports: [CommonModule],
})
export class App {
  name = 'Angular';
  people: any[] = [];
  constructor(private dbService: NgxIndexedDBService) {
    this.dbService.clear('people').subscribe((successDeleted) => {
      console.log('success? ', successDeleted);
    });

    this.dbService
      .bulkAdd('people', [
        {
          name: `charles number ${Math.random() * 10}`,
          email: `email number ${Math.random() * 10}`,
        },
        {
          name: `charles number ${Math.random() * 10}`,
          email: `email number ${Math.random() * 10}`,
        },
      ])
      .subscribe((result) => {
        console.log('result: ', result);
      });
  }

  ngOnInit() {
    this.dbService.getAll('people').subscribe((result: any) => {
      console.log('results: ', result);
      this.people = result;
    });
  }
}

bootstrapApplication(App, {
  providers: [importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig))],
});
