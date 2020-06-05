import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-about-you',
  templateUrl: './about-you.component.html',
  styleUrls: ['./about-you.component.scss']
})
export class AboutYouComponent implements OnInit {


  @Output() continueToSecondTab = new EventEmitter<any>();
  @Input() aboutYouForm;

  constructor() { }

  ngOnInit(): void {
  }

  onGoToCourseDetailsTab() {
    this.continueToSecondTab.emit();
  }

}
