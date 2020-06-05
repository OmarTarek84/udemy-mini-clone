import { Subscription } from 'rxjs';
import { CourseService } from './../../services/courses.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss']
})
export class AllCoursesComponent implements OnInit, OnDestroy {

  allTheCoursess = [];
  allCoursesLoading: boolean = false;
  coursesSub: Subscription;
  coursesLoadingSub: Subscription;
  searchCo = '';

  selectedCategory = 'All';
  sortedDate = 'Newest';

  allCategories = [
    "All",
    'Development',
    'Business',
    'Design',
    'PersonalDevelopment',
    'Photography',
    'Health',
    'Translation',
  ];

  dateSorts = [
    'Oldest',
    'Newest'
  ]

  constructor(private coursesService: CourseService) { }

  ngOnInit(): void {
    this.allTheCoursess = this.coursesService.allCoursesGet();
    this.coursesSub = this.coursesService.allCoursesChanged.subscribe(cs => {
      this.allTheCoursess = cs;
    });
    this.coursesLoadingSub = this.coursesService.allCoursesLoading.subscribe(load => {
      this.allCoursesLoading = load;
    })
    if (history.state && history.state.catFromHeader && history.state.catFromHeader.title) {
      this.coursesService.getAllCourses('all', history.state.catFromHeader.title, 'Newest', 1);
      this.selectedCategory = history.state.catFromHeader.title;
    } else if (history.state && history.state.searchFromHomepage) {
      this.coursesService.getAllCourses(history.state.searchFromHomepage, 'All', 'Newest', 1);
      this.searchCo = history.state.searchFromHomepage;
    } else {
      this.coursesService.getAllCourses('all', 'All', 'Newest', 1);
    }
  }

  categoriesChange(e: MatSelectChange) {
    return this.coursesService.getAllCourses(this.searchCo, e.value, this.sortedDate, 1);
  }

  sortDateChange(e: MatSelectChange) {
    return this.coursesService.getAllCourses(this.searchCo, this.selectedCategory, e.value, 1);
  }

  searchAllCourses() {
    if (this.allCoursesLoading) {
      return null;
    }
    return this.coursesService.getAllCourses(this.searchCo, this.selectedCategory, this.dateSorts, 1);
  }

  clearAll() {
    this.searchCo = '';
    this.selectedCategory = 'All';
    this.sortedDate = 'Newest';
    return this.coursesService.getAllCourses('all', 'All', 'Newest', 1);
  }

  pageChange(e) {
    this.coursesService.getAllCourses(this.searchCo, this.selectedCategory, this.sortedDate, e);
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.coursesLoadingSub.unsubscribe();
  }

}
