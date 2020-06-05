import { AuthServicee } from './../services/auth.service';
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { CourseService } from '../services/courses.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
})
export class CreateCourseComponent implements OnInit {
  targetIndex = 0;
  aboutForm: FormGroup;
  courseDetailForm: FormGroup;
  coursesectionForm: FormGroup;
  courseLoading = false;

  courseToBeEdited;
  editedImgURL = '';
  mode = 'create';

  aboutFormFinished = false;
  courseDetailFinished = false;
  courseFile;
  lessonVideos = [];
  progress = 0;
  courseId;

  constructor(
    private http: HttpClient,
    private courseService: CourseService,
    private authService: AuthServicee,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.aboutForm = new FormGroup({
      profession: new FormControl('', [Validators.required]),
      instructorDescription: new FormControl('', [Validators.required]),
    });
    this.courseDetailForm = new FormGroup({
      courseTitle: new FormControl('', [Validators.required]),
      courseSubtitle: new FormControl('', [Validators.required]),
      coursePrice: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      courseDescription: new FormControl('', [Validators.required]),
      studentLearn: new FormArray([new FormControl('', [Validators.required])]),
      courseRequirements: new FormArray([
        new FormControl('', [Validators.required]),
      ]),
      courseFile: new FormControl(''),
      courseCategory: new FormControl('Development', [Validators.required]),
    });
    this.coursesectionForm = new FormGroup({
      sections: new FormArray([this.createSections()]),
    });
    this.route.paramMap.subscribe((param: any) => {
      if (param && param.params && param.params.courseId) {
        this.mode = 'edit';
        this.initForm(param.params.courseId);
      } else {
        this.mode = 'create';
        this.initForm(null);
      }
    });
  }

  initForm(courseId) {
    if (courseId) {
      this.courseId = courseId;
      this.courseLoading = true;
      return this.http
        .get(
          environment.ip +
          `/courses/getCourseEdit?courseid=${courseId}`
        )
        .subscribe(
          (course: any) => {
            this.aboutFormFinished = true;
            this.courseDetailFinished = true;
            this.courseLoading = false;
            this.aboutForm.setValue({
              profession: course.profession,
              instructorDescription: course.instructorDescription,
            });
            this.courseDetailForm.patchValue({
              courseTitle: course.courseTitle,
              courseSubtitle: course.courseSubtitle,
              coursePrice: course.coursePrice,
              courseDescription: course.courseDescription,
              courseFile: {},
              courseCategory: course.courseCategory,
            });
            course.studentLearn.forEach((le) => {
              (<FormArray>(
                this.courseDetailForm.get('studentLearn')
              )).controls.push(new FormControl(le, [Validators.required]));
            });
            (<FormArray>this.courseDetailForm.get('studentLearn')).removeAt(0);

            course.courseRequirements.forEach((le) => {
              (<FormArray>(
                this.courseDetailForm.get('courseRequirements')
              )).controls.push(new FormControl(le, [Validators.required]));
            });
            (<FormArray>(
              this.courseDetailForm.get('courseRequirements')
            )).removeAt(0);

            this.editedImgURL = course.coursePhoto;
            //hereee
            (<FormArray>this.coursesectionForm.get('sections')).removeAt(0);
            course.sections.forEach((section, sectionIndex) => {
              const formG = new FormGroup({
                sectionName: new FormControl(section.sectionName, [
                  Validators.required,
                ]),
                sectionLessons: new FormArray(this.createEditLessons(section, sectionIndex)),
                SubmittedSectionName: new FormControl(
                  section.SubmittedSectionName
                ),
                mode: new FormControl('Done'),
              });
              (<FormArray>this.coursesectionForm.get('sections')).controls.push(formG);
            });
          },
          (err) => {
            this.mode = 'create';
            this.router.navigate(['/create-course']);
            this.courseLoading = false;
          }
        );
    } else {
      this.courseLoading = false;
      this.mode = 'create';
    }
  }

