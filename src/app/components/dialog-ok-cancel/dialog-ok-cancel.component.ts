import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  question: string;
}

@Component({
  selector: 'app-dialog-ok-cancel',
  templateUrl: './dialog-ok-cancel.component.html',
  styleUrls: ['./dialog-ok-cancel.component.scss']
})
export class DialogOkCancelComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogOkCancelComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
  }
}
