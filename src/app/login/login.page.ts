import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  FormLogin:FormGroup;
  showPasswordText:any;
  dataLogin:any;
  
  constructor(
    private formBuilder: FormBuilder, 
    private navCtrl: NavController, 
    public loadingController: LoadingController,
    public modalController: ModalController,
    private platform: Platform,
    public toastController: ToastController,
    private loginSvc: LoginService,
  ) { }

  ngOnInit() {
    //form login
    this.FormLogin=this.formBuilder.group({
      Username:['',Validators.required],
      Password:['',Validators.required]
    });
  }

  //login
  async login(){
    //menampilkan loading
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present(); 
    //memanggil fungsi loginapi yang berada di service
    this.loginSvc.loginApi(this.FormLogin.value,'login').subscribe(
      data => {
        this.dataLogin=data;
        if(this.dataLogin.status=="error"){
          let message='Nama pengguna dan kata sandi yang Anda masukkan tidak cocok. Silahkan periksa dan coba lagi.';
          this.presentToast(message);
        }
        loading.dismiss();
      },
      error => {
        let message='Tidak ada koneksi internet. Silakan periksa koneksi Anda.';
        this.presentToast(message);
        loading.dismiss();
      }
    );
  }

  //menampilkan halaman register
  async registerModal() {
    const modal = await this.modalController.create({
      component: RegisterPage
    });
    return await modal.present();
  }

  async presentToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }

}
