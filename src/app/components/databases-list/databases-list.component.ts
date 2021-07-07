import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DatabaseInfo} from '../../services/server.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-databases-list',
  templateUrl: './databases-list.component.html',
  styleUrls: ['./databases-list.component.scss']
})
export class DatabasesListComponent implements AfterViewInit, OnInit {
  @Input()
  firms: DatabaseInfo[];
  displayedColumns: string[] = ['NN', 'firmName', 'dataBaseName', 'totalSize'];

  dataSource: MatTableDataSource<DatabaseInfo>;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }

  ngOnInit(): void {
    if (this.firms) {
      if (!this.firms[0].firmName) {
        const index = this.displayedColumns.indexOf('firmName');
        if (index >= 0) {
          this.displayedColumns.splice(index, 1);
        }
      }
      this.dataSource = new MatTableDataSource<DatabaseInfo>(this.firms.map((f, index) => {
        return {...f, NN: index + 1, totalSize: f.mdfSize + f.ldfSize};
      }));
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
}