  createEditLessons(section: any, sectionIndex): any {
    // (<FormArray>this.coursesectionForm.get('sections')).controls.forEach(sec => {
    //   (<FormArray>sec.get('sectionLessons')).removeAt(0);
    // });
    let arr = [];
    section.sectionLessons.forEach((lesson, lesInd) => {
      arr.push(
        new FormGroup({
          lessonName: new FormControl(lesson.lessonName, [Validators.required]),
          lessonVideoFile: new FormControl(lesson.lessonVideoFile, [Validators.required]),
          SubmittedLessonName: new FormControl(lesson.SubmittedLessonName),
          lessonMode: new FormControl('Done'),
          videoName: new FormControl(lesson.videoName),
          videoDuration: new FormControl(lesson.videoDuration),
          lessonCheckMarked: new FormControl(''),
          uploadSuccess: new FormControl(true),
          uploadProgress: new FormControl(lesson.uploadProgress),
        })
      );
    });
    return arr;
  }

  changeStudentLearn() {
    this.courseDetailForm.get('studentLearn').updateValueAndValidity();
  }

  changeCourseReq() {
    this.courseDetailForm.get('courseRequirements').updateValueAndValidity();
  }

  onGoToTab(tabIndex) {
    if (tabIndex === 1) {
      this.aboutFormFinished = true;
    }
    if (tabIndex === 2) {
      this.courseDetailFinished = true;
    }
    this.targetIndex = tabIndex;
  }

  addLearn() {
    (<FormArray>this.courseDetailForm.get('studentLearn')).push(
      new FormControl('', [Validators.required])
    );
  }

  removeLearn(index) {
    if ((<FormArray>this.courseDetailForm.get('studentLearn')).length < 2) {
      return false;
    }
    (<FormArray>this.courseDetailForm.get('studentLearn')).removeAt(index);
  }

  addRequirement() {
    (<FormArray>this.courseDetailForm.get('courseRequirements')).push(
      new FormControl('', [Validators.required])
    );
  }

  removeRequirement(index) {
    if (
      (<FormArray>this.courseDetailForm.get('courseRequirements')).length < 2
    ) {
      return false;
    }
    (<FormArray>this.courseDetailForm.get('courseRequirements')).removeAt(
      index
    );
  }

  changeCoursePhoto(file) {
    this.courseFile = file;
    this.courseDetailForm.get('courseFile').setValue(file);
  }

  createLessons(): FormGroup {
    return new FormGroup({
      lessonName: new FormControl('', [Validators.required]),
      lessonVideoFile: new FormControl('', [Validators.required]),
      SubmittedLessonName: new FormControl(''),
      lessonMode: new FormControl('ToSubmit'),
      videoName: new FormControl(''),
      videoDuration: new FormControl(''),
      lessonCheckMarked: new FormControl(''),
      uploadSuccess: new FormControl('Ready To Upload'),
      uploadProgress: new FormControl(0),
    });
  }

  createSections(): FormGroup {
    return new FormGroup({
      sectionName: new FormControl('', [Validators.required]),
      sectionLessons: new FormArray([this.createLessons()]),
      SubmittedSectionName: new FormControl(''),
      mode: new FormControl('ToSubmit'),
    });
  }

  submitSectionName(i) {
    const control: AbstractControl = (<FormArray>(
      this.coursesectionForm.get('sections')
    )).controls[i];
    control
      .get('SubmittedSectionName')
      .setValue(control.get('sectionName').value);
    control.get('mode').setValue('Done');
  }

  editSecName(i) {
    const control: AbstractControl = (<FormArray>(
      this.coursesectionForm.get('sections')
    )).controls[i];
    control.get('mode').setValue('ToEdit');
  }

