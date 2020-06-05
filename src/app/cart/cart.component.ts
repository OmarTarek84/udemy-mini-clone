import { environment } from './../../environments/environment';
import { AuthServicee } from './../services/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { cartService } from '../services/cart.service';

declare let StripeCheckout: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  cartCourses = [];
  cartSub: Subscription;
  cartLoadingSub: Subscription;
  cartLoading = false;
  totalPrice = 0;

  stripeHandler: any;

  @HostListener('window:popstate')
    onPopState() {
      this.stripeHandler.close();
    }

  constructor(private cartService: cartService, private authService: AuthServicee) { }

  ngOnInit(): void {
    this.stripeHandler = StripeCheckout.configure({
      key: environment.stripeKey,
      locale: 'auto',
      token: token => {
        this.cartService.processPayment(token, this.totalPrice, this.cartCourses)
      }
    })
    this.cartCourses = this.cartService.cart;
    this.totalPrice = 0;
      this.cartCourses.forEach(c => {
        this.totalPrice += Number(c.coursePrice)
      })
    this.cartSub = this.cartService.cartChanged.subscribe(cart => {
      this.cartCourses = cart;
      this.totalPrice = 0;
      cart.forEach(c => {
        this.totalPrice += Number(c.coursePrice)
      })
    })
    this.cartLoadingSub = this.cartService.cartLoadingChanged.subscribe(load => {
      this.cartLoading = load;
    })
    if (this.cartService.reqFirstTIme) {
      this.cartService.getCart();
    }
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
    this.cartLoadingSub.unsubscribe();
  }

  removeCart(courseId) {
    this.cartService.removeCart(courseId);
  }

  moveToWishlist(courseId) {
    this.cartService.movetowishlist(courseId);
  }

  userDetails() {
    return this.authService.getUserDetails();
  }

  onClearCart() {
    this.cartService.clearCart();
  }

  openCheckout() {
    this.stripeHandler.open({
      name: 'udemy_clone Payment',
      description: 'Deposit Funds To Account',
      amount: this.totalPrice * 100
    });
  }

}
