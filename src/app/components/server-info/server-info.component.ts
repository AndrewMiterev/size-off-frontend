import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ServerService} from '../../services/server.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-server-info',
  templateUrl: './server-info.component.html',
  styleUrls: ['./server-info.component.scss']
})
export class ServerInfoComponent implements OnInit {
  serverName: string;
  loading: boolean;

  constructor(private route: ActivatedRoute, public service: ServerService, private location: Location) {
    route.params.subscribe(p => this.serverName = p.servername);
  }

  ngOnInit(): void {
    this.loading = true;
    this.service.getServerInfo(this.serverName).subscribe({
      complete: () => this.loading = false
    });
  }

  goBack(): void {
    this.location.back();
  }
}