  submitLessonName(e) {
    const secioncontrol: AbstractControl = (<FormArray>(
      (<FormArray>this.coursesectionForm.get('sections')).controls[
        e.firstInd
      ].get('sectionLessons')
    )).controls[e.secondInd];
    secioncontrol
      .get('SubmittedLessonName')
      .setValue(secioncontrol.get('lessonName').value);
    secioncontrol.get('lessonMode').setValue('Done');
  }

  editLessonName(e) {
    const scontrol: AbstractControl = (<FormArray>(
      (<FormArray>this.coursesectionForm.get('sections')).controls[
        e.firstInd
      ].get('sectionLessons')
    )).controls[e.secondInd];
    scontrol.get('lessonMode').setValue('ToEdit');
  }

  addSection() {
    (<FormArray>this.coursesectionForm.get('sections')).push(
      this.createSections()
    );
  }

  removeSec(i) {
    const targetControl = <FormArray>this.coursesectionForm.get('sections');
    if (targetControl.length < 2) {
      return false;
    }
    targetControl.removeAt(i);
  }

  addLesson(e) {
    const targetControl = <FormArray>(
      (<FormArray>this.coursesectionForm.get('sections')).controls[e.sectionInd].get(
        'sectionLessons'
      )
    );
    targetControl.insert(e.lessonInd + 1, this.createLessons());
  }

  removeLesson(e) {
    const targetControl = <FormArray>(
      (<FormArray>this.coursesectionForm.get('sections')).controls[
        e.firstInd
      ].get('sectionLessons')
    );
    if (targetControl.length < 2) {
      return false;
    }
    targetControl.removeAt(e.secondInd);
  }

  videoFileChanged(e) {
    const controll = (<FormArray>(
      (<FormArray>this.coursesectionForm.get('sections')).controls[e.i].get(
        'sectionLessons'
      )
    )).controls[e.ind];
    controll.get('uploadSuccess').setValue('Uploading...');
    const formData = new FormData();
    formData.append('video', e.file);
    return this.http
      .post(
        environment.ip +
        '/courses/videos',
        formData,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.authService.getToken(),
          }),
          reportProgress: true,
          observe: 'events',
        }
      )
      .subscribe((res: any) => {
        if (res.type === HttpEventType.UploadProgress) {
          controll
            .get('uploadProgress')
            .setValue(Math.round((100 * res.loaded) / res.total));
          controll.get('uploadProgress').updateValueAndValidity();
          controll.get('uploadSuccess').setValue('Uploading...');
        } else if (res.type === HttpEventType.Response) {
          console.log('resss', res);
          controll.get('uploadSuccess').setValue('Upload Success');
          controll.get('uploadSuccess').updateValueAndValidity();
          controll.get('lessonVideoFile').setValue(res.body.fileLocation);
          controll.get('lessonVideoFile').updateValueAndValidity();
          controll
            .get('videoDuration')
            .setValue(
              `${Math.floor(e.minutes)}:${
                Math.round(e.seconds) >= 10
                  ? Math.round(e.seconds)
                  : '0' + Math.round(e.seconds)
              }`
            );
          controll.get('videoDuration').updateValueAndValidity();
          controll.get('videoName').setValue(e.file.name);
          this.coursesectionForm.get('sections').updateValueAndValidity();
        }
      }, err => {
        controll.get('uploadSuccess').setValue('Upload Error');
      });
  }

  changeSectionName() {
    this.coursesectionForm.get('sections').updateValueAndValidity();
  }

  changeLessonName() {
    this.coursesectionForm.get('sections').updateValueAndValidity();
  }

  createCourse() {
    if (this.mode === 'create') {
      this.courseService.createCourse(
        this.courseDetailForm.value,
        this.coursesectionForm.value,
        this.aboutForm.value,
        this.courseFile
      );
    } else {
      this.courseService.editCourse(
        this.courseDetailForm.value,
        this.coursesectionForm.value,
        this.aboutForm.value,
        this.courseFile,
        this.courseId,
        this.courseDetailForm.get('coursePrice').value
      );
    }
  }
}
