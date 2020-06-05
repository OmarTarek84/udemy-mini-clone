import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-course-sections',
  templateUrl: './course-sections.component.html',
  styleUrls: ['./course-sections.component.scss'],
})
export class CourseSectionsComponent implements OnInit, OnChanges {

  @Output() createCourse = new EventEmitter();
  @Output() submitSectionNameOutput = new EventEmitter();
  @Output() editSectionNameOutput = new EventEmitter();
  @Output() submitLessonNameOutput = new EventEmitter();
  @Output() editLessonNameOutput = new EventEmitter();
  @Output() addSectionOutput = new EventEmitter();
  @Output() onRemoveSectionOutput = new EventEmitter();
  @Output() uploadVideoOutput = new EventEmitter();
  @Output() addLessonOutput = new EventEmitter();
  @Output() removeLessonOutput = new EventEmitter();
  @Output() onCreateCourseOutput = new EventEmitter();
  @Output() changeSectionNameOutput = new EventEmitter();
  @Output() changeLessonNameOutput = new EventEmitter();

  @Input() courseSectionsForm: FormGroup;
  @Input() progress;
  @Input() uploadsuccess;
  @Input() mode;

  @ViewChild('videoUp', {static: false}) videoInput;

  theMode = 'create';
  sizeError = false;

  constructor() {}

  ngOnInit(): void {
    this.progress = 0;
    this.mode = 'create';
  }

  ngOnChanges(changes: SimpleChanges) {
    this.theMode = changes.mode.currentValue;
  }

  submitSectionName(e, i) {
    e.stopPropagation();
    this.submitSectionNameOutput.emit(i);
  }

  editSectionName(e, i) {
    e.stopPropagation();
    this.editSectionNameOutput.emit(i);
  }

  submitLessonName(e, i, ind) {
    e.stopPropagation();
    this.submitLessonNameOutput.emit({
      firstInd: i,
      secondInd: ind
    });
  }

  editLessonName(e, i, ind) {
    e.stopPropagation();
    this.editLessonNameOutput.emit({
      firstInd: i,
      secondInd: ind
    });
  }

  addSection() {
    this.addSectionOutput.emit();
  }

  onRemoveSection(e, i) {
    e.stopPropagation();
    this.onRemoveSectionOutput.emit(i);
  }

  uploadVideo(e, i, ind) {
    const file = e.target.files[0];
    const fileSize = file.size;
    const fileSizeInMB = fileSize / (1024*1024);
    if (fileSizeInMB > 7) {
      this.sizeError = true;
      setTimeout(() => {
        this.sizeError = false;
      }, 1500);
      this.videoInput.nativeElement.value = "";
      return;
    }
    const formData = new FormData();
    formData.append('video', file);
      let duration;
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const durationn = video.duration;
        duration = durationn;
        const minutes = duration / 60;
        const seconds = duration % 60;
        this.uploadVideoOutput.next({file: file, ind: ind, i: i, minutes: minutes, seconds: seconds});
      };
      video.src = URL.createObjectURL(file);
  }

  addLesson(e, i, ind) {
    e.stopPropagation();
    this.addLessonOutput.emit({
      sectionInd: i,
      lessonInd: ind
    });
  }

  removeLesson(e, i, ind) {
    e.stopPropagation();
    this.removeLessonOutput.emit({
      firstInd: i,
      secondInd: ind
    })
  }

  onFilterKeyboard(e) {
    e.stopPropagation();
  }

  onCreateCourse(e) {
    e.preventDefault();
    this.createCourse.emit();
  }

  changeSectionName() {
    this.changeSectionNameOutput.emit();
  }

  changeLessonName() {
    this.changeLessonNameOutput.emit();
  }
}
