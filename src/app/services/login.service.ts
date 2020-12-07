import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { ReplaySubject } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { Firebase } from '@ionic-native/firebase/ngx';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  DataLogin: any;
  DataCheckLogin: any;
  authenticationState = new ReplaySubject();
  token: any;
  dataUser: User[] = [];

  API_URL = 'https://simulasi-19.firebaseio.com/api';

  TOKEN_KEY = 'snOGHd6HiJqRHvSlEoiKy9db5lC9g9M8tmkCqBDf';

  constructor(
    private http: HttpClient,
    private platform: Platform,
    public toastController: ToastController,
    private firebase: Firebase
  ) {
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }

  //jika token tidak ada maka authenticationState=false
  //jika token ada maka akan memanggil fungsi cekUser 
  checkToken() {
    if (localStorage.getItem(this.TOKEN_KEY) == null || localStorage.getItem(this.TOKEN_KEY) == '') {
      this.authenticationState.next(false);
    } else {
      this.CekUser().subscribe(data => {
        this.DataCheckLogin = data;
        if (this.DataCheckLogin.status == "success") {
          this.authenticationState.next(true);
        } else {
          this.authenticationState.next(false);
        }
      },
        err => {
          this.authenticationState.next(false);
        });
    }
  }

  //cek user di sisi server dengan headers authorize bearer
  CekUser() {
    //ambil data dari localstorage
    let dataStorage = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
    this.token = dataStorage.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': "Bearer " + this.token
    });
    return this.http.get(this.API_URL + '/user.json?auth=' + this.token, { headers: headers }).pipe(
      timeout(8000),
      tap(Data => {
        return Data;
      })
    );
  }

  //login
  loginApi(credentials, type) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(this.API_URL + '/users.json?auth=' + this.TOKEN_KEY, { headers: headers }).pipe(
      tap(Data => {
        // this.DataLogin = Data;
        let listUser = new User;
        listUser.phone = Data[0];
        listUser.role = Data[1];
        this.dataUser.push(listUser);
        if (this.DataLogin.status == "success") {
          localStorage.setItem(this.TOKEN_KEY, JSON.stringify(Data));
          this.authenticationState.next(true);
        } else {
          this.authenticationState.next(false);
        }
        return Data;
      })
    );
  }

  //register
  // RegisterApi(credentials, type) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this.http.post(this.API_URL + type, credentials, { headers: headers }).pipe(
  //     tap(Data => {
  //       this.DataLogin = Data;
  //       if (this.DataLogin.status == "success") {
  //         localStorage.setItem(this.TOKEN_KEY, JSON.stringify(Data));
  //         this.authenticationState.next(true);
  //       } else {
  //         this.authenticationState.next(false);
  //       }
  //       return Data;
  //     })
  //   );
  // }

  //logout
  logout() {
    this.authenticationState.next(false);
  }
}
