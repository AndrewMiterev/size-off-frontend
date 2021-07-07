import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-callback-social-deletion',
  templateUrl: './callback-social-deletion.component.html',
  styleUrls: ['./callback-social-deletion.component.scss']
})
export class CallbackSocialDeletionComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      console.log('catch deletion callback', p);
    });
  }

}


