import { AuthServicee } from './../../services/auth.service';
import { Router } from '@angular/router';
import { CourseService } from './../../services/courses.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.scss']
})
export class MyWishlistComponent implements OnInit, OnDestroy {

  originalWishlist = [];
  wishlist = [
  ];
  wishlistLoading = false;
  wishlistSub: Subscription;
  wishlistLoadingSub: Subscription;

  constructor(private courseService: CourseService, private router: Router, private authS: AuthServicee) { }

  ngOnInit(): void {
    this.wishlist = this.courseService.wishlistGet();
    this.originalWishlist = this.courseService.wishlistGet();
    this.wishlistSub = this.courseService.wishlistChanged.subscribe(cs => {
      this.originalWishlist = cs;
      this.wishlist = cs;
    });
    this.wishlistLoadingSub = this.courseService.wishlistLoading.subscribe(load => {
      this.wishlistLoading = load;
    })

    if (this.courseService.wishlistGet().length <= 0 || this.courseService.wishlistRouteFirstTime) {
      this.courseService.getWishlist(1);
    } else {
      this.wishlist = this.courseService.wishlistGet();
      this.originalWishlist = this.courseService.wishlistGet();
    }
  }

  searchCourses(e) {
    const value = e.target.value;
    const allWishlists = [...this.originalWishlist];
    if (value) {
      const filteredByTemplateAndVersionName = this.wishlist.filter(p => {
        return p.courseTitle.trim().toLowerCase().search(value.toLowerCase()) >= 0 ||
               p.courseSubtitle.trim().toLowerCase().search(value.toLowerCase()) >= 0 ||
               p.user.username.trim().toLowerCase().search(value.toLowerCase()) >= 0
      });
      this.wishlist = filteredByTemplateAndVersionName;
    } else {
      this.wishlist = allWishlists;
    }
  }

  pageChange(e) {
    this.courseService.getWishlist(e);
  }

  ngOnDestroy() {
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
    if (this.wishlistLoadingSub) {
      this.wishlistLoadingSub.unsubscribe();
    }
  }

}
