import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit, OnChanges {
  @Output() goToCourseSections = new EventEmitter<any>();
  @Output() addLearnOutput = new EventEmitter<any>();
  @Output() removeLearnOutput = new EventEmitter<any>();
  @Output() addReqOutput = new EventEmitter<any>();
  @Output() removeReqOutput = new EventEmitter<any>();
  @Output() fileChangedOutput = new EventEmitter<any>();
  @Output() studentLearnChangeOutput = new EventEmitter<any>();
  @Output() courseReqChangeOutput = new EventEmitter<any>();

  @Input() editedImage;
  @Input() courseDetailsForm: FormGroup;

  file;
  imgURL;
  sizeError = false;

  allCategories = [
    'Development',
    'Business',
    'Design',
    'PersonalDevelopment',
    'Photography',
    'Health',
    'Translation',
  ];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editedImage) {
      this.imgURL = changes.editedImage.currentValue;
    }
  }

  ngOnInit(): void {
    this.editedImage = '';
  }

  onGoToCourseSectionsTab() {
    this.goToCourseSections.emit();
  }

  onFileChanged(e) {
    this.file = e.target.files[0];
    const fileSize = this.file.size;
    const fileSizeInMB = fileSize / (1024*1024);
    if (fileSizeInMB > 2) {
      this.sizeError = true;
      setTimeout(() => {
        this.sizeError = false;
      }, 1500);
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(e.target.files[0]);

      reader.onload = (event) => {
        this.imgURL = event.target.result;
      };
    }
    this.fileChangedOutput.emit(this.file);
  }

  addLearn() {
    this.addLearnOutput.emit();
  }

  removeLearn(i) {
    this.removeLearnOutput.emit(i);
  }

  addRequirement() {
    this.addReqOutput.emit();
  }

  removeRequirement(i) {
    this.removeReqOutput.emit(i);
  }

  studentLearnChange() {
    this.studentLearnChangeOutput.emit()
  }

  courseReqChange() {
    this.courseReqChangeOutput.emit()
  }

}
